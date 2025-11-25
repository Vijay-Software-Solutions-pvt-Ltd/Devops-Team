// server/src/routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const { hashPassword, comparePassword } = require('../../utils/hash');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

router.post('/register', async (req, res) => {
  const users = Array.isArray(req.body) ? req.body : [req.body];

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const createdUsers = [];

    for (const user of users) {
      const {
        name,
        email,
        password,
        org_id,
        role,
        mobile,
        department,
        sub_department
      } = user;

      if (!email || !password) {
        throw new Error('Missing email or password');
      }

      const hashed = await hashPassword(password);
      const userId = uuidv4();

      // Insert into users table
      const userRes = await client.query(
        `INSERT INTO exam.users 
        (id, name, email, password_hash, role, org_id, is_active, created_at, created_by)
        VALUES ($1,$2,$3,$4,$5,$6,$7,now(),$8)
        RETURNING id, email, name, role, org_id`,
        [
          userId,
          name || null,
          email,
          hashed,
          role || 'student',
          org_id || null,
          true,
          null
        ]
      );

      // Insert into user_details table
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

      createdUsers.push(userRes.rows[0]);
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      count: createdUsers.length,
      users: createdUsers
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("REGISTER ERROR 👉", err.message);

    res.status(500).json({ 
      error: 'Failed to register users', 
      details: err.message 
    });
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
