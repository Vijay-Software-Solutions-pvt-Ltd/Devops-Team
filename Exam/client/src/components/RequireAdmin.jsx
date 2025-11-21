<<<<<<< HEAD
// // client/src/components/RequireAdmin.jsx
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// export default function RequireAdmin({ children }) {
//   const user = JSON.parse(localStorage.getItem('user') || '{}');
//   if (!user || user.role !== 'admin') {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// }





import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RequireAdmin({ children }) {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // ⭐ FIX: normalize role to lowercase
  const role = String(user?.role || "").toLowerCase();

  if (role !== 'admin') {
    return <Navigate to="/login" replace />;
=======
// client/src/components/RequireAdmin.jsx
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token) return <Navigate to="/login" />;

  if (user.role !== "admin") {
    return <Navigate to="/student" />;
>>>>>>> 93355c21baf72e0f7b0e68f8b5e81e70f5f65bb2
  }

  return children;
}
