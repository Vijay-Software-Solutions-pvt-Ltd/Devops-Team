import React, { useState } from "react";
import api from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/signup.css"; // reuse same CSS for consistency
import img2 from "../../assets/images/logo.png";

export default function Signup() {
  const nav = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    org_id: "",
    password: "",
    confirmPassword: "",
    department: "",
    sub_department: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function handleSignup(e) {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/register", {
        ...formData,
        role: "student",
      });

      alert("Registration successful. Please login.");
      nav("/login");
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || "Signup failed");
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Side */}
        <div className="login-left">
          <div className="login-overlay">
            <img src={img2} className="v-logo" alt="Logo" />
            <h2>ExamPortal</h2>
            <p className="font-semibold text-sm uppercase tracking-wider text-blue-200 mt-1 mb-3">Powered by Vijay Software</p>
            <p>Create your account to get started.</p>
          </div>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <div className="login-card">
            <h2 className="logo-text" style={{ color: '#1E90FF', textShadow: '2px 2px 4px #000000' }}>SIGN UP</h2>

            <form onSubmit={handleSignup}>

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter full name"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  placeholder="10-digit mobile number"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Organisation ID</label>
                <input
                  type="text"
                  name="org_id"
                  placeholder="Enter Organisation ID"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="********"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="********"
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Department</label>
                <input
                  type="text"
                  name="department"
                  placeholder="Department"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Sub Department</label>
                <input
                  type="text"
                  name="sub_department"
                  placeholder="Sub Department"
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="login-btn">
                Register
              </button>

              <p style={{ marginTop: "12px", textAlign: "center" }}>
                <Link to="/login" className="signup-link">
                  Already have an account? Login
                </Link>
              </p>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
