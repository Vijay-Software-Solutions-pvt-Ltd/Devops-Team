// server/src/routes/exams.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleCheck');

// Admin: create exam with questions + assign to org
router.post('/create', auth, requireRole('admin'), async (req, res) => {
  // payload: { title, description, duration_minutes, start_date, end_date, org_id, questions: [{type,difficulty,content,choices,correct_answer,points}] }
  const { title, description, duration_minutes, start_date, end_date, org_id, questions } = req.body;
  try {
    const examId = uuidv4();
    await db.query(`INSERT INTO exam.exams (id, title, description, duration_minutes, start_date, end_date, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7)`, [examId, title, description || null, duration_minutes, start_date || null, end_date || null, req.user.id]);

    // assign to org
    if (org_id) {
      await db.query(`INSERT INTO exam.exam_assignments (id, exam_id, org_id) VALUES ($1,$2,$3)`, [uuidv4(), examId, org_id]);
    }

    // questions
    if (Array.isArray(questions)) {
      for (const q of questions) {
        await db.query(`INSERT INTO exam.questions (id, exam_id, type, difficulty, content, choices, correct_answer, points) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [
          uuidv4(), examId, q.type, q.difficulty || 'normal', q.content || {}, q.choices ? q.choices : null, q.correct_answer ? q.correct_answer : null, q.points || 1
        ]);
      }
    }

    res.json({ ok: true, examId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to create exam' });
  }
});

// List exams for the logged-in user's org (or all for admin)
router.get('/assigned', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const q = await db.query('SELECT * FROM exam.exams ORDER BY created_at DESC');
      return res.json({ exams: q.rows });
    }

    const q = await db.query(`
      SELECT e.id, e.title, e.description, e.start_date, e.end_date, e.duration_minutes
      FROM exam.exams e
      JOIN exam.exam_assignments ea ON ea.exam_id = e.id
      LEFT JOIN exam.attempts a ON a.exam_id = e.id AND a.user_id = $1
      WHERE ea.org_id = $2
      AND (a.status IS NULL OR a.status != 'submitted')
    `, [req.user.id, req.user.org_id]);

    res.json({ exams: q.rows });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to list exams' });
  }
});

// Get exam meta (no answers). Admin can get full details
router.get('/:id', auth, async (req, res) => {
  const { id } = req.params;
  try {
    const examQ = await db.query('SELECT id, title, description, start_date, end_date, duration_minutes FROM exam.exams WHERE id=$1', [id]);
    if (!examQ.rows[0]) return res.status(404).json({ error: 'not found' });

    const questionsQ = await db.query('SELECT id, type, difficulty, content, choices, points FROM exam.questions WHERE exam_id=$1', [id]);
    res.json({ exam: examQ.rows[0], questions: questionsQ.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to fetch exam' });
  }
});

module.exports = router;
