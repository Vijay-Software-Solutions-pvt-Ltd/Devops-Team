// server/src/index.js
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

(async () => {
  await initFirebase();

  app.use(bodyParser.json({ limit: "15mb" }));
  app.use(bodyParser.urlencoded({ extended: true, limit: "15mb" }));

  // Routes
  app.use('/auth', authRoutes);
  app.use('/user/exams', userExamsRoutes);
  app.use('/user/attempts', userAttemptsRoutes);
  app.use('/admin/exams', adminExamsRoutes);
  app.use('/admin/users', adminUsersRoutes);
  app.use('/admin/reports', adminReportsRoutes);
  app.use('/admin/orgs', orgRoutes);

  app.get('/', (req, res) => {
    res.json({ status: "Server is running ✅" });
  });

  // Cloud Run required PORT
  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})();
