const express = require('express');
const router = express.Router();
const db = require('../../db');
const auth = require('../../middleware/authMiddleware');

/**
 * Get all attempts with filters
 */
router.get('/', auth, async (req, res) => {
    try {
        const { org_id, user_id, exam_id } = req.query;

        let query = `
      SELECT 
        a.id, 
        a.user_id, 
        u.name as user_name, 
        u.email as user_email, 
        u.org_id, 
        o.name as org_name,
        a.exam_id, 
        e.title as exam_title, 
        a.started_at_server, 
        a.finished_at, 
        a.status, 
        a.total_score 
      FROM exam.attempts a
      JOIN exam.users u ON a.user_id = u.id
      LEFT JOIN exam.organizations o ON u.org_id = o.id
      JOIN exam.exams e ON a.exam_id = e.id
      WHERE 1=1
    `;

        const params = [];
        let paramIndex = 1;

        if (org_id) {
            query += ` AND u.org_id = $${paramIndex}`;
            params.push(org_id);
            paramIndex++;
        }

        if (user_id) {
            query += ` AND a.user_id = $${paramIndex}`;
            params.push(user_id);
            paramIndex++;
        }

        if (exam_id) {
            query += ` AND a.exam_id = $${paramIndex}`;
            params.push(exam_id);
            paramIndex++;
        }

        query += ` ORDER BY a.started_at_server DESC LIMIT 100`;

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching results:', err);
        res.status(500).json({ error: 'Failed to fetch results' });
    }
});

/**
 * Get detailed result for a specific attempt
 */
router.get('/:attemptId', auth, async (req, res) => {
    try {
        const { attemptId } = req.params;

        // Fetch attempt details
        const attemptQuery = `
      SELECT 
        a.id, 
        a.user_id, 
        u.name as user_name, 
        u.email as user_email, 
        u.org_id, 
        o.name as org_name,
        a.exam_id, 
        e.title as exam_title, 
        a.started_at_server, 
        a.finished_at, 
        a.status, 
        a.total_score 
      FROM exam.attempts a
      JOIN exam.users u ON a.user_id = u.id
      LEFT JOIN exam.organizations o ON u.org_id = o.id
      JOIN exam.exams e ON a.exam_id = e.id
      WHERE a.id = $1
    `;

        const attemptResult = await db.query(attemptQuery, [attemptId]);

        if (attemptResult.rows.length === 0) {
            return res.status(404).json({ error: 'Attempt not found' });
        }

        const attempt = attemptResult.rows[0];

        // Fetch answers
        const answersQuery = `
      SELECT 
        ans.id,
        ans.question_id,
        q.content as question_text,
        q.type as question_type,
        q.choices as question_options,
        q.correct_answer,
        ans.answer_payload,
        ans.is_correct,
        ans.score,
        q.points as max_points
      FROM exam.answers ans
      JOIN exam.questions q ON ans.question_id = q.id
      WHERE ans.attempt_id = $1
      ORDER BY q.id
    `;

        const answersResult = await db.query(answersQuery, [attemptId]);

        res.json({
            attempt,
            answers: answersResult.rows
        });

    } catch (err) {
        console.error('Error fetching result details:', err);
        res.status(500).json({ error: 'Failed to fetch result details' });
    }
});

module.exports = router;
