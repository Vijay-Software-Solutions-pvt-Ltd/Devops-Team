// server/src/routes/user_exams.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const auth = require('../../middleware/authMiddleware');

// ✅ Get assigned exams
router.get('/assigned', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const q = await db.query(`
        SELECT id, title, description, start_date, end_date, duration_minutes
        FROM exam.exams
        ORDER BY start_date DESC
      `);
      return res.json({ exams: q.rows });
    }

    const q = await db.query(`
      SELECT 
        e.id,
        e.title,
        e.description,
        e.start_date,
        e.end_date,
        e.duration_minutes
      FROM exam.exams e
      JOIN exam.exam_assignments ea ON ea.exam_id = e.id
      LEFT JOIN exam.attempts a 
        ON a.exam_id = e.id 
        AND a.user_id = $1
      WHERE ea.org_id = $2
        AND (a.status IS NULL OR a.status <> 'submitted')
      ORDER BY e.start_date ASC
    `, [req.user.id, req.user.org_id]);

    res.json({ exams: q.rows });
  } catch (err) {
    console.error('Assigned exams error:', err);
    res.status(500).json({ error: 'failed to fetch exams' });
  }
});

// ✅ Get single exam by ID
router.get('/:examId', auth, async (req, res) => {
  const { examId } = req.params;

  try {
    const examQ = await db.query(`
      SELECT 
        id, title, description, start_date, end_date, duration_minutes
      FROM exam.exams
      WHERE id = $1
    `, [examId]);

    if (!examQ.rows[0]) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const questionsQ = await db.query(`
      SELECT 
        id, type, difficulty, content, choices, points
      FROM exam.questions
      WHERE exam_id = $1
      ORDER BY id ASC
    `, [examId]);

    res.json({
      exam: examQ.rows[0],
      questions: questionsQ.rows
    });
  } catch (err) {
    console.error('Single exam fetch error:', err);
    res.status(500).json({ error: 'failed to fetch exam' });
  }
});

module.exports = router;
