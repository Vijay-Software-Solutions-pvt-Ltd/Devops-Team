import React, { useState } from "react";
import api from "../../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../../assets/css/login.css";
import img2 from "../../assets/images/logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();


  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin" || res.data.user.role === "superadmin") {
        nav("/admin");
      } else {
        nav("/student");
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Login failed");
    }
  }
  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Side */}
        <div className="login-left">
          <div className="login-overlay">
            <img src={img2} className="v-logo" />
            <h2>ExamPortal</h2>
            <p className="font-semibold text-sm uppercase tracking-wider text-blue-200 mt-1 mb-3">Powered by Vijay Software</p>
            <p>Start your exam with confidence.</p>
          </div>
        </div>
        {/* Right Side */}
        <div className="login-right">
          <div className="login-card">
            <h2 className="logo-text" style={{ color: '#1E90FF', textShadow: '2px 2px 4px #000000' }}>LOGIN</h2>

            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-btn">
                Submit
              </button>

              {/* ✅ FIXED SIGNUP LINK */}
              <p style={{ marginTop: "12px", textAlign: "center" }}>
                <Link to="/signup" className="signup-link">
                  Don’t have an account? Sign Up
                </Link>
              </p>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}
