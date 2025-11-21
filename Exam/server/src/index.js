// server/src/index.js
const functions = require("firebase-functions");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth/auth');
const userAttemptsRoutes = require('./routes/user/user_attempts');
const adminExamsRoutes = require('./routes/admin/admin_exams');
const adminUsersRoutes = require('./routes/admin/admin_users');
const adminReportsRoutes = require('./routes/admin/admin_reports');
const orgRoutes = require('./routes/admin/admin_orgs');

const app = express();

/* ===== CORS CONFIG (Required for Cookies / Sessions) ===== */
app.use(cors({ origin: true }));

app.use(bodyParser.json());

/* ===== ROUTES ===== */

// Auth (Login / Logout / Register)
app.use('/auth', authRoutes);

// User routes
app.use('/user/attempts', userAttemptsRoutes);

// Admin routes
app.use('/admin/exams', adminExamsRoutes);
app.use('/admin/users', adminUsersRoutes);
app.use('/admin/reports', adminReportsRoutes);
app.use('/admin/orgs', orgRoutes);

exports.api = functions.https.onRequest(app);
