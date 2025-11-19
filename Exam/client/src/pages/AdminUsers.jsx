// client/src/pages/AdminUsers.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [bulk, setBulk] = useState([{name:'', email:''}]);
  const [orgId, setOrgId] = useState('');

  useEffect(()=> {
    api.get('/admin/users').then(r => setUsers(r.data.users)).catch(()=>{});
  },[]);

  function addRow(){ setBulk(prev=>[...prev, {name:'', email:''}]); }
  function updateRow(i, field, val){ const arr=[...bulk]; arr[i][field]=val; setBulk(arr); }

  async function bulkCreate(){
    const r = await api.post('/admin/users/bulk-create', { users: bulk, org_id: orgId });
    alert('Created: ' + r.data.created.length);
  }

  async function toggleActive(userId, active) {
    await api.post(`/admin/users/${userId}/activate`, { active });
    const q = await api.get('/admin/users'); setUsers(q.data.users);
  }

  return (
     <AdminLayout>
         <AdminNavbar>

    <div>
      <h3>Admin - Users</h3>
      <div>
        <input placeholder="Org ID" value={orgId} onChange={e=>setOrgId(e.target.value)} />
        {bulk.map((b, i) => (
          <div key={i}>
            <input placeholder="Name" value={b.name} onChange={e=>updateRow(i,'name',e.target.value)} />
            <input placeholder="Email" value={b.email} onChange={e=>updateRow(i,'email',e.target.value)} />
          </div>
        ))}
        <button onClick={addRow}>Add Row</button>
        <button onClick={bulkCreate}>Create Users</button>
      </div>

      <h4>Existing users</h4>
      <table>
        <thead><tr><th>Email</th><th>Name</th><th>Org</th><th>Active</th><th>Action</th></tr></thead>
        <tbody>
          {users.map(u=>(
            <tr key={u.id}>
              <td>{u.email}</td><td>{u.name}</td><td>{u.org_id || '-'}</td>
              <td>{u.is_active ? 'Yes' : 'No'}</td>
              <td>
                <button onClick={()=>toggleActive(u.id, !u.is_active)}>{u.is_active ? 'Deactivate' : 'Activate'}</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
</AdminNavbar >
 </AdminLayout>
  );
}
