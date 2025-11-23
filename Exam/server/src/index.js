const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const initFirebase = require("./firebase");

const authRoutes = require('./routes/auth/auth');
const userAttemptsRoutes = require('./routes/user/user_attempts');
const userExamsRoutes = require('./routes/user/user_exams');
const adminExamsRoutes = require('./routes/admin/admin_exams');
const adminUsersRoutes = require('./routes/admin/admin_users');
const adminReportsRoutes = require('./routes/admin/admin_reports');
const orgRoutes = require('./routes/admin/admin_orgs');

const app = express();
const PORT = process.env.PORT || 8080;

// middleware
app.use(bodyParser.json({ limit: "15mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "15mb" }));

// routes
app.use('/auth', authRoutes);
app.use('/user/exams', userExamsRoutes);
app.use('/user/attempts', userAttemptsRoutes);
app.use('/admin/exams', adminExamsRoutes);
app.use('/admin/users', adminUsersRoutes);
app.use('/admin/reports', adminReportsRoutes);
app.use('/admin/orgs', orgRoutes);

// health check endpoint
app.get('/', (req, res) => {
  res.json({ status: "Server is running ✅" });
});

// START SERVER ONLY AFTER FIREBASE INIT
(async () => {
  try {
    await initFirebase();
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("🔥 Failed to start server:", err);
  }
})();
