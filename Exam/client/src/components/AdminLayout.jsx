<<<<<<< HEAD
// // // client/src/components/AdminLayout.jsx
// // import React from 'react';
// // import { Link } from 'react-router-dom';

// // export default function AdminLayout({ children }) {
// //   return (
// //     <div style={{display:'flex', minHeight:'100vh'}}>
// //       <aside style={{width:220, background:'#0f172a', color:'#fff', padding:20}}>
// //         <h3 style={{margin:0, marginBottom:12}}>Admin</h3>
// //         <nav style={{display:'flex', flexDirection:'column', gap:8}}>
// //           <Link to="/admin" style={{color:'#cbd5e1'}}>Dashboard</Link>
// //           <Link to="/admin/orgs" style={{color:'#cbd5e1'}}>Organizations</Link>
// //           <Link to="/admin/users" style={{color:'#cbd5e1'}}>Users</Link>
// //           <Link to="/admin/create-exam" style={{color:'#cbd5e1'}}>Create Exam</Link>
// //         </nav>
// //       </aside>

// //       <main style={{flex:1, background:'#f8fafc'}}>
// //         <header style={{height:64, display:'flex', alignItems:'center', padding:'0 20px', borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
// //           <div style={{fontWeight:700}}>Exam Portal Admin</div>
// //           <div style={{marginLeft:'auto'}}>
// //             <button onClick={()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); window.location='/login'; }}>Logout</button>
// //           </div>
// //         </header>

// //         <div style={{padding:20}}>
// //           {children}
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }






// import React from "react";
// import { NavLink } from "react-router-dom";
// import { LayoutDashboard, Building2, Users, FilePlus2, MessageCircle, LogOut } from "lucide-react";
// import logo from "../assets/images/logo.jpg";

// export default function AdminLayout({ children }) {
//   return (
//     <div className="flex min-h-screen bg-gray-100">

//       {/* SIDEBAR */}
//       <aside className="w-64 bg-white border-r shadow-sm">
//         {/* Logo Section */}
//         <div className="flex items-center gap-3 px-6 py-5 border-b">
//           <img src={logo} alt="logo" className="h-10 w-10 object-contain" />
//           <span className="font-semibold tracking-wide text-gray-800">
//             VIJAY SOFTWARE SOLUTION
//           </span>
//         </div>

//         {/* Navigation */}
//         <nav className="flex flex-col mt-4 px-4 space-y-1">

//           <NavItem to="/admin" icon={<LayoutDashboard size={18} />} label="Dashboard" />
//           <NavItem to="/admin/orgs" icon={<Building2 size={18} />} label="Organizations" />
//           <NavItem to="/admin/users" icon={<Users size={18} />} label="Users" />
//           <NavItem to="/admin/create-exam" icon={<FilePlus2 size={18} />} label="Create Exam" />
//           <NavItem to="/admin/chat" icon={<MessageCircle size={18} />} label="Chatbox" />

//         </nav>
//       </aside>

//       {/* MAIN CONTENT AREA */}
//       <main className="flex-1 flex flex-col">

//         {/* TOP NAVBAR */}
//         <header className="h-16 bg-white shadow-sm border-b flex items-center px-6">
//           <h1 className="text-lg font-semibold text-gray-700">Exam Portal Admin Dashboard</h1>

//           <button
//             onClick={() => {
//               localStorage.removeItem("token");
//               localStorage.removeItem("user");
//               window.location = "/login";
//             }}
//             className="ml-auto flex items-center gap-2 bg-[#4787C1] text-white px-4 py-2 rounded-md hover:bg-[#3f7ab0] transition"
//           >
//             <LogOut size={18} />
//             Logout
//           </button>
//         </header>

//         {/* MAIN PAGE CONTENT */}
//         <div className="p-6">
//           {children}
//         </div>

//       </main>
//     </div>
//   );
// }

// // ⭐ Reusable Sidebar Nav Item (with Active Highlight)
// function NavItem({ to, icon, label }) {
//   return (
//     <NavLink
//       to={to}
//       className={({ isActive }) =>
//         `flex items-center gap-3 px-4 py-2 rounded-md transition ${
//           isActive
//             ? "bg-blue-600 text-white shadow"
//             : "text-gray-700 hover:bg-gray-100"
//         }`
//       }
//     >
//       {icon}
//       <span>{label}</span>
//     </NavLink>
//   );
// }






import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  Users,
  BookOpen,
  MessageSquare,
  LogOut,
} from "lucide-react";

import logo from "../assets/images/logo.jpg";

export default function AdminLayout({ children }) {
  const location = useLocation();
  const nav = useNavigate();

  const menu = [
    { name: "Dashboard", icon: LayoutGrid, path: "/admin" },
    { name: "Organizations", icon: FileText, path: "/admin/orgs" },
    { name: "Users", icon: Users, path: "/admin/users" },
    { name: "Create Exam", icon: BookOpen, path: "/admin/create-exam" },
    { name: "Chatbox", icon: MessageSquare, path: "/admin/chat" },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">

      {/* ===================== TOP NAVBAR ===================== */}
      <header className="w-full h-16 bg-white border-b shadow-sm flex items-center justify-between px-6">
        
        {/* Logo + Name */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-10 h-10 object-contain" />
          <span className="text-lg font-semibold tracking-wide">
            VIJAY SOFTWARE SOLUTIONS
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            nav("/login");
          }}
          className="flex items-center gap-2 bg-[#2d6ecf] hover:bg-[#1d57b9] text-white px-4 py-2 rounded-md"
        >
          <LogOut size={16} />
=======
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
    window.location.href = "/login";
  }

  return (
    <div style={container}>

      {/* ===== TOP HEADER ===== */}
      <header style={header}>
    

        <button style={logoutBtn} onClick={handleLogout}>
          <FiLogOut style={{ marginRight: 6 }} />
>>>>>>> 93355c21baf72e0f7b0e68f8b5e81e70f5f65bb2
          Logout
        </button>
      </header>

<<<<<<< HEAD
      {/* ===================== MAIN AREA ===================== */}
      <div className="flex flex-1 overflow-hidden">

        {/* ===================== SIDEBAR ===================== */}
        <aside className="w-64 bg-white border-r shadow-sm pt-6">
          
          {/* Sidebar menu items */}
          <nav className="flex flex-col gap-2 px-4">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[15px] font-medium 
                    ${
                      active
                        ? "bg-[#2d6ecf] text-white shadow"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  <Icon size={18} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

        </aside>

        {/* ===================== CONTENT AREA ===================== */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>

=======
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
>>>>>>> 93355c21baf72e0f7b0e68f8b5e81e70f5f65bb2
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
