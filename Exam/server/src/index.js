const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();
const initFirebase = require("./firebase");
const pool = require("./db");

// ROUTES
const authRoutes = require("./routes/auth/auth");
const userAttemptsRoutes = require("./routes/user/user_attempts");
const userExamsRoutes = require("./routes/user/user_exams");
const adminExamsRoutes = require("./routes/admin/admin_exams");
const adminUsersRoutes = require("./routes/admin/admin_users");
const adminReportsRoutes = require("./routes/admin/admin_reports");
const orgRoutes = require("./routes/admin/admin_orgs");

const app = express();
const PORT = process.env.PORT || 8080;

// LOG ENV
console.log("🔥 Cloud Run ENV →");
console.log("PORT =", PORT);
console.log("FB_BUCKET =", process.env.FB_BUCKET);

// CORS
const cors = require("cors");
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    // Allow any localhost, firebaseapp.com and .web.app
    if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('firebaseapp.com') || origin.includes('.web.app')) {
      return callback(null, true);
    }
    const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
    return callback(new Error(msg), false);
  },
  credentials: true
}));

// BODY
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", time: new Date() });
});

// ROOT
app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend Running" });
});

// DB TEST
app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ db: "connected", time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROUTES
app.use("/auth", authRoutes);
app.use("/user/exams", userExamsRoutes);
app.use("/user/attempts", userAttemptsRoutes);
app.use("/admin/exams", adminExamsRoutes);
app.use("/admin/users", adminUsersRoutes);
app.use("/admin/reports", adminReportsRoutes);
app.use("/admin/orgs", orgRoutes);
app.use("/public/orgs", require("./routes/public_orgs"));

// START
(async () => {
  try {
    await initFirebase();
    console.log("🔥 Firebase initialized successfully");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
  }
})();
