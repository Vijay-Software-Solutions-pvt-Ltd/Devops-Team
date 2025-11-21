// client/src/pages/AdminOrgs.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function AdminOrgs() {
  const [orgs, setOrgs] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrgs();
  }, []);

  async function fetchOrgs() {
    try {
      const res = await api.get('/orgs');
      setOrgs(res.data.orgs || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function createOrg() {
    if (!name || !address) return alert("Enter all fields");
    setLoading(true);
    try {
      const res = await api.post('/orgs', { name, address });
      alert('✅ Organization created');
      setName('');
      setAddress('');
      fetchOrgs();
    } catch (err) {
      alert('Failed to create org');
    }
    setLoading(false);
  }

  return (
    <div style={pageWrapper}>
      <h2 style={pageTitle}>Organizations</h2>

      {/* Create Org Card */}
      <div style={card}>
        <h4 style={cardHeader}>Create Organization</h4>

        <div style={formRow}>
          <input
            style={inputStyle}
            placeholder="Organization Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            style={inputStyle}
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button style={buttonStyle} onClick={createOrg} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>

      {/* List Orgs */}
      <div style={card}>
        <h4 style={cardHeader}>All Organizations</h4>

        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Address</th>
              <th style={th}>Org ID</th>
            </tr>
          </thead>
          <tbody>
            {orgs.length === 0 ? (
              <tr>
                <td colSpan="3" style={emptyState}>No organizations found</td>
              </tr>
            ) : (
              orgs.map((o, idx) => (
                <tr key={o.id} style={idx % 2 ? rowAlt : {}}>
                  <td style={td}>{o.name}</td>
                  <td style={td}>{o.address}</td>
                  <td style={td}><code>{o.id}</code></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */

const pageWrapper = {
  padding: '10px 10px',
  background: '#f1f5f9',
  minHeight: '100vh'
};

const pageTitle = {
  fontSize: '26px',
  fontWeight: 700,
  marginBottom: '20px'
};

const card = {
  background: '#ffffff',
  borderRadius: '16px',
  boxShadow: '0 6px 18px rgba(0,0,0,0.06)',
  padding: '20px',
  marginBottom: '20px'
};

const cardHeader = {
  fontSize: '16px',
  fontWeight: 600,
  marginBottom: '14px'
};

const formRow = {
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap'
};

const inputStyle = {
  flex: 1,
  minWidth: '220px',
  padding: '12px',
  borderRadius: '12px',
  border: '1px solid #cbd5f5',
  fontSize: '14px'
};

const buttonStyle = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '12px',
  padding: '12px 18px',
  fontWeight: 600,
  cursor: 'pointer'
};

const table = {
  width: '100%',
  borderCollapse: 'collapse'
};

const th = {
  textAlign: 'left',
  fontSize: '13px',
  color: '#475569',
  background: '#e2e8f0',
  padding: '12px'
};

const td = {
  padding: '12px',
  fontSize: '14px',
  borderBottom: '1px solid #e2e8f0'
};

const rowAlt = {
  background: '#f8fafc'
};

const emptyState = {
  textAlign: 'center',
  padding: '20px',
  color: '#94a3b8'
};
