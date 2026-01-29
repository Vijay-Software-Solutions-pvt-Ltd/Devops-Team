// client/src/pages/AdminOrgs.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { FiLayers, FiMapPin, FiPlus, FiBriefcase, FiHash, FiEdit, FiTrash2, FiX } from "react-icons/fi";

export default function AdminOrgs() {
  const [orgs, setOrgs] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);

  useEffect(() => {
    fetchOrgs();
  }, []);

  async function fetchOrgs() {
    try {
      const res = await api.get('/admin/orgs/');
      setOrgs(res.data.orgs || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit() {
    if (!name || !address) return alert("Enter all fields");
    setLoading(true);
    try {
      if (editingOrg) {
        // Update
        await api.put(`/admin/orgs/${editingOrg.id}`, { name, address });
        alert('✅ Organization updated successfully!');
      } else {
        // Create
        await api.post('/admin/orgs/', { name, address });
        alert('✅ Organization created successfully!');
      }
      resetForm();
      fetchOrgs();
    } catch (err) {
      alert('Failed to save org');
      console.error(err);
    }
    setLoading(false);
  }

  async function deleteOrg(id) {
    if (!confirm("Are you sure you want to delete this organization?")) return;
    try {
      await api.delete(`/admin/orgs/${id}`);
      fetchOrgs();
    } catch (err) {
      alert("Failed to delete: " + (err.response?.data?.error || err.message));
    }
  }

  function handleEdit(org) {
    setEditingOrg(org);
    setName(org.name);
    setAddress(org.address);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingOrg(null);
    setName('');
    setAddress('');
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Organization Management</h1>
      <p style={styles.subtitle}>Manage departments and organizational units</p>

      {/* Grid Layout */}
      <div style={styles.grid}>

        {/* Create Org Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.iconCircle}>{editingOrg ? <FiEdit /> : <FiPlus />}</span>
            <h3 style={styles.cardTitle}>{editingOrg ? "Edit Organization" : "Create New Organization"}</h3>
            {editingOrg && (
              <button onClick={resetForm} style={styles.closeBtn} title="Cancel Edit"><FiX /></button>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Organization Name</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}><FiBriefcase /></span>
              <input
                style={styles.input}
                placeholder="e.g. Engineering Dept"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Location / Address</label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}><FiMapPin /></span>
              <input
                style={styles.input}
                placeholder="e.g. Building A, Floor 3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <button style={styles.button} onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : (editingOrg ? "Update Organization" : "Create Organization")}
          </button>
        </div>

        {/* List Orgs Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={{ ...styles.iconCircle, background: '#e0f2fe', color: '#0284c7' }}><FiLayers /></span>
            <h3 style={styles.cardTitle}>Existing Organizations ({orgs.length})</h3>
          </div>

          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Address</th>
                  <th style={styles.th}>Org ID (UUID)</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orgs.length === 0 ? (
                  <tr>
                    <td colSpan="3" style={styles.emptyState}>No organizations found.</td>
                  </tr>
                ) : (
                  orgs.map((o, idx) => (
                    <tr key={o.id} style={idx % 2 !== 0 ? styles.trAlt : {}}>
                      <td style={styles.td}>
                        <div style={styles.orgName}>{o.name}</div>
                      </td>
                      <td style={styles.td}>
                        <div style={styles.orgAddr}><FiMapPin size={12} style={{ marginRight: 4 }} /> {o.address}</div>
                      </td>
                      <td style={styles.td}>
                        <code style={styles.code}>{o.id}</code>
                      </td>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEdit(o)} style={styles.iconBtn} title="Edit">
                            <FiEdit />
                          </button>
                          <button onClick={() => deleteOrg(o.id)} style={{ ...styles.iconBtn, color: '#ef4444', borderColor: '#fecaca', background: '#fef2f2' }} title="Delete">
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif"
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginBottom: '32px'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
    alignItems: 'start'
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid #e2e8f0',
    padding: '24px',
    overflow: 'hidden'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px'
  },
  iconCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#eff6ff',
    color: '#2563eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#334155',
    margin: 0
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: '500',
    color: '#64748b',
    marginBottom: '8px'
  },
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    color: '#94a3b8'
  },
  input: {
    width: '100%',
    padding: '10px 10px 10px 36px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s'
  },
  button: {
    width: '100%',
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)'
  },
  tableWrapper: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  th: {
    textAlign: 'left',
    padding: '14px',
    background: '#f8fafc',
    color: '#64748b',
    fontWeight: '600',
    borderBottom: '1px solid #e2e8f0'
  },
  td: {
    padding: '14px',
    borderBottom: '1px solid #e2e8f0',
    color: '#334155',
    verticalAlign: 'middle'
  },
  trAlt: {
    background: '#f8fafc'
  },
  orgName: {
    fontWeight: '600',
    color: '#0f172a'
  },
  orgAddr: {
    fontSize: '13px',
    color: '#64748b',
    display: 'flex',
    alignItems: 'center'
  },
  code: {
    background: '#f1f5f9',
    padding: '4px 8px',
    borderRadius: '6px',
    fontFamily: 'monospace',
    fontSize: '11px',
    color: '#475569',
    border: '1px solid #e2e8f0'
  },
  emptyState: {
    textAlign: 'center',
    padding: '24px',
    color: '#94a3b8'
  }
  ,
  iconBtn: {
    padding: '6px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    background: 'white',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b'
  },
  closeBtn: {
    marginLeft: 'auto',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#94a3b8'
  }
};
