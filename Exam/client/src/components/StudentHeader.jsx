import React from "react";
import { useNavigate } from "react-router-dom";
export default function StudentHeader() {
  const nav = useNavigate();

  function logout() {
  if (navigator.mediaDevices) {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => stream.getTracks().forEach(t => t.stop()))
      .catch(() => {});
  }

  localStorage.removeItem("token");
  localStorage.removeItem("user");
  nav("/login");
}


  return (
    <header style={headerStyle}>
      <div style={left}>
        <img src="client\src\resources\Screenshot 2025-11-21 000701.jpg" alt="logo" style={logo} />
        <h3 style={{ marginLeft: 10 }}>VS Solutions Online Examination</h3>
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
