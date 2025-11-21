import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

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
      const res = await api.get("/exams/assigned");
      setExams(res.data.exams || []);
    } catch (err) {
      console.error("Failed to load exams", err);
    }
  }

  return (
    <div style={pageWrapper}>

      {/* Welcome Header */}
      <div style={headerBox}>
        <h2 style={title}>Welcome, {user?.name || "Student"} 👋</h2>
        <p style={subtitle}>Here are your available exams</p>
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
              <div style={meta}>
                ⏱ {exam.duration_minutes} mins
              </div>

              <Link to={`/exams/${exam.id}`} style={startBtn}>
                Start Exam
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ==================== STYLES ==================== */

const pageWrapper = {
  background: "#f1f5f9",
  minHeight: "100vh",
  padding: "30px"
};

const headerBox = {
  marginBottom: "25px"
};

const title = {
  fontSize: "26px",
  fontWeight: 700
};

const subtitle = {
  fontSize: "14px",
  color: "#64748b"
};

const examGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "18px"
};

const examCard = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 6px 18px rgba(0,0,0,0.06)"
};

const examTitle = {
  fontSize: "16px",
  fontWeight: 600,
  marginBottom: "6px"
};

const examDesc = {
  fontSize: "13px",
  color: "#64748b",
  marginBottom: "10px"
};

const meta = {
  fontSize: "12px",
  color: "#475569",
  marginBottom: "14px"
};

const startBtn = {
  display: "inline-block",
  background: "#2563eb",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "10px",
  fontSize: "13px",
  fontWeight: 600,
  textDecoration: "none"
};

const emptyBox = {
  padding: "30px",
  background: "#ffffff",
  borderRadius: "12px",
  textAlign: "center",
  color: "#94a3b8",
  gridColumn: "1 / -1"
};
