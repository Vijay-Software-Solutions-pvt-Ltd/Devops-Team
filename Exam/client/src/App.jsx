// client/src/App.jsx
import React from "react";
import { Routes, Route, Link, Navigate, Outlet } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ExamPage from "./pages/ExamPage";
import ExamDetails from "./pages/ExamDetails";
import StudentDashboard from "./pages/StudentDashboard";

import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminOrgs from "./pages/AdminOrgs";
import AdminCreateExam from "./pages/AdminCreateExam";
import AdminExams from "./pages/AdminExams";
import AdminEditExam from "./pages/AdminEditExam";
import AttemptView from "./pages/AttemptView";
import AdminAttemptDetails from "./pages/AdminAttemptDetails";

import RequireAdmin from "./components/RequireAdmin";
import AdminLayout from "./components/AdminLayout";

// 🔹 Wrapper to apply AdminLayout ONCE for all admin routes
function AdminWrapper() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <Outlet />   {/* Child routes render here */}
      </AdminLayout>
    </RequireAdmin>
  );
}

export default function App() {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="app">

      <main>
        <Routes>
          {/* ================= PUBLIC ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* ================= ROOT REDIRECT ================= */}
          <Route
            path="/"
            element={
              !token
                ? <Navigate to="/login" />
                : user.role === "admin"
                  ? <Navigate to="/admin" />
                  : <Navigate to="/student" />
            }
          />

          {/* ================= STUDENT ROUTES ================= */}
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/exams/:id" element={<ExamPage />} />
          <Route path="/exams/:id/details" element={<ExamDetails />} />

          {/* ================= ADMIN ROUTES (ONE LAYOUT) ================= */}
          <Route path="/admin" element={<AdminWrapper />}>
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="orgs" element={<AdminOrgs />} />
            <Route path="exams" element={<AdminExams />} />
            <Route path="create-exam" element={<AdminCreateExam />} />
            <Route path="edit-exam/:id" element={<AdminEditExam />} />
            <Route path="attempt/:id" element={<AttemptView />} />
            <Route path="/admin/attempt/:attemptId" element={<AdminAttemptDetails />} />
          </Route>

        </Routes>
      </main>
    </div>
  );
}
