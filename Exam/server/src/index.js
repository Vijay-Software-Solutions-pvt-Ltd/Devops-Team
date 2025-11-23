const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const initFirebase = require("./firebase");

// ROUTES
const authRoutes = require('./routes/auth/auth');
const userAttemptsRoutes = require('./routes/user/user_attempts');
const userExamsRoutes = require('./routes/user/user_exams');
const adminExamsRoutes = require('./routes/admin/admin_exams');
const adminUsersRoutes = require('./routes/admin/admin_users');
const adminReportsRoutes = require('./routes/admin/admin_reports');
const orgRoutes = require('./routes/admin/admin_orgs');

const app = express();
const PORT = process.env.PORT || 8080;

// ------------------------------
// MIDDLEWARE
// ------------------------------
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));

// LOG CLOUD RUN VARIABLES
console.log("🔥 Cloud Run ENV →");
console.log("PORT =", PORT);
console.log("FB_BUCKET =", process.env.FB_BUCKET);
console.log("FB_CREDS_BUCKET =", process.env.FB_CREDS_BUCKET);

// ------------------------------
// ROUTES
// ------------------------------
app.use('/auth', authRoutes);
app.use('/user/exams', userExamsRoutes);
app.use('/user/attempts', userAttemptsRoutes);

app.use('/admin/exams', adminExamsRoutes);
app.use('/admin/users', adminUsersRoutes);
app.use('/admin/reports', adminReportsRoutes);
app.use('/admin/orgs', orgRoutes);

// HEALTH CHECK (IMPORTANT FOR CLOUD RUN)
app.get('/', (req, res) => {
  res.status(200).json({
    status: "Server is running on Cloud Run ✅",
    time: new Date(),
  });
});

// ------------------------------
// START SERVER (AFTER FIREBASE INIT)
// ------------------------------
(async () => {
  try {
    await initFirebase();
    console.log("🔥 Firebase initialized successfully");

    // MUST LISTEN ON 0.0.0.0 FOR CLOUD RUN
    app.listen(PORT, "0.0.0.0", () => {
      console.log("Health check hit");
      console.log(`🚀 Server running & listening on 0.0.0.0:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
})();
