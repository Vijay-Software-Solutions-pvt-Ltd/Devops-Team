// client/src/pages/ExamDetails.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import StudentHeader from "../components/StudentHeader";

export default function ExamDetails() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [agree, setAgree] = useState(false);
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    async function loadExam() {
      try {
        const res = await api.get(`/user/exams/${id}`);
        // ✅ safe data access
        const examData = res.data.exam || res.data.exams?.[0];
        setExam(examData);
      } catch (err) {
        console.error("Exam fetch failed:", err);
        // ✅ logout ONLY on auth errors
        if (err.response?.status === 401) {
          nav('/#/login');
        }
      }
    }

    loadExam();
  }, [id, nav]);

  function formatDate(dt) {
    if (!dt) return '-';
    return new Date(dt).toLocaleString();
  }

  function handleStart() {
    if (!agree) {
      alert('Please accept Terms & Conditions');
      return;
    }
    nav(`/exams/${id}`);
  }

  if (!exam) {
    return <div>Loading exam...</div>;
  }

  return (
    <>
      <StudentHeader />

      <div style={pageWrapper}>
        <div style={layout}>

          {/* LEFT SIDE */}
          <section style={examCard}>
            <h2 style={examTitle}>{exam.title}</h2>
            <p style={examDesc}>{exam.description}</p>

            <div style={infoGrid}>
              <div style={infoBox}>
                <div style={infoLabel}>Duration</div>
                <div style={infoValue}>{exam.duration_minutes} minutes</div>
              </div>
              <div style={infoBox}>
                <div style={infoLabel}>Start</div>
                <div style={infoValue}>{formatDate(exam.start_date)}</div>
              </div>
              <div style={infoBox}>
                <div style={infoLabel}>End</div>
                <div style={infoValue}>{formatDate(exam.end_date)}</div>
              </div>
            </div>

            <h3 style={subheading}>Instructions</h3>
            <ol style={instList}>
              <li>Questions appear after you click <b>Start Exam</b>.</li>
              <li>Do not switch tabs or windows.</li>
              <li>Webcam snapshots are enabled.</li>
              <li>You cannot retake after submit.</li>
            </ol>

            <label style={checkboxRow}>
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              I agree to the Terms & Conditions
            </label>

            <button
              onClick={handleStart}
              disabled={!agree}
              style={{
                ...startBtn,
                opacity: agree ? 1 : 0.5,
                cursor: agree ? 'pointer' : 'not-allowed'
              }}
            >
              Start Exam
            </button>
          </section>

          {/* RIGHT SIDE */}
          <aside style={sideColumn}>
            <div style={sideCard}>
              <h4 style={sideTitle}>Candidate</h4>
              <div style={{ fontWeight: 600 }}>{user.name}</div>
              <div style={sideText}>ID: {user.id}</div>
              <div style={sideText}>Email: {user.email}</div>
            </div>

            <div style={sideCard}>
              <h4 style={sideTitle}>Exam Type</h4>
              <p style={sideText}>
                Mix of MCQ and Coding questions.
              </p>
            </div>

            <div style={sideCard}>
              <h4 style={sideTitle}>Proctoring</h4>
              <p style={sideText}>
                Webcam + Activity Logs enabled.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </>
  );
}

/* STYLES */

const pageWrapper = {
  minHeight: '100vh',
  background: '#f1f5f9',
  padding: '30px 40px',
  fontFamily: 'Segoe UI, system-ui, sans-serif',
};

const layout = {
  display: 'grid',
  gridTemplateColumns: '2fr 1fr',
  gap: 24
};

const examCard = {
  background: '#fff',
  borderRadius: 18,
  padding: 24,
  boxShadow: '0 16px 40px rgba(15,23,42,0.08)',
};

const examTitle = {
  fontSize: 22,
  fontWeight: 700
};

const examDesc = {
  fontSize: 14,
  color: '#64748b'
};

const infoGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
  gap: 12,
  marginTop: 16
};

const infoBox = {
  background: '#f1f5f9',
  borderRadius: 10,
  padding: 12
};

const infoLabel = {
  fontSize: 11,
  color: '#6b7280'
};

const infoValue = {
  fontSize: 14,
  fontWeight: 600
};

const subheading = {
  marginTop: 20,
  fontSize: 16,
  fontWeight: 600
};

const instList = {
  paddingLeft: 20,
  fontSize: 14,
  color: '#475569'
};

const checkboxRow = {
  marginTop: 16,
  fontSize: 13,
  display: 'flex',
  alignItems: 'center'
};

const startBtn = {
  marginTop: 16,
  padding: '10px 18px',
  borderRadius: 999,
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  fontWeight: 600
};

const sideColumn = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14
};

const sideCard = {
  background: '#fff',
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 10px 30px rgba(15,23,42,0.06)'
};

const sideTitle = {
  fontSize: 15,
  fontWeight: 600
};

const sideText = {
  fontSize: 13,
  color: '#64748b'
};
