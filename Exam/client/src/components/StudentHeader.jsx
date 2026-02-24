import React from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/images/logo.jpg";

export default function StudentHeader() {
  const nav = useNavigate();
  function logout() {
    if (window.stream) {
      window.stream.getTracks().forEach(track => track.stop());
      window.stream = null;
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    nav("/#/login");
  }



  return (
    <header style={headerStyle}>
      <div style={left}>
        <div style={{ marginLeft: 15, display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: 0, color: '#1e293b', fontSize: '1.25rem' }}>ExamPortal</h3>
          <span style={{ fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
            Powered by Vijay Software
          </span>
        </div>
      </div>

      <button onClick={logout} style={logoutBtn}>Logout</button>
    </header>
  );
}

const headerStyle = {
  height: "64px",
  background: "#fff",
  borderBottom: "1px solid #e5e7eb",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "0 24px"
};

const left = {
  display: "flex",
  alignItems: "center"
};

const logo = {
  height: "40px"
};

const logoutBtn = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "8px 16px",
  borderRadius: "8px",
  cursor: "pointer"
};
