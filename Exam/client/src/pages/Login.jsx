import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import '../pages/login.css';

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
      if (res.data.user.role === "admin") {
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

        {/* Left Side Image Section */}
        <div className="login-left">
          <div className="login-overlay">
            <h2>Vijay Software Solutions Pvt Ltd</h2>
            <p>Online Examination Portal</p>
            <p>Start your exam with confidence.</p>
          </div>
        </div>

        {/* Right Side Form Section */}
        <div className="login-right">
          <div className="login-card">
            <h2 className="logo-text">LOGIN</h2>

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
              <Signup onClick={() => nav("/signup")}>
                Don’t have an account? Sign Up
              </Signup>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
