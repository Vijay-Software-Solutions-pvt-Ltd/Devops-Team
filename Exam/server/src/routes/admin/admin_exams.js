const express = require('express');
const router = express.Router();
const db = require('../../db');
const { v4: uuidv4 } = require('uuid');
const auth = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/roleCheck');
router.post('/create', auth, requireRole('admin'), async (req, res) => {
  // payload: { title, description, duration_minutes, start_date, end_date, org_id, questions: [{type,difficulty,content,choices,correct_answer,points}] }
  const { title, description, duration_minutes, start_date, end_date, org_id, questions } = req.body;
  try {
    const examId = uuidv4();
    await db.query(`INSERT INTO exam.exams (id, title, description, duration_minutes, start_date, end_date) VALUES ($1,$2,$3,$4,$5,$6)`, [examId, title, description || null, duration_minutes, start_date || null, end_date || null]);

    // assign to org
    if (org_id) {
      await db.query(`INSERT INTO exam.exam_assignments (id, exam_id, org_id) VALUES ($1,$2,$3)`, [uuidv4(), examId, org_id]);
    }

    // questions
    if (Array.isArray(questions)) {
      for (const [idx, q] of questions.entries()) {
        try {
          await db.query(`INSERT INTO exam.questions (id, exam_id, type, difficulty, content, choices, correct_answer, points) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [
            uuidv4(),
            examId,
            q.type,
            q.difficulty || 'normal',
            JSON.stringify(q.content || {}),
            q.choices ? JSON.stringify(q.choices) : null,
            q.correct_answer ? JSON.stringify(q.correct_answer) : null,
            q.points || 1
          ]);
        } catch (qErr) {
          console.error(`Failed to insert question index ${idx}:`, qErr);
          throw qErr; // Re-throw to cancel transaction (if we had one) or just fail
        }
      }
    }

    res.json({ ok: true, examId });
  } catch (err) {
    console.error("CREATE EXAM ERROR FULL:", err);
    if (err.code === '23503') {
      return res.status(400).json({ error: 'Invalid Organization ID (FK Violation)' });
    }
    res.status(500).json({ error: 'failed to create exam', details: err.message, stack: err.stack });
  }
});

// List exams for the logged-in user's org (or all for admin)
router.get('/assigned', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const q = await db.query(`
        SELECT e.*, o.name as org_name, o.id as assigned_org_id 
        FROM exam.exams e
        LEFT JOIN exam.exam_assignments ea ON ea.exam_id = e.id
        LEFT JOIN exam.organizations o ON o.id = ea.org_id
        ORDER BY e.created_at DESC
      `);
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

    // Include correct_answer for admin users
    let questionsQuery = 'SELECT id, type, difficulty, content, choices, points FROM exam.questions WHERE exam_id=$1';
    if (req.user.role === 'admin') {
      questionsQuery = 'SELECT id, type, difficulty, content, choices, correct_answer, points FROM exam.questions WHERE exam_id=$1';
    }
    const questionsQ = await db.query(questionsQuery, [id]);
    res.json({ exam: examQ.rows[0], questions: questionsQ.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to fetch exam' });
  }
});

// Update exam and upsert questions
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { title, description, duration_minutes, start_date, end_date, org_id, questions } = req.body;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // 1. Update Exam Meta
    await client.query(
      `UPDATE exam.exams 
       SET title=$1, description=$2, duration_minutes=$3, start_date=$4, end_date=$5 
       WHERE id=$6`,
      [title, description || null, duration_minutes, start_date || null, end_date || null, id]
    );

    // 2. Update Org Assignment if needed
    if (org_id) {
      // delete old assignment
      await client.query('DELETE FROM exam.exam_assignments WHERE exam_id=$1', [id]);
      // insert new
      await client.query(`INSERT INTO exam.exam_assignments (id, exam_id, org_id) VALUES ($1,$2,$3)`, [uuidv4(), id, org_id]);
    }

    // 3. Handle Questions: Delete removed ones, then upsert the rest
    if (Array.isArray(questions)) {
      // Get all existing question IDs from the database
      const existingQuestionsResult = await client.query(
        'SELECT id FROM exam.questions WHERE exam_id=$1',
        [id]
      );
      const existingQuestionIds = existingQuestionsResult.rows.map(row => row.id);
      
      // Get all question IDs from the request
      const requestQuestionIds = questions.filter(q => q.id).map(q => q.id);
      
      // Find questions to delete (exist in DB but not in request)
      const questionsToDelete = existingQuestionIds.filter(id => !requestQuestionIds.includes(id));
      
      // Delete removed questions
      for (const qId of questionsToDelete) {
        await client.query('DELETE FROM exam.questions WHERE id=$1', [qId]);
      }

      // Upsert questions
      for (const q of questions) {
        if (q.id) {
          // Update existing
          await client.query(
            `UPDATE exam.questions 
             SET type=$1, difficulty=$2, content=$3, choices=$4, correct_answer=$5, points=$6 
             WHERE id=$7`,
            [
              q.type,
              q.difficulty || 'normal',
              JSON.stringify(q.content || {}),
              q.choices ? JSON.stringify(q.choices) : null,
              q.correct_answer ? JSON.stringify(q.correct_answer) : null,
              q.points || 1,
              q.id
            ]
          );
        } else {
          // Insert new
          await client.query(
            `INSERT INTO exam.questions (id, exam_id, type, difficulty, content, choices, correct_answer, points) 
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [
              uuidv4(),
              id,
              q.type,
              q.difficulty || 'normal',
              JSON.stringify(q.content || {}),
              q.choices ? JSON.stringify(q.choices) : null,
              q.correct_answer ? JSON.stringify(q.correct_answer) : null,
              q.points || 1
            ]
          );
        }
      }
    }

    await client.query('COMMIT');
    res.json({ ok: true });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("UPDATE EXAM ERROR:", err);
    res.status(500).json({ error: 'Failed to update exam', details: err.message });
  } finally {
    client.release();
  }
});

router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    // Rely on CASCADE or delete manually. 
    // Safest to try deleting. If foreign keys exist (attempts), it might fail unless cascade is on.
    // For now, let's try deleting the exam.
    await db.query('DELETE FROM exam.exams WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error("DELETE EXAM ERROR:", err);
    res.status(500).json({ error: 'Failed to delete exam. It might have related attempts.' });
  }
});

module.exports = router;
