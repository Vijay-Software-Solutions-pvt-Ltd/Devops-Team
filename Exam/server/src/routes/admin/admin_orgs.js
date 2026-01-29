// server/src/routes/orgs.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const { v4: uuidv4 } = require('uuid');
const auth = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/roleCheck');

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

// Update org
router.put('/:id', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;
  try {
    await db.query('UPDATE exam.organizations SET name=$1, address=$2 WHERE id=$3', [name, address, id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update org' });
  }
});

// Delete org
router.delete('/:id', auth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM exam.organizations WHERE id=$1', [id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    // 23503 is foreign_key_violation
    if (err.code === '23503') {
      return res.status(400).json({ error: 'Cannot delete organization because it has associated users or exams.' });
    }
    res.status(500).json({ error: 'Failed to delete org' });
  }
});

module.exports = router;
