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
    // API path assumed to already be correct and working in your setup:
    api
      .get(`/user/exams/${id}`)
      .then((r) => setExam(r.data.exam))
      .catch(() => nav('/#/login'));
  }, [id, nav]);

  function formatDate(dt) {
    if (!dt) return '-';
    return new Date(dt).toLocaleString();
  }

  function handleStart() {
    if (!agree) return alert('Please accept T&C');
    nav(`/exams/${id}`);
  }

  if (!exam) return <div>Loading...</div>;

  return (
    <>
  <StudentHeader />
    <div style={pageWrapper}>
      <div style={layout}>
        {/* Left: Exam Info + T&C */}
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
            <div style={infoBox}>
              <div style={infoLabel}>Assigned Org</div>
              <div style={infoValue}>{exam.org_id || '-'}</div>
            </div>
          </div>

          <h3 style={subheading}>Instructions</h3>
          <ol style={instList}>
            <li>Questions will appear only after you press <strong>Start Exam</strong>.</li>
            <li>Do not switch tabs or windows during the exam; all actions are monitored.</li>
            <li>Webcam snapshots will be captured periodically for proctoring.</li>
            <li>Once submitted or timed out, the exam cannot be retaken.</li>
          </ol>

          <label style={checkboxRow}>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              style={{ marginRight: 8 }}
            />
            I have read the instructions and agree to the Terms & Conditions.
          </label>

          <button
            onClick={handleStart}
            disabled={!agree}
            style={{
              ...startBtn,
              opacity: agree ? 1 : 0.6,
              cursor: agree ? 'pointer' : 'not-allowed',
            }}
          >
            Start Exam (Enter Fullscreen)
          </button>
        </section>

        {/* Right: Candidate + Exam Model */}
        <aside style={sideColumn}>
          <div style={sideCard}>
            <h4 style={sideTitle}>Candidate</h4>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div style={sideText}>ID: {user.id}</div>
            <div style={sideText}>Email: {user.email}</div>
          </div>

          <div style={sideCard}>
            <h4 style={sideTitle}>Exam Model</h4>
            <p style={sideText}>
              This exam consists of multiple-choice questions and coding questions.
              MCQs are auto-graded while coding questions are evaluated later by the
              invigilator or automated judge.
            </p>
          </div>

          <div style={sideCard}>
            <h4 style={sideTitle}>Proctoring</h4>
            <p style={sideText}>
              The session is monitored with webcam snapshots, focus tracking, and
              screen activity logs to ensure exam integrity.
            </p>
          </div>
        </aside>
      </div>
    </div>
    </>
  );
}

/* ============ STYLES ============ */

const pageWrapper = {
  minHeight: '100vh',
  background: '#f1f5f9',
  padding: '30px 40px',
  fontFamily: 'Segoe UI, system-ui, sans-serif',
};

const layout = {
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
  gap: 24,
  alignItems: 'flex-start',
};

const examCard = {
  background: '#ffffff',
  borderRadius: 18,
  padding: 24,
  boxShadow: '0 16px 40px rgba(15,23,42,0.08)',
};

const examTitle = {
  margin: 0,
  fontSize: 22,
  fontWeight: 700,
  color: '#0f172a',
};

const examDesc = {
  marginTop: 6,
  fontSize: 14,
  color: '#64748b',
};

const infoGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(160px,1fr))',
  gap: 10,
  marginTop: 16,
};

const infoBox = {
  background: '#f1f5f9',
  borderRadius: 10,
  padding: 10,
};

const infoLabel = {
  fontSize: 11,
  color: '#6b7280',
};

const infoValue = {
  fontSize: 14,
  fontWeight: 600,
  color: '#0f172a',
};

const subheading = {
  marginTop: 20,
  marginBottom: 8,
  fontSize: 16,
  fontWeight: 600,
};

const instList = {
  paddingLeft: 20,
  fontSize: 14,
  color: '#475569',
};

const checkboxRow = {
  marginTop: 16,
  fontSize: 13,
  color: '#334155',
  display: 'flex',
  alignItems: 'center',
};

const startBtn = {
  marginTop: 16,
  padding: '10px 18px',
  borderRadius: 999,
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  fontWeight: 600,
  fontSize: 14,
  boxShadow: '0 10px 25px rgba(37,99,235,0.5)',
};

const sideColumn = {
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

const sideCard = {
  background: '#ffffff',
  borderRadius: 16,
  padding: 16,
  boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
};

const sideTitle = {
  margin: 0,
  marginBottom: 6,
  fontSize: 15,
  fontWeight: 600,
};

const sideText = {
  fontSize: 13,
  color: '#64748b',
  marginTop: 4,
};
