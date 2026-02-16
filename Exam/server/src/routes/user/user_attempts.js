const express = require('express');
const router = express.Router();
const db = require('../../db');
const auth = require('../../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch');
require('dotenv').config();

async function ensureAttemptOwnership(attemptId, userId) {
  const q = await db.query(
    'SELECT id, user_id, exam_id, started_at_server, allowed_duration, status FROM exam.attempts WHERE id=$1',
    [attemptId]
  );
  const attempt = q.rows[0];

  if (!attempt) {
    throw { code: 404, msg: 'Attempt not found' };
  }
  if (attempt.user_id !== userId) {
    throw { code: 403, msg: 'Forbidden' };
  }

  return attempt;
}

router.post('/start/:examId', auth, async (req, res) => {
  const { examId } = req.params;

  try {
    const examQ = await db.query(
      'SELECT id, duration_minutes FROM exam.exams WHERE id=$1',
      [examId]
    );
    if (!examQ.rows[0]) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const activeAttempt = await db.query(`
    SELECT id, attempt_token, allowed_duration
    FROM exam.attempts
    WHERE exam_id=$1 AND user_id=$2 AND status='in_progress'
    ORDER BY started_at_server DESC
    LIMIT 1
    `, [examId, req.user.id]);

    if (activeAttempt.rows[0]) {
      return res.json({
        attempt: {
          id: activeAttempt.rows[0].id,
          token: activeAttempt.rows[0].attempt_token,
          allowedDuration: activeAttempt.rows[0].allowed_duration
        }
      });
    }

    const exam = examQ.rows[0];
    const id = uuidv4();
    const token = uuidv4();
    const allowedSeconds = (exam.duration_minutes || 45) * 60;

    const questionsPick = await db.query(`
         SELECT id
         FROM exam.questions
         WHERE exam_id = $1
         ORDER BY RANDOM()
         LIMIT 20
         `, [examId]);

    const questionIds = questionsPick.rows.map(q => q.id);

    if (questionIds.length === 0) {
      return res.status(400).json({ error: 'No questions available for this exam' });
    }

    await db.query(
      `
      INSERT INTO exam.attempts 
      (id, user_id, exam_id, started_at_server, attempt_token, allowed_duration, status, question_ids)
      VALUES ($1,$2,$3,now(),$4,$5,'in_progress',$6)
      `,
      [id, req.user.id, examId, token, allowedSeconds, questionIds]
    );

    return res.json({
      attempt: { id, token, allowedDuration: allowedSeconds },
    });
  } catch (err) {
    console.error('Start attempt failed:', err);
    return res.status(500).json({ error: 'failed to start attempt' });
  }
});

router.post('/:attemptId/answer', auth, async (req, res) => {
  const { attemptId } = req.params;
  const { questionId, answerPayload } = req.body;

  try {
    await ensureAttemptOwnership(attemptId, req.user.id);

    const q = await db.query(
      'SELECT type FROM exam.questions WHERE id=$1',
      [questionId]
    );

    if (!q.rows[0]) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const userId = req.user.id;

    await db.query(
      `
      INSERT INTO exam.answers
        (user_id, attempt_id, question_id, answer_payload)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (attempt_id, question_id)
      DO UPDATE SET answer_payload = EXCLUDED.answer_payload
      `,
      [userId, attemptId, questionId, answerPayload]
    );

    return res.json({ ok: true });
  } catch (err) {
    console.error('Save answer failed:', err);
    return res.status(500).json({ error: 'failed to save answer' });
  }
});

/**
 * Submit attempt + calculate score
 */
router.post('/:attemptId/submit', auth, async (req, res) => {
  const { attemptId } = req.params;

  try {
    const attempt = await ensureAttemptOwnership(attemptId, req.user.id);

    await db.query(
      `UPDATE exam.attempts SET status='submitted', finished_at=now() WHERE id=$1`,
      [attemptId]
    );

    const answersQ = await db.query(
      `
      SELECT 
        a.id as ans_id, 
        a.question_id, 
        a.answer_payload, 
        q.correct_answer, 
        q.type, 
        q.points 
      FROM exam.answers a 
      JOIN exam.questions q ON a.question_id=q.id 
      WHERE a.attempt_id=$1
      `,
      [attemptId]
    );

    let totalScore = 0;
    for (const row of answersQ.rows) {
      if (row.type === 'mcq') {
        let correct = null;
        if (typeof row.correct_answer === 'string') {
          const parsed = JSON.parse(row.correct_answer);
          correct = parsed.correct;
        } else {
          correct = row.correct_answer?.correct;
        }

        let chosen = null;
        if (typeof row.answer_payload === 'string') {
          const parsed = JSON.parse(row.answer_payload);
          chosen = parsed.choice;
        } else {
          chosen = row.answer_payload?.choice;
        }

        const isCorrect = chosen === correct;
        const score = isCorrect ? row.points || 1 : 0;

        await db.query(
          'UPDATE exam.answers SET is_correct=$1, score=$2 WHERE id=$3',
          [isCorrect, score, row.ans_id]
        );
        totalScore += score;
      } else if (row.type === 'coding') {
        // Coding scoring can be added later if needed
      }
    }

    await db.query(
      'UPDATE exam.attempts SET total_score=$1 WHERE id=$2',
      [totalScore, attemptId]
    );

    res.json({ ok: true, totalScore });
  } catch (err) {
    console.error('Submit attempt failed:', err);
    return res.status(500).json({ error: 'failed to submit' });
  }
});

/**
 * (Legacy) Generic log endpoint (if older frontend uses /log)
 * Logs arbitrary events into exam.audit_logs
 */
router.post('/:attemptId/log', auth, async (req, res) => {
  const { attemptId } = req.params;
  const { eventType, meta } = req.body;

  try {
    const q = await db.query(
      'SELECT user_id FROM exam.attempts WHERE id=$1',
      [attemptId]
    );
    if (!q.rows[0]) {
      return res.status(404).json({ error: 'attempt not found' });
    }

    await db.query(
      `
      INSERT INTO exam.audit_logs (id, attempt_id, user_id, event_type, meta)
      VALUES ($1,$2,$3,$4,$5)
      `,
      [
        uuidv4(),
        attemptId,
        req.user.id,
        eventType,
        JSON.stringify(meta || {}),
      ]
    );

    // Only bump violation_count for certain events
    if (
      eventType === 'visibility_lost' ||
      eventType === 'devtools_open' ||
      eventType === 'multiple_tab'
    ) {
      await db.query(
        `
        UPDATE exam.attempts 
        SET violation_count = COALESCE(violation_count,0) + 1 
        WHERE id=$1
        `,
        [attemptId]
      );
    }

    res.json({ ok: true });
  } catch (err) {
    console.error('Generic log failed:', err);
    res.status(500).json({ error: 'failed to log' });
  }
});


router.post('/:attemptId/violation', auth, async (req, res) => {
  const { attemptId } = req.params;
  const { type, severity, timestamp } = req.body;

  try {
    const q = await db.query(
      'SELECT user_id FROM exam.attempts WHERE id=$1',
      [attemptId]
    );

    if (!q.rows[0]) {
      return res.status(404).json({ error: 'attempt not found' });
    }

    await db.query(
      `
      INSERT INTO exam.audit_logs 
      (id, attempt_id, user_id, event_type, meta)
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        uuidv4(),
        attemptId,
        req.user.id,
        type,
        JSON.stringify({ severity, timestamp }),
      ]
    );

    await db.query(
      `
      UPDATE exam.attempts
      SET violation_count = COALESCE(violation_count,0) + 1
      WHERE id=$1
      `,
      [attemptId]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error('Violation log failed:', err);
    res.status(500).json({ error: 'failed to log violation' });
  }
});

// If you still use server-side snapshot upload (base64 -> bucket)
const bucket = require('../../firebase');

/**
 * Snapshot URL: used by your CURRENT frontend
 * Frontend uploads to Firebase Storage, then sends imageUrl here.
 */
router.post('/:attemptId/snapshot-url', auth, async (req, res) => {
  const { attemptId } = req.params;
  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl missing' });
  }

  try {
    await db.query(
      `
      INSERT INTO exam.snapshots (id, attempt_id, user_id, image_url)
      VALUES ($1, $2, $3, $4)
      `,
      [uuidv4(), attemptId, req.user.id, imageUrl]
    );

    res.json({ ok: true });
  } catch (err) {
    console.error('Snapshot URL save failed:', err);
    res.status(500).json({ error: 'snapshot save failed' });
  }
});

/**
 * Resume: get active attempt for a user/exam
 */
router.get('/my-active/:examId', auth, async (req, res) => {
  const { examId } = req.params;

  try {
    const q = await db.query(
      `
      SELECT 
        id, 
        started_at_server, 
        allowed_duration, 
        attempt_token, 
        status 
      FROM exam.attempts 
      WHERE exam_id=$1 
        AND user_id=$2 
        AND status='in_progress'
      ORDER BY started_at_server DESC 
      LIMIT 1
      `,
      [examId, req.user.id]
    );

    if (!q.rows[0]) {
      return res.json({ attempt: null });
    }

    return res.json({ attempt: q.rows[0] });
  } catch (err) {
    console.error('Resume attempt failed:', err);
    res.status(500).json({ error: 'resume failed' });
  }
});

/**
 * Check if user has completed this exam
 */
router.get('/check-completed/:examId', auth, async (req, res) => {
  const { examId } = req.params;

  try {
    const q = await db.query(
      `
      SELECT id 
      FROM exam.attempts 
      WHERE exam_id=$1 
        AND user_id=$2 
        AND status='submitted'
      LIMIT 1
      `,
      [examId, req.user.id]
    );

    return res.json({ completed: q.rows.length > 0 });
  } catch (err) {
    console.error('Check completed failed:', err);
    res.status(500).json({ error: 'check failed', completed: false });
  }
});

module.exports = router;
