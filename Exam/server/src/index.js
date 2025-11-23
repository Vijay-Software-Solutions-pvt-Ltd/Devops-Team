const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const initFirebase = require("./firebase");

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

// ------------------------------------------------------------------
// LOG CLOUD RUN VARIABLES
// ------------------------------------------------------------------
console.log("🔥 Cloud Run ENV →");
console.log("PORT =", PORT);
console.log("FB_BUCKET =", process.env.FB_BUCKET);

// ------------------------------------------------------------------
// CORS FIX – REQUIRED FOR FIREBASE HOSTING
// ------------------------------------------------------------------
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://exam-96957713-e7f90.web.app",
      "https://exam-96957713.firebaseapp.com",
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Preflight
app.options("*", cors());

// ------------------------------------------------------------------
// BODY PARSER
// ------------------------------------------------------------------
app.use(bodyParser.json({ limit: "20mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "20mb" }));

// ------------------------------------------------------------------
// HEALTH CHECK
// ------------------------------------------------------------------
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", time: new Date() });
});

// ------------------------------------------------------------------
// ROOT RESPONSE FOR CLOUD RUN
// ------------------------------------------------------------------
app.get("/", (req, res) => {
  res.status(200).json({ status: "Backend Running" });
});

// ------------------------------------------------------------------
// API ROUTES
// ------------------------------------------------------------------
app.use("/auth", authRoutes);
app.use("/user/exams", userExamsRoutes);
app.use("/user/attempts", userAttemptsRoutes);
app.use("/admin/exams", adminExamsRoutes);
app.use("/admin/users", adminUsersRoutes);
app.use("/admin/reports", adminReportsRoutes);
app.use("/admin/orgs", orgRoutes);

// ------------------------------------------------------------------
// START SERVER
// ------------------------------------------------------------------
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
