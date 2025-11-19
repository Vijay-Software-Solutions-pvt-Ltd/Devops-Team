// server/src/routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleCheck');
const { v4: uuidv4 } = require('uuid');

router.get('/attempts', auth, requireRole('admin'), async (req, res) => {
  const q = await db.query(`SELECT a.id,a.user_id,u.email,a.exam_id,a.status,a.started_at_server,a.finished_at,a.total_score,a.violation_count FROM exam.attempts a JOIN exam.users u ON a.user_id=u.id ORDER BY a.started_at_server DESC LIMIT 500`);
  res.json({ attempts: q.rows });
});

router.get('/attempts/:id', auth, requireRole('admin'), async (req, res) => {
  const id = req.params.id;
  const attemptQ = await db.query('SELECT * FROM exam.attempts WHERE id=$1', [id]);
  if (!attemptQ.rows[0]) return res.status(404).json({ error: 'not found' });
  const answersQ = await db.query('SELECT * FROM exam.answers WHERE attempt_id=$1', [id]);
  const logsQ = await db.query('SELECT * FROM exam.audit_logs WHERE attempt_id=$1 ORDER BY event_ts ASC', [id]);
  const snapsQ = await db.query('SELECT id, captured_at FROM exam.snapshots WHERE attempt_id=$1', [id]);
  res.json({ attempt: attemptQ.rows[0], answers: answersQ.rows, logs: logsQ.rows, snapshots: snapsQ.rows });
});

router.get('/report/exam/:examId', auth, requireRole('admin'), async (req, res) => {
  const examId = req.params.examId;
  const q = await db.query(`SELECT a.id as attempt_id, u.email, a.total_score, a.violation_count, a.status FROM exam.attempts a JOIN exam.users u ON a.user_id=u.id WHERE a.exam_id=$1 ORDER BY a.total_score DESC`, [examId]);
  res.json({ rows: q.rows });
});

router.post('/create', auth, requireRole('admin'), async (req,res)=>{
  const {title, description, duration_minutes, start_date, end_date, org_id, questions} = req.body;

  const exam_id = uuidv4();
  await db.query(`
    INSERT INTO exam.exams (id,title,description,duration_minutes,start_date,end_date,created_by)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
  `, [exam_id,title,description,duration_minutes,start_date,end_date,req.user.id]);

  // Assign exam to orgs
  await db.query(`
    INSERT INTO exam.exam_assignments (exam_id,org_id) VALUES ($1,$2)
  `, [exam_id, org_id]);

  // Insert questions
  for (const q of questions) {
    await db.query(`
      INSERT INTO exam.questions (id,exam_id,type,difficulty,content,choices,correct_answer,points)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    `,
    [uuidv4(), exam_id, q.type, q.difficulty, q.content, q.choices||null, q.correct_answer||null, q.points||1]
    );
  }

  res.json({ exam_id });
});

const { Parser } = require('json2csv');
router.get('/download/exam/:examId', auth, requireRole('admin'), async (req,res) => {
  const examId = req.params.examId;
  const q = await db.query(`SELECT a.id as attempt_id, u.email, a.total_score, a.violation_count, a.status FROM exam.attempts a JOIN exam.users u ON a.user_id=u.id WHERE a.exam_id=$1 ORDER BY a.total_score DESC`, [examId]);
  const fields = ['attempt_id','email','total_score','violation_count','status'];
  const parser = new Parser({ fields });
  const csv = parser.parse(q.rows);
  res.header('Content-Type', 'text/csv');
  res.attachment(`exam_${examId}_report.csv`);
  res.send(csv);
});

module.exports = router;
