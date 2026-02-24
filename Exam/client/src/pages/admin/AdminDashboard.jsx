import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, CartesianGrid
} from "recharts";
import { FiUsers, FiFileText, FiActivity, FiTrendingUp, FiAward, FiBarChart2, FiShield, FiAlertOctagon } from "react-icons/fi";

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
  const [userRole, setUserRole] = useState("admin");
  const [orgData, setOrgData] = useState(null);

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#0ea5e9", "#10b981"];

  useEffect(() => {
    loadAllData();
  }, []);

  async function loadAllData() {
    try {
      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : { role: "admin" };
      setUserRole(user.role);

      const [attemptsRes, usersRes, examsRes, orgRes] = await Promise.all([
        api.get("/admin/reports/attempts"),
        api.get("/admin/users"),
        api.get("/admin/reports/exams"),
        user.role === 'admin' ? api.get("/admin/orgs/my-org") : Promise.resolve({ data: { org: null } })
      ]);

      const attemptsData = attemptsRes.data.attempts || [];
      const usersData = usersRes.data.users || [];
      const examsData = examsRes.data.exams || [];
      if (orgRes.data.org) setOrgData(orgRes.data.org);

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

  const isSuperadmin = userRole === 'superadmin';

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8 lg:p-10 font-sans mt-12 md:mt-4">

      {/* HEADER SECTION */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-8 md:p-12 mb-10 overflow-hidden shadow-2xl">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-white/90 text-sm font-semibold mb-4 border border-white/20 shadow-inner">
              {isSuperadmin ? <FiShield size={16} /> : <FiBarChart2 size={16} />}
              <span>{isSuperadmin ? 'Superadmin Global View' : 'Organization Dashboard'}</span>
              {!isSuperadmin && orgData && (
                <span className="ml-2 pl-2 border-l border-white/30 text-white font-bold">{orgData.name}</span>
              )}
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-2">
              Overview & Analytics
            </h1>
            <p className="text-lg text-indigo-100 max-w-2xl font-medium">
              Monitor your {isSuperadmin ? 'platform\'s' : 'organization\'s'} performance, user activity, and examination metrics in real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <Link to="/admin/create-exam" className="inline-flex items-center justify-center px-6 py-3.5 bg-white text-indigo-600 rounded-xl font-bold shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300">
              <span className="mr-2 text-xl leading-none">+</span> Create Exam
            </Link>
            {isSuperadmin && (
              <Link to="/admin/orgs" className="inline-flex items-center justify-center px-6 py-3.5 bg-indigo-900/50 text-white border border-indigo-400/30 rounded-xl font-bold hover:bg-indigo-800/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
                Manage Organizations
              </Link>
            )}
            <Link to="/admin/users" className="inline-flex items-center justify-center px-6 py-3.5 bg-indigo-900/50 text-white border border-indigo-400/30 rounded-xl font-bold hover:bg-indigo-800/60 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1">
              Manage Users
            </Link>
          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          {
            title: "Total Users",
            value: !isSuperadmin && orgData ? summary.totalUsers : summary.totalUsers,
            limit: !isSuperadmin && orgData ? orgData.users_limit : null,
            icon: FiUsers, color: "text-indigo-600", bg: "bg-indigo-50", ring: "ring-indigo-100"
          },
          {
            title: "Total Exams",
            value: !isSuperadmin && orgData ? summary.totalExams : summary.totalExams,
            limit: !isSuperadmin && orgData ? orgData.exams_limit : null,
            icon: FiFileText, color: "text-purple-600", bg: "bg-purple-50", ring: "ring-purple-100"
          },
          {
            title: "Total Attempts",
            value: summary.totalAttempts,
            icon: FiActivity, color: "text-blue-500", bg: "bg-blue-50", ring: "ring-blue-100"
          },
          {
            title: "Average Score",
            value: `${summary.avgScore}%`,
            icon: FiAward, color: "text-emerald-500", bg: "bg-emerald-50", ring: "ring-emerald-100"
          }
        ].map((card, i) => {
          const Icon = card.icon;
          const progress = card.limit ? Math.min((card.value / card.limit) * 100, 100) : null;

          return (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 group">
              <div className="flex items-center gap-5 mb-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${card.bg} ${card.color} ring-4 ${card.ring} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={26} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{card.title}</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-slate-800">{card.value}</span>
                    {card.limit && (
                      <span className="text-sm font-medium text-slate-400">/ {card.limit}</span>
                    )}
                  </div>
                </div>
              </div>

              {card.limit ? (
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-slate-500">Usage Limit</span>
                    <span className={progress >= 90 ? "text-red-500" : "text-indigo-600"}>{Math.round(progress)}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${progress >= 90 ? 'bg-red-500' : 'bg-indigo-500'}`}
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 inline-flex px-2.5 py-1 rounded-md mt-2">
                  <FiTrendingUp className="mr-1.5" size={14} />
                  Looking solid
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        {/* Bar Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="mb-8">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Student Performance Map</h3>
            <p className="text-sm font-medium text-slate-500">Aggregate score breakdown across recent attempts</p>
          </div>
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreAgg.slice(0, 15)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="email" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", fontWeight: '600', padding: '12px' }}
                />
                <Bar dataKey="score" radius={[6, 6, 6, 6]} barSize={32}>
                  {scoreAgg.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col">
          <div className="mb-4">
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Score Distribution</h3>
            <p className="text-sm font-medium text-slate-500">Global performance bands</p>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreDist}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={3}
                >
                  {scoreDist.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)", fontWeight: '600' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="text-xl font-extrabold text-slate-800 mb-1">Recent Exam Attempts</h3>
            <p className="text-sm font-medium text-slate-500">Live feed of student submissions and security flags</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                <th className="px-8 py-5">Attempt Details</th>
                <th className="px-8 py-5">Student / User</th>
                <th className="px-8 py-5 text-center">Score</th>
                <th className="px-8 py-5 text-center">Security Violations</th>
                <th className="px-8 py-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attempts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-slate-400 font-medium">
                    No highly recent attempts found. Wait for students to submit exams.
                  </td>
                </tr>
              ) : attempts.slice(0, 10).map((a, idx) => {
                const isHighViolation = a.violation_count > 3;

                return (
                  <tr key={a.id || idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-8 py-4">
                      <div className="text-sm font-bold text-slate-800">{a.id.substring(0, 8)}...</div>
                      <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest">{new Date(a.started_at_server).toLocaleDateString()}</div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                          {a.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">{a.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-bold bg-slate-100 text-slate-700">
                        {a.total_score}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-center">
                      {a.violation_count > 0 ? (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isHighViolation ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-amber-100 text-amber-700 border border-amber-200'}`}>
                          {isHighViolation ? <FiAlertOctagon size={12} /> : <FiShield size={12} />}
                          {a.violation_count} Flags
                        </span>
                      ) : (
                        <span className="text-sm font-medium text-emerald-500">Secure</span>
                      )}
                    </td>
                    <td className="px-8 py-4 text-right">
                      <Link
                        to={`/admin/attempt/${a.id}`}
                        className="inline-flex items-center justify-center px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-indigo-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-700 shadow-sm transition-all"
                      >
                        Deep View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
