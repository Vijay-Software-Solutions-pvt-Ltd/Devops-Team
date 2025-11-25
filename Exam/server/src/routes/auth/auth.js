// server/src/routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const { hashPassword, comparePassword } = require('../../utils/hash');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

// Register (public) - optional org_id
router.post('/register', async (req, res) => {
  const { 
    name, 
    email, 
    password, 
    org_id, 
    role,
    mobile,
    department,
    sub_department 
  } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const hashed = await hashPassword(password);
    const userId = uuidv4();

    // 1️⃣ Insert into users table
    const userRes = await client.query(
      `INSERT INTO exam.users 
       (id, name, email, password_hash, role, org_id, is_active, created_at, created_by)
       VALUES ($1,$2,$3,$4,$5,$6,$7,now(),$8)
       RETURNING id, email, name, role, org_id`,
      [
        userId,
        name,
        email,
        hashed,
        role || 'student',
        org_id || null,
        true,
        null
      ]
    );

    // 2️⃣ Insert into user_details table
    await client.query(
      `INSERT INTO exam.user_details
       (user_id, email, mobile, department, sub_department)
       VALUES ($1, $2, $3, $4, $5)`,
      [
        userId,
        email,
        mobile || null,
        department || null,
        sub_department || null
      ]
    );

    await client.query('COMMIT');

    res.json({ user: userRes.rows[0] });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to register' });
  } finally {
    client.release();
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const q = await db.query('SELECT id, email, password_hash, name, role, org_id, is_active FROM exam.users WHERE email=$1', [email]);
    const user = q.rows[0];
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    if (user.is_active === false) return res.status(403).json({ error: 'Account inactive' });

    const ok = await comparePassword(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role, org_id: user.org_id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '60m'
    });

    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, org_id: user.org_id } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie("token");
  res.json({ ok: true });
});

module.exports = router;
