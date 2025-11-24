// server/src/routes/user_attempts.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const auth = require('../../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch'); 
require('dotenv').config();

async function ensureAttemptOwnership(attemptId, userId) {
  const q = await db.query('SELECT id, user_id, exam_id, started_at_server, allowed_duration, status FROM exam.attempts WHERE id=$1', [attemptId]);
  const attempt = q.rows[0];
  if (!attempt) throw { code: 404, msg: 'Attempt not found' };
  if (attempt.user_id !== userId) {
  throw { code: 403, msg: 'Forbidden' };
}
  return attempt;
}

router.post('/start/:examId', auth, async (req, res) => {
  const { examId } = req.params;
  try {
    const examQ = await db.query('SELECT id, duration_minutes FROM exam.exams WHERE id=$1', [examId]);
    if (!examQ.rows[0]) return res.status(404).json({ error: 'Exam not found' });
    const exam = examQ.rows[0];
    const id = uuidv4();
    const token = uuidv4(); 
    const allowedSeconds = (exam.duration_minutes || 45) * 60;
    await db.query(
      `INSERT INTO exam.attempts (id, user_id, exam_id, started_at_server, attempt_token, allowed_duration, status)
        VALUES ($1,$2,$3,now(),$4,$5,'in_progress')`,
      [id, req.user.id, examId, token, allowedSeconds]
    );
    return res.json({ attempt: { id, token, allowedDuration: allowedSeconds } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'failed to start attempt' });
  }
});

router.post('/:attemptId/answer', auth, async (req, res) => {
  const { attemptId } = req.params;
  const { questionId, answerPayload } = req.body;

  try {
    const q = await db.query(`SELECT type FROM exam.questions WHERE id=$1`, [questionId]);

    if (!q.rows[0]) {
      return res.status(404).json({ error: 'Question not found' });
    }

    const type = q.rows[0].type;

    // ✅ Coding questions now just save — no grader_jobs
    if (type === 'coding') {
      await db.query(
        `INSERT INTO exam.answers (attempt_id, question_id, answer_payload)
         VALUES ($1,$2,$3)
         ON CONFLICT (attempt_id, question_id)
         DO UPDATE SET answer_payload = EXCLUDED.answer_payload`,
        [attemptId, questionId, JSON.stringify(answerPayload)]
      );
      return res.json({ ok: true, message: "Coding answer saved (grading disabled)" });
    }

    // ✅ Normal save for other questions
    await db.query(
      `INSERT INTO exam.answers (attempt_id, question_id, answer_payload)
       VALUES ($1,$2,$3)
       ON CONFLICT (attempt_id, question_id)
       DO UPDATE SET answer_payload = EXCLUDED.answer_payload`,
      [attemptId, questionId, JSON.stringify(answerPayload)]
    );

    return res.json({ ok: true, message: "Answer saved." });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'failed to save answer' });
  }
});

router.post('/:attemptId/submit', auth, async (req, res) => {
  const { attemptId } = req.params;
  try {
    const attempt = await ensureAttemptOwnership(attemptId, req.user.id);
    await db.query(`UPDATE exam.attempts SET status='submitted', finished_at=now() WHERE id=$1`, [attemptId]);

    const answersQ = await db.query('SELECT a.id as ans_id, a.question_id, a.answer_payload, q.correct_answer, q.type, q.points FROM exam.answers a JOIN exam.questions q ON a.question_id=q.id WHERE a.attempt_id=$1', [attemptId]);
    let totalScore = 0;
    for (const row of answersQ.rows) {
      if (row.type === 'mcq') {
        const correct = row.correct_answer && row.correct_answer.correct;
        const chosen = row.answer_payload && row.answer_payload.choice;
        const isCorrect = (chosen === correct);
        const score = isCorrect ? (row.points || 1) : 0;
        await db.query('UPDATE exam.answers SET is_correct=$1, score=$2 WHERE id=$3', [isCorrect, score, row.ans_id]);
        totalScore += score;
      } else if (row.type === 'coding') {
        if (row.answer_payload && row.answer_payload.code) {
        }
      }
    }

    await db.query('UPDATE exam.attempts SET total_score=$1 WHERE id=$2', [totalScore, attemptId]);
    res.json({ ok: true, totalScore });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'failed to submit' });
  }
});

router.post('/:attemptId/log', auth, async (req, res) => {
  const { attemptId } = req.params;
  const { eventType, meta } = req.body;
  try {
    const q = await db.query('SELECT user_id FROM exam.attempts WHERE id=$1', [attemptId]);
    if (!q.rows[0]) return res.status(404).json({ error: 'attempt not found' });
    const attemptOwner = q.rows[0].user_id;
    await db.query(
      `INSERT INTO exam.audit_logs (id, attempt_id, user_id, event_type, meta) VALUES ($1,$2,$3,$4,$5)`,
      [uuidv4(), attemptId, req.user.id, eventType, JSON.stringify(meta || {})]
    );

    if (eventType === 'visibility_lost' || eventType === 'devtools_open' || eventType === 'multiple_tab') {
      await db.query('UPDATE exam.attempts SET violation_count = COALESCE(violation_count,0) + 1 WHERE id=$1', [attemptId]);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to log' });
  }
});

const bucket = require("../../firebase");

router.post('/:attemptId/snapshot', auth, async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { imageBase64 } = req.body;

    const buffer = Buffer.from(imageBase64, "base64");

    const fileName = `exam-monitoring/${req.user.id}/${attemptId}/${Date.now()}.png`;
    const file = bucket.file(fileName);

    await file.save(buffer, {
      metadata: { contentType: "image/png" }
    });

    const url = `https://storage.googleapis.com/${bucket.name}/${fileName}`;

    // ✅ Save URL in database instead of base64
    await db.query(
      `INSERT INTO exam.snapshots (id, attempt_id, user_id, image_url)
       VALUES ($1,$2,$3,$4)`,
      [uuidv4(), attemptId, req.user.id, url]
    );

    res.json({ ok: true, url });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "upload failed" });
  }
});

router.post('/:attemptId/snapshot-url', auth, async (req, res) => {
  const { attemptId } = req.params;
  const { imageUrl } = req.body;

  try {
    await db.query(`
      INSERT INTO exam.snapshots (id, attempt_id, user_id, image_base64)
      VALUES ($1, $2, $3, $4)
    `, [
      require('uuid').v4(),
      attemptId,
      req.user.id,
      imageUrl   
    ]);

    res.json({ ok: true });
  } catch (err) {
    console.error("Snapshot URL save failed:", err);
    res.status(500).json({ error: 'snapshot save failed' });
  }
});

router.get('/my-active/:examId', auth, async (req, res) => {
  const { examId } = req.params;

  try {
    const q = await db.query(`
      SELECT id, started_at_server, allowed_duration, attempt_token, status 
      FROM exam.attempts 
      WHERE exam_id=$1 AND user_id=$2 AND status='in_progress'
      ORDER BY started_at_server DESC 
      LIMIT 1
    `, [examId, req.user.id]);

    if (!q.rows[0]) {
      return res.json({ attempt: null });
    }

    return res.json({ attempt: q.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'resume failed' });
  }
});

module.exports = router;
