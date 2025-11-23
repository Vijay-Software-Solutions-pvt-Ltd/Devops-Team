// client/src/components/AdminLayout.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome, FiUsers, FiBookOpen, FiLayers, FiLogOut
} from "react-icons/fi";

export default function AdminLayout({ children }) {
  const location = useLocation();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/#/login";
  }

  return (
    <div style={container}>

      {/* ===== TOP HEADER ===== */}
      <header style={header}>
    

        <button style={logoutBtn} onClick={handleLogout}>
          <FiLogOut style={{ marginRight: 6 }} />
          Logout
        </button>
      </header>

      {/* ===== BODY AREA (Sidebar + Content) ===== */}
      <div style={bodyWrapper}>

        {/* === SIDEBAR === */}
        <aside style={sidebar}>
          <div style={brand}>Admin Menu</div>

          <nav style={nav}>
            <MenuItem
              to="/admin"
              label="Dashboard"
              icon={<FiHome />}
              active={location.pathname === "/admin"}
            />

            <MenuItem
              to="/admin/orgs"
              label="Organizations"
              icon={<FiLayers />}
              active={location.pathname === "/admin/orgs"}
            />

            <MenuItem
              to="/admin/users"
              label="Users"
              icon={<FiUsers />}
              active={location.pathname === "/admin/users"}
            />

            <MenuItem
              to="/admin/create-exam"
              label="Create Exam"
              icon={<FiBookOpen />}
              active={location.pathname === "/admin/create-exam"}
            />
          </nav>
        </aside>

        {/* === MAIN CONTENT === */}
        <main style={mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}

/* ===== MENU ITEM COMPONENT ===== */
function MenuItem({ to, label, icon, active }) {
  return (
    <Link
      to={to}
      style={{
        ...menuItem,
        background: active ? '#2563eb' : 'transparent',
        color: active ? '#ffffff' : '#1e293b'
      }}
    >
      <span style={{ marginRight: 12 }}>{icon}</span>
      {label}
    </Link>
  );
}

/* ===== STYLES ===== */

const container = {
  height: '100vh',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  background: '#f1f5f9'
};

const header = {
  height: '64px',
  width: '96.2%',
  background: '#ffffff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 24px',
  borderBottom: '1px solid #e5e7eb',
  boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  zIndex: 10
};

const headerTitle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#1e293b'
};

const logoutBtn = {
  display: 'flex',
  alignItems: 'center',
  background: '#2563eb',
  color: '#ffffff',
  border: 'none',
  borderRadius: '10px',
  padding: '8px 16px',
  fontWeight: '600',
  cursor: 'pointer'
};

const bodyWrapper = {
  display: 'flex',
  flex: 1
};

const sidebar = {
  width: '250px',
  background: 'linear-gradient(180deg, #eaf2ff, #deeaff)',
  padding: '24px',
  boxShadow: '2px 0px 12px rgba(0,0,0,0.05)'
};

const brand = {
  fontSize: '20px',
  fontWeight: '800',
  color: '#1e3a8a',
  marginBottom: '30px'
};

const nav = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const menuItem = {
  display: 'flex',
  alignItems: 'center',
  padding: '12px 14px',
  borderRadius: '12px',
  fontWeight: 500,
  textDecoration: 'none',
  transition: 'all 0.2s ease'
};

const mainContent = {
  flex: 1,
  padding: '24px',
  background: '#f6f9fd',
  overflowY: 'auto'
};
