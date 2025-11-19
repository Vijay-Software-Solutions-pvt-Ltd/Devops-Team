// client/src/pages/ExamList.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link, useNavigate } from 'react-router-dom';

export default function ExamList() {
  const [exams, setExams] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { nav('/login'); return; }
    api.get('/exams/assigned').then(r => setExams(r.data.exams)).catch(() => nav('/login'));
  }, []);

  return (
    <div>
      <h3>Available Exams</h3>
      <ul>
        {exams.map(e => (
          <li key={e.id}>
            <Link to={`/exams/${e.id}/details`}>{e.title} — {e.duration_minutes} mins</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
