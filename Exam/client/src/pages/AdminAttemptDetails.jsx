import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';

export default function AdminAttemptDetails() {
  const { attemptId } = useParams();
  const [snapshots, setSnapshots] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get(`/admin/reports/attempt/${attemptId}/snapshots`)
      .then(r => setSnapshots(r.data.snapshots || []))
      .catch(() => {});
  }, [attemptId]);

  return (
    <div style={{ padding: '24px', background: '#f8fafc', minHeight: '100vh' }}>
      <h2>Attempt Monitoring</h2>

      {/* Grid */}
      <div style={grid}>
        {snapshots.map((s) => (
          <img
            key={s.id}
            src={s.image_url}
            alt="snapshot"
            style={thumb}
            onClick={() => setSelected(s.image_url)}
          />
        ))}
      </div>

      {/* Modal Preview */}
      {selected && (
        <div style={overlay} onClick={() => setSelected(null)}>
          <img src={selected} style={fullscreenImg} alt="preview" />
        </div>
      )}
    </div>
  );
}

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill,minmax(140px,1fr))',
  gap: '12px',
  marginTop: '20px'
};

const thumb = {
  width: '100%',
  height: '120px',
  objectFit: 'cover',
  borderRadius: '12px',
  cursor: 'pointer',
  boxShadow: '0 5px 16px rgba(0,0,0,0.1)'
};

const overlay = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0,0,0,0.85)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const fullscreenImg = {
  maxWidth: '90%',
  maxHeight: '90%',
  borderRadius: '16px'
};
