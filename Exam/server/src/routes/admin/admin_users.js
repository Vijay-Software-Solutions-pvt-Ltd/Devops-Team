// server/src/routes/adminUsers.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const { v4: uuidv4 } = require('uuid');
const auth = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/roleCheck');
const { hashPassword } = require('../../utils/hash');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Setup nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Helper: random password
function randomPassword() {
  return Math.random().toString(36).slice(-10) + Math.floor(Math.random() * 9000);
}

// Create or bulk create users: JSON body { users: [{name, email, mobile}], org_id }
router.post('/bulk-create', auth, requireRole('admin'), async (req, res) => {
  const { users, org_id } = req.body;
  if (!Array.isArray(users) || users.length === 0) return res.status(400).json({ error: 'users array required' });

  const created = [];
  try {
    for (const u of users) {
      const pwd = randomPassword();
      const hashed = await hashPassword(pwd);
      const id = uuidv4();
      await db.query(`INSERT INTO exam.users (id, name, email, password_hash, org_id, role, is_active, created_by) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [id, u.name || null, u.email, hashed, org_id || null, 'user', true, req.user.id]);

      // send email with credentials (best effort)
      const mail = {
        from: process.env.EMAIL_FROM,
        to: u.email,
        subject: 'Your exam credentials',
        text: `Hello ${u.name || ''},\n\nYour account has been created.\nEmail: ${u.email}\nPassword: ${pwd}\nOrganization ID: ${org_id}\n\nPlease change your password after login.`
      };
      transporter.sendMail(mail).catch(err => console.error('Email error', err));

      created.push({ id, email: u.email });
    }
    res.json({ created });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'bulk create failed' });
  }
});

// Activate/deactivate
router.post('/:userId/activate', auth, requireRole('admin'), async (req, res) => {
  const { userId } = req.params;
  const { active } = req.body;
  try {
    await db.query('UPDATE exam.users SET is_active=$1 WHERE id=$2', [active ? true : false, userId]);
    const result = await db.query(`
      SELECT u.id, u.name, u.email, u.role, u.org_id, u.is_active, u.created_at, o.name as org_name
      FROM exam.users u
      LEFT JOIN exam.organizations o ON o.id = u.org_id
      WHERE u.id=$1
    `, [userId]);
    res.json({ ok: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'update failed' });
  }
});

// Update user details
router.put('/:userId', auth, requireRole('admin'), async (req, res) => {
  const { userId } = req.params;
  const { name, email, role, org_id } = req.body;
  try {
    await db.query(
      'UPDATE exam.users SET name=$1, email=$2, role=$3, org_id=$4 WHERE id=$5',
      [name, email, role, org_id || null, userId]
    );
    const result = await db.query(`
      SELECT u.id, u.name, u.email, u.role, u.org_id, u.is_active, u.created_at, o.name as org_name
      FROM exam.users u
      LEFT JOIN exam.organizations o ON o.id = u.org_id
      WHERE u.id=$1
    `, [userId]);
    res.json({ ok: true, user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Hard delete
router.delete('/:userId/hard-delete', auth, requireRole('admin'), async (req, res) => {
  const { userId } = req.params;
  try {
    await db.query('DELETE FROM exam.users WHERE id=$1', [userId]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    if (err.code === '23503') {
      return res.status(400).json({ error: 'User has related data (exam attempts/results) and cannot be hard deleted.' });
    }
    res.status(500).json({ error: 'Hard delete failed' });
  }
});

// List users (admin)
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const q = await db.query(`
      SELECT u.id, u.name, u.email, u.role, u.org_id, u.is_active, u.created_at, o.name as org_name
      FROM exam.users u
      LEFT JOIN exam.organizations o ON o.id = u.org_id
      ORDER BY u.created_at DESC 
      LIMIT 1000
    `);
    res.json({ users: q.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'failed to list users' });
  }
});

module.exports = router;
