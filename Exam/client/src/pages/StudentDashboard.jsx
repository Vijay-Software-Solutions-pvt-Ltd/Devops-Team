// client/src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";


export default function StudentDashboard() {
  const [exams, setExams] = useState([]);
  const [user, setUser] = useState({});

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(u);
    loadExams();
  }, []);

  async function loadExams() {
    try {
      const res = await api.get("/user/exams/assigned");
      setExams(res.data.exams || []);
    } catch (err) {
      console.error("Failed to load exams", err);
    }
  }

  function formatDate(dt) {
    if (!dt) return "-";
    return new Date(dt).toLocaleString();
  }

  return (
    <>
  <StudentHeader />
    <div style={pageWrapper}>
      {/* Top Bar / Welcome Section */}
      <div style={topRow}>
        <div>
          <h1 style={title}>Online Exam</h1>
          <p style={subtitle}>Welcome to your exams dashboard</p>
        </div>

        <div style={userCard}>
          <div style={{ fontSize: 14, color: "#64748b" }}>Logged in as</div>
          <div style={{ fontWeight: 600 }}>{user?.name || "Student"}</div>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>{user?.email}</div>
        </div>
      </div>

      {/* Welcome Panel */}
      <div style={welcomeCard}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22 }}>Welcome to your Exams 👋</h2>
          <p style={{ marginTop: 4, color: "#64748b", fontSize: 14 }}>
            You have{" "}
            <strong>{exams.length}</strong>{" "}
            upcoming {exams.length === 1 ? "exam" : "exams"} assigned.
          </p>
        </div>
      </div>

      {/* Exams Grid */}
      <div style={examGrid}>
        {exams.length === 0 ? (
          <div style={emptyBox}>No exams assigned yet.</div>
        ) : (
          exams.map((exam) => (
            <div key={exam.id} style={examCard}>
              <h4 style={examTitle}>{exam.title}</h4>
              <p style={examDesc}>{exam.description}</p>

              <div style={examMetaRow}>
                <span style={pill}>
                  ⏱ {exam.duration_minutes} mins
                </span>
                <span style={pillLight}>
                  🕒 Starts: {formatDate(exam.start_date)}
                </span>
              </div>

              <div style={{ marginTop: 14, display: "flex", justifyContent: "flex-end" }}>
                {/* 👉 Go to Exam Details (with T&C) */}
                <Link to={`/exams/${exam.id}/details`} style={startBtn}>
                  View & Start
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    </>
  );
}

/* ============ STYLES ============ */

const pageWrapper = {
  background: "#f1f5f9",
  minHeight: "100vh",
  padding: "30px 40px",
  fontFamily: "Segoe UI, system-ui, sans-serif",
};

const topRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 20,
};

const title = {
  fontSize: 26,
  fontWeight: 800,
  color: "#0f172a",
};

const subtitle = {
  fontSize: 14,
  color: "#64748b",
};

const userCard = {
  padding: "10px 16px",
  borderRadius: 14,
  background: "#ffffff",
  boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
  textAlign: "right",
  minWidth: 220,
};

const welcomeCard = {
  background:
    "linear-gradient(120deg, #2563eb, #1d4ed8, #0ea5e9)",
  padding: "18px 22px",
  borderRadius: 18,
  color: "#eff6ff",
  boxShadow: "0 16px 30px rgba(37,99,235,0.35)",
  marginBottom: 24,
};

const examGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "18px",
};

const examCard = {
  background: "#ffffff",
  borderRadius: 18,
  padding: 18,
  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
  border: "1px solid #e2e8f0",
  display: "flex",
  flexDirection: "column",
};

const examTitle = {
  fontSize: 16,
  fontWeight: 600,
  marginBottom: 6,
  color: "#0f172a",
};

const examDesc = {
  fontSize: 13,
  color: "#64748b",
  marginBottom: 10,
  minHeight: 36,
};

const examMetaRow = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginTop: 4,
};

const pill = {
  padding: "3px 10px",
  borderRadius: 999,
  background: "#e0f2fe",
  fontSize: 12,
  color: "#0369a1",
};

const pillLight = {
  padding: "3px 10px",
  borderRadius: 999,
  background: "#f1f5f9",
  fontSize: 12,
  color: "#475569",
};

const startBtn = {
  display: "inline-block",
  background: "#2563eb",
  color: "#fff",
  padding: "8px 16px",
  borderRadius: 999,
  fontSize: 13,
  fontWeight: 600,
  textDecoration: "none",
  boxShadow: "0 6px 18px rgba(37,99,235,0.4)",
  transform: "translateY(0)",
  transition: "all 0.15s ease",
};

const emptyBox = {
  padding: "30px",
  background: "#ffffff",
  borderRadius: 12,
  textAlign: "center",
  color: "#94a3b8",
  gridColumn: "1 / -1",
};
