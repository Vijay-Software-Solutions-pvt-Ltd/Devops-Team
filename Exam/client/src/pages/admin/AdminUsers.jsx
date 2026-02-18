// client/src/pages/AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { FiPlus, FiSearch, FiTrash2, FiCheckCircle, FiXCircle, FiUser, FiUsers, FiEdit, FiX, FiMoreVertical } from "react-icons/fi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // New User Form State
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    org_id: '',
    role: 'student', // default
    password: '' // optional, auto-generated if empty in backend, but good to have
  });
  const [editingUser, setEditingUser] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null); // Track which user's dropdown is open

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredUsers(users);
    } else {
      const lower = search.toLowerCase();
      setFilteredUsers(users.filter(u =>
        (u.name && u.name.toLowerCase().includes(lower)) ||
        (u.email && u.email.toLowerCase().includes(lower)) ||
        (u.org_id && u.org_id.toLowerCase().includes(lower))
      ));
    }
  }, [search, users]);

  async function fetchUsers() {
    try {
      const r = await api.get('/admin/users');
      setUsers(r.data.users || []);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit() {
    if (!newUser.email) return alert("Email is required");
    try {
      if (editingUser) {
        // Update
        const response = await api.put(`/admin/users/${editingUser.id}`, {
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          org_id: newUser.org_id
        });
        // Update with actual data from backend
        if (response.data.user) {
          setUsers(prev => prev.map(u => u.id === editingUser.id ? response.data.user : u));
        }
        alert('User updated successfully');
      } else {
        // Create
        const payload = {
          users: [{
            name: newUser.name,
            email: newUser.email,
            role: newUser.role
          }],
          org_id: newUser.org_id
        };
        await api.post('/admin/users/bulk-create', payload);
        alert('User created successfully');
        fetchUsers();
      }
      resetForm();
    } catch (err) {
      alert('Failed to save user');
      console.error(err);
    }
  }

  function handleEdit(user) {
    setEditingUser(user);
    setNewUser({
      name: user.name || '',
      email: user.email || '',
      org_id: user.org_id || '',
      role: user.role || 'student',
      password: ''
    });
    setShowAddForm(true);
  }

  function resetForm() {
    setShowAddForm(false);
    setEditingUser(null);
    setNewUser({ name: '', email: '', org_id: '', role: 'student', password: '' });
  }

  async function toggleActive(userId, currentStatus) {
    try {
      const response = await api.post(`/admin/users/${userId}/activate`, { active: !currentStatus });
      // Update with actual data from backend
      if (response.data.user) {
        setUsers(prev => prev.map(u => u.id === userId ? response.data.user : u));
      } else {
        // Fallback to optimistic update if backend doesn't return user
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: !currentStatus } : u));
      }
    } catch (err) {
      alert("Failed to update status");
      console.error(err);
    }
  }

  async function hardDelete(userId) {
    if (!confirm("Are you sure you want to PERMANENTLY delete this user? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/users/${userId}/hard-delete`);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      alert("Failed to delete user: " + (err.response?.data?.error || err.message));
    }
  }

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={commonStyles.header}>
        <div>
          <h1 style={commonStyles.title}><FiUsers style={{ marginRight: 10 }} /> User Management</h1>
          <p style={commonStyles.subtitle}>View, manage, and create platform users</p>
        </div>
        <button style={commonStyles.primaryButton} onClick={() => { resetForm(); setShowAddForm(!showAddForm); }}>
          <FiPlus style={{ marginRight: 8 }} />
          Add User
        </button>
      </div>

      {/* Add User Form (Collapsible) */}
      {showAddForm && (
        <div style={styles.formCard}>
          <div style={styles.cardHeader}>
            <h3 style={styles.formTitle}>{editingUser ? "Edit User" : "Add New User"}</h3>
            <button onClick={resetForm} style={styles.closeBtn}><FiX /></button>
          </div>
          <div style={styles.formGrid}>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Name</label>
              <input
                style={styles.input}
                placeholder="John Doe"
                value={newUser.name}
                onChange={e => setNewUser({ ...newUser, name: e.target.value })}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email *</label>
              <input
                style={styles.input}
                placeholder="john@example.com"
                value={newUser.email}
                onChange={e => setNewUser({ ...newUser, email: e.target.value })}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Organization ID</label>
              <input
                style={styles.input}
                placeholder="Optional Org ID"
                value={newUser.org_id}
                onChange={e => setNewUser({ ...newUser, org_id: e.target.value })}
              />
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Role</label>
              <select
                style={styles.select}
                value={newUser.role}
                onChange={e => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div style={styles.formActions}>
            <button style={styles.cancelButton} onClick={resetForm}>Cancel</button>
            <button style={styles.submitButton} onClick={handleSubmit}>{editingUser ? "Update User" : "Create User"}</button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.searchBox}>
          <FiSearch style={{ color: '#94a3b8', marginRight: 10 }} />
          <input
            style={styles.searchInput}
            placeholder="Search by name, email, or org..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div style={styles.stats}>
          Total Users: <strong>{users.length}</strong>
        </div>
      </div>

      {/* Table */}
      <div style={styles.tableCard}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Organization</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((u, i) => (
              <tr key={u.id} style={i % 2 !== 0 ? styles.trAlt : {}}>
                <td style={styles.td}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={styles.avatar}>
                      <FiUser />
                    </div>
                    <div>
                      <div style={styles.userName}>{u.name || 'No Name'}</div>
                      <div style={styles.userEmail}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={u.role === 'admin' ? styles.adminBadge : styles.studentBadge}>
                    {u.role}
                  </span>
                </td>
                <td style={styles.td}>
                  {u.org_id ? (
                    <div>
                      <div style={styles.orgName}>{u.org_name || 'Unknown Org'}</div>
                      <code style={styles.code}>{u.org_id}</code>
                    </div>
                  ) : <span style={{ color: '#cbd5e1' }}>-</span>}
                </td>
                <td style={styles.td}>
                  <span style={u.is_active ? styles.statusActive : styles.statusInactive}>
                    {u.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td style={styles.td}>
                  <div style={{ position: 'relative' }}>
                    <button
                      style={styles.actionBtn}
                      onClick={() => setOpenDropdownId(openDropdownId === u.id ? null : u.id)}
                    >
                      <FiMoreVertical />
                    </button>
                    {openDropdownId === u.id && (
                      <div style={styles.dropdownMenu}>
                        <div
                          style={styles.dropdownItem}
                          onClick={() => {
                            setOpenDropdownId(null);
                            handleEdit(u);
                          }}
                        >
                          <FiEdit style={{ marginRight: 8 }} /> Edit
                        </div>
                        <div
                          style={styles.dropdownItem}
                          onClick={() => {
                            setOpenDropdownId(null);
                            toggleActive(u.id, u.is_active);
                          }}
                        >
                          {u.is_active ? <FiXCircle style={{ marginRight: 8, color: '#ef4444' }} /> : <FiCheckCircle style={{ marginRight: 8, color: '#16a34a' }} />}
                          {u.is_active ? 'Deactivate' : 'Activate'}
                        </div>
                        <div
                          style={{ ...styles.dropdownItem, color: '#ef4444' }}
                          onClick={() => {
                            setOpenDropdownId(null);
                            hardDelete(u.id);
                          }}
                        >
                          <FiTrash2 style={{ marginRight: 8 }} /> Delete
                        </div>
                      </div>
                    )}
                    {/* Overlay to close dropdown when clicking outside */}
                    {openDropdownId === u.id && (
                      <div
                        style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 998 }}
                        onClick={() => setOpenDropdownId(null)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="5" style={styles.empty}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    width: '100%',
    fontFamily: "'Inter', sans-serif"
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
    position: 'sticky',
    top: '50px', // Adjusted to sit below the fixed global header
    zIndex: 9, // Lower than global header (10)
    background: '#f8fafc',
    paddingTop: '20px',
    paddingBottom: '20px',
    marginTop: '-20px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '4px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b'
  },
  addButton: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '8px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 6px rgba(37,99,235,0.2)',
    transition: 'all 0.2s'
  },
  formCard: {
    background: '#fff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid #e2e8f0'
  },
  formTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    color: '#334155'
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#64748b'
  },
  input: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none'
  },
  select: {
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    outline: 'none',
    background: '#fff'
  },
  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px'
  },
  cancelButton: {
    background: 'transparent',
    border: '1px solid #cbd5e1',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#64748b'
  },
  submitButton: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '500'
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    width: '300px'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    width: '100%',
    fontSize: '14px',
    color: '#334155'
  },
  stats: {
    fontSize: '13px',
    color: '#64748b'
  },
  tableCard: {
    background: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
    border: '1px solid #e2e8f0',
    overflow: 'hidden'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  th: {
    textAlign: 'left',
    padding: '16px',
    background: '#f8fafc',
    color: '#64748b',
    fontWeight: '600',
    borderBottom: '1px solid #e2e8f0'
  },
  td: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    color: '#334155'
  },
  trAlt: {
    background: '#fcfcfc'
  },
  empty: {
    padding: '32px',
    textAlign: 'center',
    color: '#94a3b8'
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: '#e0e7ff',
    color: '#4338ca',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px'
  },
  userName: {
    fontWeight: '600',
    color: '#1e293b'
  },
  userEmail: {
    fontSize: '12px',
    color: '#64748b'
  },
  code: {
    background: '#f1f5f9',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    fontSize: '12px',
    color: '#475569'
  },
  orgName: {
    fontWeight: '600',
    fontSize: '13px',
    color: '#1e293b',
    marginBottom: '4px'
  },
  studentBadge: {
    background: '#f0f9ff',
    color: '#0369a1',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  adminBadge: {
    background: '#fdf4ff',
    color: '#86198f',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500'
  },
  statusActive: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#16a34a',
    fontWeight: '500',
    fontSize: '13px'
  },
  statusInactive: {
    display: 'inline-flex',
    alignItems: 'center',
    color: '#ef4444',
    fontWeight: '500',
    fontSize: '13px'
  },
  activateBtn: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#16a34a',
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center'
  },
  deactivateBtn: {
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#ef4444',
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center'
  },
  deleteBtn: {
    background: '#fee2e2',
    border: '1px solid #fecaca',
    color: '#991b1b',
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
  },
  editBtn: {
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
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px'
  },
  actionBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    transition: 'background 0.2s',
    ':hover': {
      background: '#f1f5f9'
    }
  },
  dropdownMenu: {
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: '4px',
    background: '#fff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    zIndex: 999,
    minWidth: '160px',
    overflow: 'hidden'
  },
  dropdownItem: {
    padding: '10px 16px',
    fontSize: '14px',
    color: '#334155',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.1s',
    ':hover': {
      background: '#f8fafc'
    }
  },
  closeBtn: {
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    color: '#94a3b8'
  }
};
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


