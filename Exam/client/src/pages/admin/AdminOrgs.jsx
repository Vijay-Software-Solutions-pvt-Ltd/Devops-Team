// client/src/pages/AdminOrgs.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FiLayers, FiMapPin, FiPlus, FiBriefcase, FiHash, FiEdit, FiTrash2, FiX } from "react-icons/fi";

export default function AdminOrgs() {
  const [orgs, setOrgs] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  // Subscription & Admin fields
  const [plan, setPlan] = useState('flexi');
  const [usersLimit, setUsersLimit] = useState(250);
  const [examsLimit, setExamsLimit] = useState(12);
  const [adminFirstName, setAdminFirstName] = useState('');
  const [adminLastName, setAdminLastName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminPhone, setAdminPhone] = useState('');

  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false); // Toggle for create form
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
        await api.post('/admin/orgs/', {
          name,
          address,
          plan,
          users_limit: usersLimit,
          exams_limit: examsLimit,
          adminFirstName,
          adminLastName,
          adminEmail,
          adminPassword,
          adminPhone
        });
        alert('✅ Organization and Admin created successfully!');
      }
      resetForm();
      fetchOrgs();
    } catch (err) {
      alert(err?.response?.data?.error || 'Failed to save org');
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
    setAddress(org.address);
    setShowForm(true); // Open form when editing
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function resetForm() {
    setEditingOrg(null);
    setName('');
    setAddress('');
    setPlan('flexi');
    setUsersLimit(250);
    setExamsLimit(12);
    setAdminFirstName('');
    setAdminLastName('');
    setAdminEmail('');
    setAdminPassword('');
    setAdminPhone('');
  }

  return (
    <div style={styles.container}>
      {/* Unified Header */}
      <div style={commonStyles.header}>
        <div>
          <h1 style={commonStyles.title}><FiBriefcase style={{ marginRight: 10 }} /> Organization Management</h1>
          <p style={commonStyles.subtitle}>Manage departments and organizational units</p>
        </div>
        <button style={commonStyles.primaryButton} onClick={() => { resetForm(); setShowForm(!showForm); }}>
          <FiPlus style={{ marginRight: 8 }} />
          Add Organization
        </button>
      </div>

      {/* Grid Layout */}
      <div style={styles.content}>

        {/* Create/Edit Org Form (Toggleable) */}
        {showForm && (
          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <span style={styles.iconCircle}>{editingOrg ? <FiEdit /> : <FiPlus />}</span>
              <h3 style={styles.cardTitle}>{editingOrg ? "Edit Organization" : "Create New Organization"}</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }} style={styles.closeBtn} title="Close"><FiX /></button>
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

            {!editingOrg && (
              <>
                <h4 style={{ margin: '20px 0 10px 0', fontSize: '16px', color: '#1e293b' }}>Subscription Setup</h4>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Plan</label>
                    <select style={styles.input} value={plan} onChange={e => {
                      const val = e.target.value;
                      setPlan(val);
                      if (val === 'institutional') { setUsersLimit(1000); setExamsLimit(48); }
                      else if (val === 'flexi') { setUsersLimit(250); setExamsLimit(12); }
                      else { setUsersLimit(500); setExamsLimit(24); }
                    }}>
                      <option value="flexi">Flexi Plan</option>
                      <option value="institutional">Institutional Plan</option>
                      <option value="custom">Custom Plan</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Users Limit</label>
                    <input style={styles.input} type="number" value={usersLimit} onChange={e => setUsersLimit(Number(e.target.value))} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Exams Limit</label>
                    <input style={styles.input} type="number" value={examsLimit} onChange={e => setExamsLimit(Number(e.target.value))} />
                  </div>
                </div>

                <h4 style={{ margin: '20px 0 10px 0', fontSize: '16px', color: '#1e293b' }}>Primary Admin Credentials</h4>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>First Name</label>
                    <input style={styles.input} placeholder="First Name" value={adminFirstName} onChange={e => setAdminFirstName(e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Last Name</label>
                    <input style={styles.input} placeholder="Last Name" value={adminLastName} onChange={e => setAdminLastName(e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Admin Email</label>
                    <input style={styles.input} type="email" placeholder="admin@org.com" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Admin Password</label>
                    <input style={styles.input} type="password" placeholder="Min 6 characters" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={styles.label}>Phone Number</label>
                    <input style={styles.input} placeholder="Phone" value={adminPhone} onChange={e => setAdminPhone(e.target.value)} />
                  </div>
                </div>
              </>
            )}

            <div style={styles.formActions}>
              <button style={styles.cancelButton} onClick={() => setShowForm(false)}>Cancel</button>
              <button style={styles.button} onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving..." : (editingOrg ? "Update Organization" : "Create Organization")}
              </button>
            </div>
          </div>
        )}

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
/* ================= STYLES ================= */
const commonStyles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    background: '#fff',
    padding: '24px 32px',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a',
    display: 'flex',
    alignItems: 'center',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    marginTop: '4px',
    margin: 0
  },
  primaryButton: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
    transition: 'all 0.2s',
    fontSize: '14px'
  }
};

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1400px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif"
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },
  formCard: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0',
    padding: '32px',
    animation: 'slideDown 0.3s ease-out'
  },
  gridRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px'
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
    border: '1px solid #e2e8f0',
    padding: '0',
    overflow: 'hidden'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px',
    padding: '20px 24px 0'
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
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  button: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: '600',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
    fontSize: '14px'
  },
  cancelButton: {
    background: 'transparent',
    color: '#64748b',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    padding: '12px 24px',
    fontWeight: '600',
    cursor: 'pointer',
    marginRight: '12px'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: '16px'
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
  },
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
