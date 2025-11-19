// server/src/routes/orgs.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middleware/authMiddleware');
const requireRole = require('../middleware/roleCheck');

// Create org
router.post('/', auth, requireRole('admin'), async (req, res) => {
  const { name, address } = req.body;
  try {
    const id = uuidv4();
    await db.query('INSERT INTO exam.organizations (id,name,address) VALUES ($1,$2,$3)', [id, name, address]);
    res.json({ org_id: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create org' });
  }
});

// List orgs
router.get('/', auth, requireRole('admin'), async (req, res) => {
  try {
    const q = await db.query('SELECT id, name, address, created_at FROM exam.organizations ORDER BY created_at DESC');
    res.json({ orgs: q.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list orgs' });
  }
});

module.exports = router;
