const express = require('express');
const router = express.Router();
const db = require('../../db');
const auth = require('../../middleware/authMiddleware');

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
    // If user is admin (and not viewing as student), show all (handled above)

    if (!req.user.org_id) {
      console.warn(`User ${req.user.email} has no Org ID. Returning empty exams list.`);
      return res.json({ exams: [] });
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

    console.log(`User ${req.user.email} (Org: ${req.user.org_id}) fetched ${q.rows.length} exams.`);
    res.json({ exams: q.rows });
  } catch (err) {
    console.error('Assigned exams error:', err);
    res.status(500).json({ error: 'failed to fetch exams' });
  }
});

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

    const attemptQ = await db.query(`
      SELECT id, question_ids, status
      FROM exam.attempts
      WHERE exam_id = $1
        AND user_id = $2
        AND status = 'in_progress'
      ORDER BY started_at_server DESC
      LIMIT 1
    `, [examId, req.user.id]);

    if (!attemptQ.rows[0]) {
      return res.status(400).json({ error: 'No active attempt found. Start exam first.' });
    }

    const attempt = attemptQ.rows[0];

    if (!attempt.question_ids || attempt.question_ids.length === 0) {
      return res.status(500).json({ error: 'Attempt has no stored questions' });
    }

    const questionsQ = await db.query(`
      SELECT 
        id, type, difficulty, content, choices, points
      FROM exam.questions
      WHERE id = ANY($1)
      ORDER BY array_position($1, id)
    `, [attempt.question_ids]);

    res.json({
      exam: examQ.rows[0],
      attemptId: attempt.id,
      questions: questionsQ.rows
    });
  } catch (err) {
    console.error('Single exam fetch error:', err);
    res.status(500).json({ error: 'failed to fetch exam' });
  }
});

module.exports = router;
