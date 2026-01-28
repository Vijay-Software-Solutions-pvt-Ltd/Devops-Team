// client/src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import { FiClock, FiCalendar, FiBookOpen, FiUser } from "react-icons/fi";

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
      <div style={styles.container}>

        {/* Welcome Section */}
        <div style={styles.welcomeCard}>
          <div style={styles.welcomeInfo}>
            <h1 style={styles.welcomeTitle}>Welcome back, {user.name || 'Student'}! 👋</h1>
            <p style={styles.welcomeSubtitle}>
              You have <strong>{exams.length}</strong> upcoming {exams.length === 1 ? 'exam' : 'exams'} scheduled.
            </p>
          </div>
          <div style={styles.userBadge}>
            <FiUser style={{ marginRight: 8 }} />
            {user.email}
          </div>
        </div>

        {/* Section Title */}
        <h2 style={styles.sectionTitle}>Your Assignments</h2>

        {/* Exams Grid */}
        <div style={styles.grid}>
          {exams.length === 0 ? (
            <div style={styles.emptyState}>
              <h3>No exams assigned yet</h3>
              <p>Check back later or contact your administrator.</p>
            </div>
          ) : (
            exams.map((exam) => (
              <div key={exam.id} style={styles.card}>
                <div style={styles.cardHeader}>
                  <div style={styles.iconBox}>
                    <FiBookOpen />
                  </div>
                  <h3 style={styles.cardTitle}>{exam.title}</h3>
                </div>

                <p style={styles.cardDesc}>
                  {exam.description || "No description provided."}
                </p>

                <div style={styles.metaGrid}>
                  <div style={styles.metaItem}>
                    <FiClock style={styles.metaIcon} />
                    <span>{exam.duration_minutes} mins</span>
                  </div>
                  <div style={styles.metaItem}>
                    <FiCalendar style={styles.metaIcon} />
                    <span>{formatDate(exam.start_date)}</span>
                  </div>
                </div>

                <div style={styles.cardFooter}>
                  <Link to={`/exams/${exam.id}/details`} style={styles.button}>
                    View & Start Exam
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
const styles = {
  container: {
    padding: '40px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif"
  },
  welcomeCard: {
    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
    borderRadius: '20px',
    padding: '32px',
    marginBottom: '40px',
    color: '#fff',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 10px 25px rgba(37,99,235,0.3)'
  },
  welcomeTitle: {
    fontSize: '32px',
    fontWeight: '700',
    margin: '0 0 8px 0'
  },
  welcomeSubtitle: {
    fontSize: '16px',
    opacity: 0.9,
    margin: 0
  },
  userBadge: {
    background: 'rgba(255,255,255,0.2)',
    padding: '8px 16px',
    borderRadius: '50px',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    fontWeight: '500',
    backdropFilter: 'blur(5px)'
  },
  sectionTitle: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '24px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px'
  },
  emptyState: {
    gridColumn: '1 / -1',
    background: '#f8fafc',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center',
    border: '2px dashed #cbd5e1',
    color: '#64748b'
  },
  card: {
    background: '#ffffff',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s, box-shadow 0.2s',
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 24px rgba(0,0,0,0.1)'
    }
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'start',
    gap: '16px',
    marginBottom: '16px'
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background: '#eff6ff',
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#0f172a',
    margin: 0,
    lineHeight: '1.4'
  },
  cardDesc: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '20px',
    lineHeight: '1.5',
    flex: 1
  },
  metaGrid: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
    color: '#475569',
    background: '#f1f5f9',
    padding: '6px 12px',
    borderRadius: '8px'
  },
  metaIcon: {
    marginRight: '6px',
    color: '#64748b'
  },
  cardFooter: {
    marginTop: 'auto'
  },
  button: {
    display: 'block',
    textAlign: 'center',
    background: '#0f172a',
    color: '#fff',
    padding: '12px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '14px',
    transition: 'background 0.2s'
  }
};
