const express = require('express');
const router = express.Router();
const db = require('../db');

// List orgs (public) - Name and ID only
router.get('/', async (req, res) => {
    try {
        const q = await db.query('SELECT id, name FROM exam.organizations ORDER BY name ASC');
        res.json({ orgs: q.rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to list organizations' });
    }
});

module.exports = router;
