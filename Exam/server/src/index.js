// server/src/index.js
console.log("Final attempt: Manually setting CORS headers.");
const functions = require("firebase-functions");
const express = require('express');
const bodyParser = require('body-parser');
// const cors = require('cors'); // No longer using the cors package
const path = require('path');
require('dotenv').config();

const authRoutes = require('./routes/auth/auth');
const userAttemptsRoutes = require('./routes/user/user_attempts');
const adminExamsRoutes = require('./routes/admin/admin_exams');
const adminUsersRoutes = require('./routes/admin/admin_users');
const adminReportsRoutes = require('./routes/admin/admin_reports');
const orgRoutes = require('./routes/admin/admin_orgs');

const app = express();

// Manual CORS Middleware
app.use((req, res, next) => {
  const allowedOrigins = ['https://exam-96957713-e7f90.web.app'];
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
  } else {
    next();
  }
});

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
