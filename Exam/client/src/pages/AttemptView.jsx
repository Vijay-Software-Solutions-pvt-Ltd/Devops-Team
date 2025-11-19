// client/src/pages/AttemptView.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

export default function AttemptView() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  useEffect(()=> {
    api.get(`/admin/attempts/${id}`).then(r => setData(r.data)).catch(e=>console.error(e));
  }, [id]);
  if (!data) return <div>Loading...</div>;
  const { attempt, answers, logs, snapshots } = data;
  return (
    <div>
      <h3>Attempt {attempt.id}</h3>
      <p>User: {attempt.user_id}</p>
      <p>Score: {attempt.total_score}</p>
      <h4>Answers</h4>
      <pre style={{whiteSpace:'pre-wrap'}}>{JSON.stringify(answers, null, 2)}</pre>
      <h4>Logs</h4>
      <ul>{logs.map(l => <li key={l.id}>{l.event_ts} - {l.event_type} - {JSON.stringify(l.meta)}</li>)}</ul>
      <h4>Snapshots</h4>
      <ul>{snapshots.map(s => <li key={s.id}><a href={`#snapshot-${s.id}`} onClick={() => alert('Preview stored in DB - implement S3 storage for previews')}>{s.id} - {s.captured_at}</a></li>)}</ul>
    </div>
  );
}
