// client/src/App.jsx
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import ExamList from './pages/ExamList';
import ExamPage from './pages/ExamPage';
import AdminDashboard from './pages/AdminDashboard';
import AttemptView from './pages/AttemptView';
import ExamDetails from './pages/ExamDetails';
import AdminOrgs from './pages/AdminOrgs';
import AdminUsers from './pages/AdminUsers';
import AdminCreateExam from './pages/AdminCreateExam';
import RequireAdmin from './components/RequireAdmin';
import StudentDashboard from './pages/StudentDashboard';

export default function App() {

  // 🔥 FIXED: user must be defined BEFORE routing
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="app">

      {/* Global Header */}
      <header className="header">
        <Link to="/"><h2>Exam Portal (MVP)</h2></Link>
      </header>

      <main>
        <Routes>

          {/* ============================ */}
          {/* PUBLIC ROUTES               */}
          {/* ============================ */}
          <Route path="/login" element={<Login />} />

          {/* ROOT ROUTE DECISION */}
         <Route
  path="/"
  element={
    !user?.role
      ? <Navigate to="/login" /> // not logged in
      : user.role === "admin"
        ? <Navigate to="/admin" />
        : <Navigate to="/student" />
  }
/>

          {/* ============================ */}
          {/* STUDENT ROUTES              */}
          {/* ============================ */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/examlist" element={<ExamList />} />
          <Route path="/exams/:id" element={<ExamPage />} />
          <Route path="/exams/:id/details" element={<ExamDetails />} />


          {/* ============================ */}
          {/* ADMIN ROUTES (Protected)     */}
          {/* ============================ */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />

          <Route
            path="/admin/users"
            element={
              <RequireAdmin>
                <AdminUsers />
              </RequireAdmin>
            }
          />

          <Route
            path="/admin/orgs"
            element={
              <RequireAdmin>
                <AdminOrgs />
              </RequireAdmin>
            }
          />

          <Route
            path="/admin/create-exam"
            element={
              <RequireAdmin>
                <AdminCreateExam />
              </RequireAdmin>
            }
          />

          <Route
            path="/admin/attempt/:id"
            element={
              <RequireAdmin>
                <AttemptView />
              </RequireAdmin>
            }
          />

        </Routes>
      </main>
    </div>
  );
}
