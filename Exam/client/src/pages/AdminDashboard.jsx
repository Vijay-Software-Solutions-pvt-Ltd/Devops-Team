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
  Pie
} from "recharts";

export default function AdminDashboard() {
  const [attempts, setAttempts] = useState([]);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalAttempts: 0,
    avgScore: 0
  });

  const COLORS = ["#2563eb", "#0ea5e9", "#22c55e", "#f59e0b", "#ef4444"];

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/admin/reports/attempts");
        const data = res.data.attempts || [];
        setAttempts(data);

        const totalAttempts = data.length || 0;
        const totalScore = data.reduce((s, a) => s + Number(a.total_score || 0), 0);
        const avgScore = totalAttempts ? Math.round(totalScore / totalAttempts) : 0;

        setSummary({
          totalUsers: 0,
          totalExams: 0,
          totalAttempts,
          avgScore
        });
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

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
      <h2 style={pageTitle}>Admin Dashboard</h2>

      {/* Summary Cards */}
      <div style={cardGrid}>
        {[
          { title: "Total Users", value: summary.totalUsers },
          { title: "Total Exams", value: summary.totalExams },
          { title: "Attempts", value: summary.totalAttempts },
          { title: "Avg Score", value: summary.avgScore }
        ].map((card, i) => (
          <div key={i} style={cardStyle}>
            <div style={cardTitle}>{card.title}</div>
            <div style={cardValue}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={chartRow}>
        <div style={chartBox}>
          <h4>Score Per Student</h4>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={scoreAgg}>
              <XAxis dataKey="email" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                {scoreAgg.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={chartBox}>
          <h4>Score Distribution</h4>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={scoreDist} dataKey="value" nameKey="name" outerRadius={90}>
                {scoreDist.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
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

/* ---------- STYLES ---------- */

const layoutStyle = {
  background: "#f1f5f9",
  minHeight: "100vh",
  padding: "24px"
};

const pageTitle = {
  fontWeight: 700,
  marginBottom: 20
};

const cardGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "16px",
  marginBottom: 24
};

const cardStyle = {
  background: "#fff",
  padding: "18px",
  borderRadius: "12px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)"
};

const cardTitle = {
  fontSize: 13,
  color: "#64748b"
};

const cardValue = {
  fontSize: 24,
  fontWeight: 700,
  marginTop: 6
};

const chartRow = {
  display: "grid",
  gridTemplateColumns: "2fr 1fr",
  gap: "20px",
  marginBottom: 24
};

const chartBox = {
  background: "#ffffff",
  borderRadius: "12px",
  padding: "18px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)"
};

const tableBox = {
  background: "#ffffff",
  padding: "18px",
  borderRadius: "12px",
  boxShadow: "0 4px 14px rgba(0,0,0,0.06)"
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
