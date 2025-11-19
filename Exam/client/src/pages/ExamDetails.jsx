// (same path) - styled improvements
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

export default function ExamDetails() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [agree, setAgree] = useState(false);
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    api.get(`/exams/${id}`).then(r => setExam(r.data.exam)).catch(()=>nav('/login'));
  }, [id]);

  function formatDate(dt){ if(!dt) return '-'; return new Date(dt).toLocaleString(); }

  async function handleStart(){
    if (!agree) return alert('Please accept T&C');
    nav(`/exams/${id}`);
  }

  if(!exam) return <div>Loading...</div>;
  return (
    <div style={{maxWidth:900, margin:'24px auto', padding:20}}>
      <div style={{display:'flex', gap:20}}>
        <div style={{flex:1, background:'#fff', borderRadius:12, padding:20, boxShadow:'0 8px 24px rgba(15,23,42,0.06)'}}>
          <h2>{exam.title}</h2>
          <p style={{color:'#6b7280'}}>{exam.description}</p>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div style={{background:'#f1f5f9', padding:12, borderRadius:8}}>Duration: <strong>{exam.duration_minutes} mins</strong></div>
            <div style={{background:'#f1f5f9', padding:12, borderRadius:8}}>Start: {formatDate(exam.start_date)}</div>
            <div style={{background:'#f1f5f9', padding:12, borderRadius:8}}>End: {formatDate(exam.end_date)}</div>
            <div style={{background:'#f1f5f9', padding:12, borderRadius:8}}>Assigned Org: {exam.org_id || '-'}</div>
          </div>

          <h3 style={{marginTop:16}}>Instructions</h3>
          <ol>
            <li>Questions will appear only after you press <strong>Start Exam</strong>.</li>
            <li>Do not switch tabs; it will be logged.</li>
            <li>Webcam snapshots will be taken periodically.</li>
            <li>Once submitted or timed out, exam cannot be retaken.</li>
          </ol>

          <label style={{display:'block', marginTop:12}}>
            <input type="checkbox" checked={agree} onChange={e=>setAgree(e.target.checked)} /> I agree to the instructions and T&C.
          </label>

          <div style={{marginTop:12}}>
            <button onClick={handleStart} disabled={!agree} style={{padding:'10px 14px', borderRadius:8, background:'#4f46e5', color:'#fff'}}>Start Exam (Enter Fullscreen)</button>
          </div>
        </div>

        <aside style={{width:320}}>
          <div style={{background:'#fff', padding:12, borderRadius:12, boxShadow:'0 6px 18px rgba(0,0,0,0.04)'}}>
            <h4>Candidate</h4>
            <div><strong>{user.name}</strong></div>
            <div style={{color:'#6b7280', fontSize:13}}>ID: {user.id}</div>
          </div>

          <div style={{marginTop:16, background:'#fff', padding:12, borderRadius:12}}>
            <h4>Exam Model</h4>
            <p style={{fontSize:13}}>This exam has multiple-choice and coding questions. Auto grading for MCQs; coding evaluated later.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
