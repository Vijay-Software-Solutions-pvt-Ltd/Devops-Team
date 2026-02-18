// client/src/components/AdminLayout.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiUsers, FiBookOpen, FiLayers, FiLogOut, FiPieChart, FiSettings
} from "react-icons/fi";
import img1 from "../assets/images/img2.jpg";

export default function AdminLayout({ children }) {
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.replace("/#/login");
    window.location.reload();
  }

  const menuItems = [
    { to: "/admin", label: "Dashboard", icon: <FiHome /> },
    { to: "/admin/orgs", label: "Organizations", icon: <FiLayers /> },
    { to: "/admin/users", label: "Users", icon: <FiUsers /> },
    { to: "/admin/exams", label: "Exams", icon: <FiBookOpen /> },
    { to: "/admin/create-exam", label: "Create Exam", icon: <FiBookOpen /> },
    { to: "/admin/results", label: "Results", icon: <FiPieChart /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">

      {/* ===== TOP HEADER ===== */}
      <header className="h-16 bg-white border-b border-slate-200 fixed w-full top-0 z-30 flex items-center justify-between px-6 shadow-sm">
        <div className="flex items-center">
          {/* Logo area - adjusting to look better */}
          <div className="flex items-center gap-3">
            <img
              src={img1}
              alt="Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-indigo-700 hidden md:block">
              VIJAY SOFTWARE SOLUTION
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <FiLogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </header>

      {/* ===== BODY AREA (Sidebar + Content) ===== */}
      <div className="flex pt-16 h-screen overflow-hidden">

        {/* === SIDEBAR === */}
        <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col flex-shrink-0 z-20">
          <div className="p-6">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
              Admin Menu
            </h2>
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group ${isActive
                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                  >
                    <span className={`mr-3 text-lg ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="mt-auto p-6 border-t border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Admin User</p>
                <p className="text-xs text-slate-500">master admin</p>
              </div>
            </div>
          </div>
        </aside>

        {/* === MAIN CONTENT === */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative scroll-smooth">
          <div className="w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
