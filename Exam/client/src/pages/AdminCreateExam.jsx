// client/src/pages/AdminCreateExam.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

export default function AdminCreateExam() {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [orgId, setOrgId] = useState('');
  const [questions, setQuestions] = useState([]);

  function addMCQ(){
    setQuestions(prev => [...prev, { type:'mcq', difficulty:'normal', content:{prompt:''}, choices:['','','',''], correct_answer: {correct:0}, points:1 }]);
  }
  function addCoding(){
    setQuestions(prev => [...prev, { type:'coding', difficulty:'hard', content:{prompt:''}, points:5 }]);
  }

  function updateQuestion(i, key, val){ const arr=[...questions]; arr[i][key]=val; setQuestions(arr); }

  async function createExam(){
    await api.post('/exams/create', { title, duration_minutes: duration, start_date: startDate, end_date: endDate, org_id: orgId, questions });
    alert('Exam created');
    setTitle(''); setQuestions([]);
  }

  return (
    <AdminLayout>
        <AdminNavbar>
       
    <div>
      <h3>Create Exam</h3>
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} />
      <input placeholder="Duration (min)" value={duration} onChange={e=>setDuration(e.target.value)} />
      <input type="datetime-local" value={startDate} onChange={e=>setStartDate(e.target.value)} />
      <input type="datetime-local" value={endDate} onChange={e=>setEndDate(e.target.value)} />
      <input placeholder="Org ID" value={orgId} onChange={e=>setOrgId(e.target.value)} />

      <h4>Questions</h4>
      {questions.map((q,i)=>(
        <div key={i} style={{border:'1px solid #ddd', padding:8, margin:8}}>
          <div>Type: {q.type}</div>
          <input placeholder="Prompt" value={q.content.prompt} onChange={e=>{ q.content.prompt=e.target.value; updateQuestion(i,'content',q.content); }} />
          {q.type==='mcq' && q.choices.map((c,ci)=>(
            <input key={ci} placeholder={`Choice ${ci+1}`} value={q.choices[ci]} onChange={e=>{ q.choices[ci]=e.target.value; updateQuestion(i,'choices',q.choices); }} />
          ))}
          <button onClick={()=>updateQuestion(i,'points', q.points+1)}>Points: {q.points}</button>
        </div>
      ))}

      <button onClick={addMCQ}>Add MCQ</button>
      <button onClick={addCoding}>Add Coding</button>
      <button onClick={createExam}>Create Exam</button>
    </div>
</AdminNavbar >
 </AdminLayout>
  );
}
