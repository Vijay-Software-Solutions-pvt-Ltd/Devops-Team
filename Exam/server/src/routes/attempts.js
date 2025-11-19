// server/src/routes/attempts.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');
const { v4: uuidv4 } = require('uuid');
const fetch = require('node-fetch'); 
require('dotenv').config();

async function ensureAttemptOwnership(attemptId, userId) {
  const q = await db.query('SELECT id, user_id, exam_id, started_at_server, allowed_duration, status FROM exam.attempts WHERE id=$1', [attemptId]);
  const attempt = q.rows[0];
  if (!attempt) throw { code: 404, msg: 'Attempt not found' };
  if (attempt.user_id !== userId && (attempt.user_id !== userId)) throw { code: 403, msg: 'Forbidden' };
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
    const allowedSeconds = (exam.duration_minutes || 30) * 60;
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

    // CODING QUESTION → send to grader_jobs
    if (q.rows[0].type === 'coding' && answerPayload.code) {

      const testcases = [
        { input: "1 2", expected: "3" },
        { input: "5 7", expected: "12" }
      ];

      await db.query(
        `INSERT INTO exam.grader_jobs (attempt_id, question_id, code, language_id, testcases)
         VALUES ($1,$2,$3,$4,$5)`,
        [
          attemptId,
          questionId,
          answerPayload.code,
          52, // JS Node Judge0 language
          JSON.stringify(testcases)
        ]
      );

      return res.json({ ok: true, message: "Coding answer queued for evaluation." });
    }

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

router.post('/:attemptId/snapshot', auth, async (req, res) => {
  const { attemptId } = req.params;
  const { imageBase64 } = req.body;
  try {
    const q = await db.query('SELECT id FROM exam.attempts WHERE id=$1', [attemptId]);
    if (!q.rows[0]) return res.status(404).json({ error: 'attempt not found' });
    await db.query('INSERT INTO exam.snapshots (id, attempt_id, user_id, image_base64) VALUES ($1,$2,$3,$4)', [uuidv4(), attemptId, req.user.id, imageBase64]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to upload snapshot' });
  }
});


router.post('/:attemptId/grade-coding', auth, async (req, res) => {
  const { attemptId } = req.params;
  const { language_id, source_code, stdin, testcases } = req.body; 
  try {
    const judgeUrl = process.env.JUDGE0_URL || 'https://judge0-extra.p.rapidapi.com'; 
    const body = {
      source_code,
      language_id,
      stdin: stdin || '',
      
    };
    const headers = {
      'Content-Type': 'application/json',
    };
    if (process.env.JUDGE0_KEY) headers['X-Auth-Token'] = process.env.JUDGE0_KEY;

    const r = await fetch(`${judgeUrl}/submissions?base64_encoded=false&wait=false`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    });
    const data = await r.json();
    res.json({ ok: true, token: data.token || data.token_id || data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to submit to grader', details: (err.message||err) });
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
