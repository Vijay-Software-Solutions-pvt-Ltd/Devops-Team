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

const allowedOrigins = ['https://exam-96957713-e7f90.web.app'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
  optionsSuccessStatus: 200
};

app.options('*', cors(corsOptions));
app.use(cors(corsOptions));
app.use(bodyParser.json());

/* ===== ROUTES ===== */
app.use('/auth', authRoutes);
app.use('/user/attempts', userAttemptsRoutes);
app.use('/admin/exams', adminExamsRoutes);
app.use('/admin/users', adminUsersRoutes);
app.use('/admin/reports', adminReportsRoutes);
app.use('/admin/orgs', orgRoutes);

exports.api = functions.https.onRequest(app);
