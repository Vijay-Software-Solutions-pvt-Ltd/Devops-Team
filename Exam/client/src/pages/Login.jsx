<<<<<<< HEAD
// // client/src/pages/Login.jsx
// import React, { useState } from 'react';
// import api from '../services/api';
// import { useNavigate } from 'react-router-dom';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const nav = useNavigate();

//   async function handleLogin(e) {
//     e.preventDefault();
//     try {
//       const res = await api.post('/auth/login', { email, password });
//       localStorage.setItem('token', res.data.token);
//       // store user object for client-side RBAC
//       localStorage.setItem('user', JSON.stringify(res.data.user || {}));

//       // redirect based on role
//       const role = res.data.user?.role || 'user';
//       if (role === 'admin') {
//         nav('/admin');
//       } else {
//         nav('/');
//       }
//     } catch (err) {
//       console.error(err);
//       alert(err?.response?.data?.error || 'Login failed');
//     }
//   }

//   return (
//     <div className="card" style={{maxWidth:400, margin:'40px auto'}}>
//       <h3>Login</h3>
//       <form onSubmit={handleLogin}>
//         <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//         <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }




import React, { useState, useEffect } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

import bgImage from "../assets/images/img1.jpg";
import logo from "../assets/images/logo.jpg";
=======
import React, { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import '../pages/login.css';
>>>>>>> 93355c21baf72e0f7b0e68f8b5e81e70f5f65bb2

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    document.body.style.margin = "0";
    document.body.style.background = "transparent";
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });

<<<<<<< HEAD
      // Save token
      localStorage.setItem("token", res.data.token);

      // FIXED — read role from API safely
      const role =
        res.data.role || res.data.user?.role || "user";

      // Store user details with role
      localStorage.setItem(
        "user",
        JSON.stringify({
          email: res.data.user?.email,
          role: role,
        })
      );

      // Redirect based on role
      if (role === "admin") {
        nav("/admin");
      } else {
        nav("/student");   // change to your student page
      }
    } catch (err) {
=======
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        nav("/admin");
      } else {
        nav("/student");
      }
    } catch (err) {
      console.error(err);
>>>>>>> 93355c21baf72e0f7b0e68f8b5e81e70f5f65bb2
      alert(err?.response?.data?.error || "Login failed");
    }
  }

  return (
<<<<<<< HEAD
    <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-r from-[#5499D6] to-[#4787C1] p-4">

      {/* CARD CONTAINER */}
      <div
        className="
          w-[85%]
          max-w-4xl
          rounded-3xl
          backdrop-blur-md
          bg-white
          shadow-2xl shadow-blue-900/20
          grid grid-cols-1 md:grid-cols-2
          overflow-hidden
          relative
        "
      >

        {/* LEFT IMAGE */}
        <div className="relative hidden md:block">

          <img
            src={bgImage}
            alt="Exam"
            className="w-full h-full object-cover blur-[1.5px]"
          />

          <div className="absolute inset-0 bg-gradient-to-br from-[#5499D6]/40 to-[#4787C1]/40"></div>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-white text-center">
            <h2 className="text-xl font-semibold leading-snug drop-shadow-md">
              Vijay Software Solutions Pvt Ltd – Online Exam Login.
            </h2>
            <p className="mt-3 text-sm opacity-90">
              Enter your ID and password to continue.
              <br />
              Start your exam with confidence.
            </p>
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="relative py-12 px-10 md:px-14 flex flex-col justify-center">

          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/30 rounded-full blur-2xl"></div>

          <div className="text-center mb-10 relative z-10">
            <div className="flex items-center justify-center gap-3 mb-2">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
              <span className="font-semibold text-gray-700 tracking-wide">
                VIJAY SOFTWARE SOLUTIONS
              </span>
            </div>

            <h2 className="text-2xl font-semibold text-[#4787C1]">LOGIN</h2>
          </div>

          <form className="space-y-6 relative z-10" onSubmit={handleLogin}>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#4787C1] bg-white/70"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-4 py-3 border border-gray-300 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-[#4787C1] bg-white/70"
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-40 bg-[#4787C1] hover:bg-[#3D76AC] text-white py-2 rounded-md 
                font-medium shadow-md transition active:scale-95"
              >
                Submit
              </button>
            </div>
          </form>
=======
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
            </form>
          </div>
>>>>>>> 93355c21baf72e0f7b0e68f8b5e81e70f5f65bb2
        </div>

      </div>
    </div>
  );
}
