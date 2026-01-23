import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from "recharts";
import { FiUsers, FiFileText, FiActivity, FiTrendingUp, FiAward, FiBarChart2 } from "react-icons/fi";

export default function AdminDashboard() {
  const [attempts, setAttempts] = useState([]);
  const [users, setUsers] = useState([]);
  const [exams, setExams] = useState([]);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalAttempts: 0,
    avgScore: 0
  });

  const COLORS = ["#667eea", "#764ba2", "#f093fb", "#4facfe", "#43e97b"];

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      const [attemptsRes, usersRes, examsRes] = await Promise.all([
        api.get("/admin/reports/attempts"),
        api.get("/admin/users"),
        api.get("/admin/reports/exams")
      ]);

      const attemptsData = attemptsRes.data.attempts || [];
      const usersData = usersRes.data.users || [];
      const examsData = examsRes.data.exams || [];

      setAttempts(attemptsData);
      setUsers(usersData);
      setExams(examsData);

      const totalAttempts = attemptsData.length || 0;
      const totalScore = attemptsData.reduce((s, a) => s + Number(a.total_score || 0), 0);
      const avgScore = totalAttempts ? Math.round(totalScore / totalAttempts) : 0;

      setSummary({
        totalUsers: usersData.length,
        totalExams: examsData.length,
        totalAttempts,
        avgScore
      });
    } catch (err) {
      console.error(err);
    }
  }

  const scoreAgg = attempts.map((a) => ({
    email: a.email?.split("@")[0] || "user",
    score: Number(a.total_score || 0)
  }));

  const scoreDistMap = {};
  attempts.forEach((a) => {
    const bucket = Math.floor((a.total_score || 0) / 10) * 10;
    scoreDistMap[bucket] = (scoreDistMap[bucket] || 0) + 1;
  });

  const scoreDist = Object.keys(scoreDistMap).map((k) => ({
    name: `${k}-${Number(k) + 9}`,
    value: scoreDistMap[k]
  }));

  return (
    <div style={layoutStyle}>
      {/* Header Section */}
      <div style={headerSection}>
        <div>
          <div style={headerBadge}>
            <FiBarChart2 size={18} />
            <span style={{ marginLeft: 8 }}>Admin Dashboard</span>
          </div>
          <h1 style={pageTitle}>Overview & Analytics</h1>
          <p style={pageSubtitle}>Monitor your platform's performance and user activity</p>
        </div>
        <div style={quickActions}>
          <Link to="/admin/create-exam" style={actionButton}>+ Create Exam</Link>
          <Link to="/admin/users" style={actionButton}>Manage Users</Link>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={cardGrid}>
        {[
          { title: "Total Users", value: summary.totalUsers, icon: FiUsers, color: "#667eea", bg: "#667eea15" },
          { title: "Total Exams", value: summary.totalExams, icon: FiFileText, color: "#f093fb", bg: "#f093fb15" },
          { title: "Total Attempts", value: summary.totalAttempts, icon: FiActivity, color: "#4facfe", bg: "#4facfe15" },
          { title: "Average Score", value: `${summary.avgScore}%`, icon: FiAward, color: "#43e97b", bg: "#43e97b15" }
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} style={cardStyle}>
              <div style={{ ...iconBox, background: card.bg }}>
                <Icon size={28} color={card.color} />
              </div>
              <div style={cardContent}>
                <div style={cardTitle}>{card.title}</div>
                <div style={cardValue}>{card.value}</div>
                <div style={cardTrend}>
                  <FiTrendingUp size={14} color="#10b981" />
                  <span style={{ color: "#10b981", fontSize: "13px", marginLeft: "4px" }}>+12% from last month</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div style={chartRow}>
        <div style={chartBox}>
          <div style={chartHeader}>
            <h3 style={chartTitle}>Student Performance</h3>
            <p style={chartSubtitle}>Score breakdown by student</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreAgg}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="email" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip
                contentStyle={{ background: "#fff", border: "none", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
              <Bar dataKey="score" radius={[8, 8, 0, 0]}>
                {scoreAgg.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={chartBox}>
          <div style={chartHeader}>
            <h3 style={chartTitle}>Score Distribution</h3>
            <p style={chartSubtitle}>Performance overview</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={scoreDist}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {scoreDist.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: "#fff", border: "none", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div style={tableBox}>
        <h3>Recent Attempts</h3>
        <table style={tableStyle}>
          <thead style={{ background: "#e2e8f0" }}>
            <tr>
              <th style={th}>Attempt ID</th>
              <th style={th}>User</th>
              <th style={th}>Score</th>
              <th style={th}>Violations</th>
              <th style={th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a, idx) => (
              <tr key={a.id || idx} style={idx % 2 ? rowAlt : {}}>
                <td style={td}>{a.id}</td>
                <td style={td}>{a.email}</td>
                <td style={td}>{a.total_score}</td>
                <td style={td}>{a.violation_count}</td>
                <td style={td}>
                  <Link style={link} to={`/admin/attempt/${a.id}`}>
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- MODERN STYLES ---------- */

const layoutStyle = {
  background: "linear-gradient(135deg, #425ac3 0%, #d23c3cd4 100%)",
  minHeight: "100vh",
  padding: "2px",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
};

const headerSection = {
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  borderRadius: "24px",
  padding: "40px",
  marginBottom: "32px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)"
};

const headerBadge = {
  display: "inline-flex",
  alignItems: "center",
  background: "rgba(255,255,255,0.2)",
  padding: "8px 16px",
  borderRadius: "50px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "600",
  marginBottom: "12px",
  backdropFilter: "blur(10px)"
};

const pageTitle = {
  fontSize: "42px",
  fontWeight: "800",
  color: "#fff",
  margin: "8px 0",
  lineHeight: "1.2"
};

const pageSubtitle = {
  fontSize: "16px",
  color: "rgba(255,255,255,0.9)",
  fontWeight: "400"
};

const quickActions = {
  display: "flex",
  gap: "12px"
};

const actionButton = {
  background: "#fff",
  color: "#667eea",
  padding: "12px 24px",
  borderRadius: "12px",
  fontSize: "14px",
  fontWeight: "600",
  textDecoration: "none",
  boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
  transition: "all 0.3s ease"
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: "24px",
  marginBottom: "32px"
};

const cardStyle = {
  background: "#fff",
  padding: "28px",
  borderRadius: "20px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
  display: "flex",
  alignItems: "center",
  gap: "20px",
  transition: "all 0.3s ease"
};

const iconBox = {
  width: "64px",
  height: "64px",
  borderRadius: "16px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0
};

const cardContent = {
  flex: 1
};

const cardTitle = {
  fontSize: "14px",
  color: "#64748b",
  fontWeight: "500",
  marginBottom: "8px"
};

const cardValue = {
  fontSize: "32px",
  fontWeight: "700",
  color: "#0f172a",
  marginBottom: "4px"
};

const cardTrend = {
  display: "flex",
  alignItems: "center",
  marginTop: "8px"
};

const chartRow = {
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr",
  gap: "24px",
  marginBottom: "32px"
};

const chartBox = {
  background: "#fff",
  borderRadius: "20px",
  padding: "28px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
};

const chartHeader = {
  marginBottom: "24px"
};

const chartTitle = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#0f172a",
  marginBottom: "4px"
};

const chartSubtitle = {
  fontSize: "14px",
  color: "#64748b"
};

const tableBox = {
  background: "#fff",
  padding: "28px",
  borderRadius: "20px",
  boxShadow: "0 10px 40px rgba(0,0,0,0.08)"
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse"
};

const th = {
  padding: "12px",
  fontSize: "13px",
  textAlign: "left"
};

const td = {
  padding: "12px",
  fontSize: "13px",
  borderBottom: "1px solid #e2e8f0"
};

const rowAlt = {
  background: "#f9fafb"
};

const link = {
  color: "#2563eb",
  fontWeight: 600,
  textDecoration: "none"
};
