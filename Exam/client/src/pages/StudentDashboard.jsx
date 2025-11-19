// client/src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);
  useEffect(()=> {
    api.get('/exams/assigned').then(r => setExams(r.data.exams)).catch(()=>{});
  },[]);

  return (
    <div style={{padding:20, maxWidth:1000, margin:'0 auto'}}>
      <h2 style={{background:'linear-gradient(90deg,#4f46e5,#06b6d4)', WebkitBackgroundClip:'text', color:'transparent'}}>Welcome to your Exams</h2>
      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16, marginTop:16}}>
        {exams.length === 0 && <div style={{gridColumn:'1/-1', padding:24, background:'#fff', borderRadius:12}}>No exams available</div>}
        {exams.map(e=>(
          <div key={e.id} style={{background:'linear-gradient(180deg,#ffffff,#f8fafc)', padding:16, borderRadius:12, boxShadow:'0 8px 20px rgba(0,0,0,0.06)'}}>
            <h3>{e.title}</h3>
            <p style={{color:'#6b7280'}}>{e.description}</p>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
              <div style={{fontSize:12, color:'#6b7280'}}>Duration: {e.duration_minutes} mins</div>
              <Link to={`/exams/${e.id}/details`} style={{background:'#4f46e5', color:'#fff', padding:'8px 10px', borderRadius:8}}>View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
