// server/src/routes/orgs.js
const express = require('express');
const router = express.Router();
const db = require('../../db');
const { v4: uuidv4 } = require('uuid');
const auth = require('../../middleware/authMiddleware');
const requireRole = require('../../middleware/roleCheck');
const { hashPassword } = require('../../utils/hash');

// Create org along with Admin User and Subscription Plan
router.post('/', auth, requireRole('superadmin'), async (req, res) => {
  const { name, address, plan, users_limit, exams_limit, adminFirstName, adminLastName, adminEmail, adminPassword, adminPhone } = req.body;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const orgId = uuidv4();
    await client.query(
      'INSERT INTO exam.organizations (id, name, address, subscription_plan, users_limit, exams_limit) VALUES ($1, $2, $3, $4, $5, $6)',
      [orgId, name, address || null, plan || 'custom', users_limit || 0, exams_limit || 0]
    );

    if (adminEmail && adminPassword) {
      const userId = uuidv4();
      const hashed = await hashPassword(adminPassword);
      const fullName = `${adminFirstName || ''} ${adminLastName || ''}`.trim() || 'Org Admin';

      await client.query(
        `INSERT INTO exam.users (id, name, email, password_hash, role, org_id, is_active, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, now())`,
        [userId, fullName, adminEmail, hashed, 'admin', orgId, true]
      );

      await client.query(
        `INSERT INTO exam.user_details (user_id, email, mobile) VALUES ($1, $2, $3)`,
        [userId, adminEmail, adminPhone || null]
      );
    }

    await client.query('COMMIT');
    res.json({ org_id: orgId });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    if (err.code === '23505') {
      return res.status(400).json({ error: 'Admin Email already registered' });
    }
    res.status(500).json({ error: 'Failed to create organization' });
  } finally {
    client.release();
  }
});

// List orgs
router.get('/', auth, requireRole('superadmin'), async (req, res) => {
  try {
    const q = await db.query('SELECT id, name, address, created_at FROM exam.organizations ORDER BY created_at DESC');
    res.json({ orgs: q.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list orgs' });
  }
});

// Update org
router.put('/:id', auth, requireRole('superadmin'), async (req, res) => {
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
router.delete('/:id', auth, requireRole('superadmin'), async (req, res) => {
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

// Get current org details
router.get('/my-org', auth, requireRole('admin', 'superadmin'), async (req, res) => {
  try {
    if (!req.user.org_id) return res.json({ org: null });
    const q = await db.query('SELECT * FROM exam.organizations WHERE id=$1', [req.user.org_id]);
    res.json({ org: q.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get my org' });
  }
});

module.exports = router;
