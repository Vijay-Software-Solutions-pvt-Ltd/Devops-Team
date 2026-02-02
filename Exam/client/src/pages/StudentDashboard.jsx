// client/src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import StudentHeader from "../components/StudentHeader";
import { FiClock, FiCalendar, FiBookOpen, FiUser } from "react-icons/fi";
import styles from "./StudentDashboard.module.css"; // Import the CSS module

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
      <div className={styles.container}>

        {/* Welcome Section */}
        <div className={styles.welcomeCard}>
          <div className={styles.welcomeInfo}>
            <h1 className={styles.welcomeTitle}>Welcome back, {user.name || 'Student'}! 👋</h1>
            <p className={styles.welcomeSubtitle}>
              You have <strong>{exams.length}</strong> upcoming {exams.length === 1 ? 'exam' : 'exams'} scheduled.
            </p>
          </div>
          <div className={styles.userBadge}>
            <FiUser style={{ marginRight: 8 }} />
            {user.email}
          </div>
        </div>

        {/* Section Title */}
        <h2 className={styles.sectionTitle}>Available Exams</h2>

        {/* Exams Grid */}
        <div className={styles.grid}>
          {exams.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No exams assigned yet</h3>
              <p>Check back later or contact your administrator.</p>
            </div>
          ) : (
            exams.map((exam) => (
              <div key={exam.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <div className={styles.iconBox}>
                    <FiBookOpen />
                  </div>
                  <h3 className={styles.cardTitle}>{exam.title}</h3>
                </div>

                <p className={styles.cardDesc}>
                  {exam.description || "No description provided."}
                </p>

                <div className={styles.metaGrid}>
                  <div className={styles.metaItem}>
                    <FiClock className={styles.metaIcon} />
                    <span>{exam.duration_minutes} mins</span>
                  </div>
                  <div className={styles.metaItem}>
                    <FiCalendar className={styles.metaIcon} />
                    <span>{formatDate(exam.start_date)}</span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <Link to={`/exams/${exam.id}/details`} className={styles.button}>
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
