// client/src/components/AdminLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function AdminLayout({ children }) {
  return (
    <div style={{display:'flex', minHeight:'100vh'}}>
      <aside style={{width:220, background:'#0f172a', color:'#fff', padding:20}}>
        <h3 style={{margin:0, marginBottom:12}}>Admin</h3>
        <nav style={{display:'flex', flexDirection:'column', gap:8}}>
          <Link to="/admin" style={{color:'#cbd5e1'}}>Dashboard</Link>
          <Link to="/admin/orgs" style={{color:'#cbd5e1'}}>Organizations</Link>
          <Link to="/admin/users" style={{color:'#cbd5e1'}}>Users</Link>
          <Link to="/admin/create-exam" style={{color:'#cbd5e1'}}>Create Exam</Link>
        </nav>
      </aside>

      <main style={{flex:1, background:'#f8fafc'}}>
        <header style={{height:64, display:'flex', alignItems:'center', padding:'0 20px', borderBottom:'1px solid rgba(0,0,0,0.05)'}}>
          <div style={{fontWeight:700}}>Exam Portal Admin</div>
          <div style={{marginLeft:'auto'}}>
            <button onClick={()=>{ localStorage.removeItem('token'); localStorage.removeItem('user'); window.location='/login'; }}>Logout</button>
          </div>
        </header>

        <div style={{padding:20}}>
          {children}
        </div>
      </main>
    </div>
  );
}
