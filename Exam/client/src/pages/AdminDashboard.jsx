// client/src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie
} from 'recharts';
import AdminLayout from '../components/AdminLayout';

export default function AdminDashboard() {
  const [attempts, setAttempts] = useState([]);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalExams: 0,
    totalAttempts: 0,
    avgScore: 0
  });

  const COLORS = ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#ef4444'];

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get('/admin/attempts');
        const data = res.data.attempts || [];
        setAttempts(data);

        const totalAttempts = data.length || 0;
        const totalScore = data.reduce((s, a) => s + Number(a.total_score || 0), 0);
        const avgScore = totalAttempts ? Math.round(totalScore / totalAttempts) : 0;

        // ideally fetch from backend: /admin/summary
        // for now use frontend-only dummy
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

  // Simple bar-agg
  const scoreAgg = attempts.map(a => ({
    email: a.email.split('@')[0],
    score: Number(a.total_score || 0)
  }));

  // Score distribution for Pie chart
  const scoreDistMap = {};
  attempts.forEach(a => {
    const bucket = Math.floor((a.total_score || 0) / 10) * 10;
    scoreDistMap[bucket] = (scoreDistMap[bucket] || 0) + 1;
  });
  const scoreDist = Object.keys(scoreDistMap).map(k => ({
    name: `${k}-${Number(k) + 9}`,
    value: scoreDistMap[k]
  }));

  // Download CSV
  async function downloadReport(examId) {
    const token = localStorage.getItem('token');
    const res = await fetch(`http://localhost:4000/admin/download/exam/${examId}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` }
    });
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exam_${examId}_report.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminLayout>
      <h2 style={{ marginBottom: '20px', fontWeight: 700 }}>Admin Dashboard</h2>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div style={cardStyle}>
          <div style={cardTitle}>Total Users</div>
          <div style={cardValue}>{summary.totalUsers}</div>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>Total Exams</div>
          <div style={cardValue}>{summary.totalExams}</div>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>Attempts</div>
          <div style={cardValue}>{summary.totalAttempts}</div>
        </div>

        <div style={cardStyle}>
          <div style={cardTitle}>Avg Score</div>
          <div style={cardValue}>{summary.avgScore}</div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 20 }}>
        {/* Bar Chart */}
        <div style={{ flex: 2, background: '#fff', padding: 20, borderRadius: 12 }}>
          <h4>Score per Student</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={scoreAgg}>
              <XAxis dataKey="email" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score">
                {scoreAgg.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div style={{ flex: 1, background: '#fff', padding: 20, borderRadius: 12 }}>
          <h4>Score Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={scoreDist} dataKey="value" nameKey="name" outerRadius={100}>
                {scoreDist.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Attempt Table */}
      <h3 style={{ marginBottom: 10 }}>Recent Attempts</h3>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Attempt ID</th>
            <th>User</th>
            <th>Score</th>
            <th>Violations</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((a, idx) => (
            <tr key={a.id || idx} style={idx % 2 ? rowAlt : {}}>
              <td>{a.id}</td>
              <td>{a.email}</td>
              <td>{a.total_score || 0}</td>
              <td>{a.violation_count || 0}</td>
              <td>
                <Link to={`/admin/attempt/${a.id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

const cardStyle = {
  background: '#ffffff',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.06)'
};

const cardTitle = {
  fontSize: 12,
  color: '#64748b'
};

const cardValue = {
  fontSize: 26,
  fontWeight: 700,
  marginTop: 4
};

const tableStyle = {
  width: '100%',
  background: '#fff',
  borderCollapse: 'collapse',
  borderRadius: '12px'
};

const rowAlt = {
  background: '#f8fafc'
};
