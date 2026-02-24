// client/src/App.jsx
import React, { Suspense, lazy } from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// layouts
import AdminLayout from "./components/AdminLayout";
import RequireAdmin from "./components/RequireAdmin";

// suspense fallback
import Loader from "./components/Loader";

// LAZY LOADED COMPONENTS
const LandingPage = lazy(() => import("./pages/LandingPage/LandingPage"));
const Signup = lazy(() => import("./pages/auth/Signup"));
const Login = lazy(() => import("./pages/auth/Login"));
const ExamPage = lazy(() => import("./pages/student/ExamPage"));
const ExamDetails = lazy(() => import("./pages/student/ExamDetails"));
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminOrgs = lazy(() => import("./pages/admin/AdminOrgs"));
const AdminCreateExam = lazy(() => import("./pages/admin/AdminCreateExam"));
const AdminExams = lazy(() => import("./pages/admin/AdminExams"));
const AdminEditExam = lazy(() => import("./pages/admin/AdminEditExam"));
const AttemptView = lazy(() => import("./pages/student/AttemptView"));
const AdminAttemptDetails = lazy(() => import("./pages/admin/AdminAttemptDetails"));
const AdminResults = lazy(() => import("./pages/admin/AdminResults"));
const AdminResultDetails = lazy(() => import("./pages/admin/AdminResultDetails"));
const Checkout = lazy(() => import("./pages/payment/Checkout"));


// 🔹 Wrapper to apply AdminLayout ONCE for all admin routes
function AdminWrapper() {
  return (
    <RequireAdmin>
      <AdminLayout>
        <Outlet /> {/* Child routes render here */}
      </AdminLayout>
    </RequireAdmin>
  );
}

export default function App() {
  const token = localStorage.getItem("token");

  return (
    <div className="app">
      <main>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* ================= PUBLIC ================= */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/checkout" element={<Checkout />} />

            {/* ================= STUDENT ROUTES ================= */}
            <Route path="/student" element={token ? <StudentDashboard /> : <Navigate to="/login" />} />
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
              <Route path="results" element={<AdminResults />} />
              <Route path="results/:id" element={<AdminResultDetails />} />
              <Route path="attempt/:id" element={<AttemptView />} />
              <Route path="/admin/attempt/:attemptId" element={<AdminAttemptDetails />} />
            </Route>

          </Routes>
        </Suspense>
      </main>
    </div>
  );
}
