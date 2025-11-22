// server/src/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth/auth');
const userAttemptsRoutes = require('./routes/user/user_attempts');
const userExamsRoutes = require('./routes/user/user_exams');
const adminExamsRoutes = require('./routes/admin/admin_exams');
const adminUsersRoutes = require('./routes/admin/admin_users');
const adminReportsRoutes = require('./routes/admin/admin_reports');
const orgRoutes = require('./routes/admin/admin_orgs');

const app = express();

/* ===== CORS CONFIG (Required for Cookies / Sessions) ===== */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(bodyParser.json({ limit: "15mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "15mb" }));

/* ===== ROUTES ===== */

// Auth (Login / Logout / Register)
app.use('/auth', authRoutes);

// User routes
app.use('/user/exams', userExamsRoutes);
app.use('/user/attempts', userAttemptsRoutes);

// Admin routes
app.use('/admin/exams', adminExamsRoutes);
app.use('/admin/users', adminUsersRoutes);
app.use('/admin/reports', adminReportsRoutes);
app.use('/admin/orgs', orgRoutes);

app.get('/', (req, res) => {
  res.json({ status: "Server is running ✅" });
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
