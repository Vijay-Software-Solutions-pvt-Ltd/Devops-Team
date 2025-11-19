// client/src/pages/AdminOrgs.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import AdminNavbar from '../components/AdminNavbar';
import AdminLayout from '../components/AdminLayout';

export default function AdminOrgs() {
  const [orgs, setOrgs] = useState([]);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(()=> {
    api.get('/orgs').then(r => setOrgs(r.data.orgs)).catch(()=>{});
  },[]);

  async function createOrg() {
    const r = await api.post('/orgs', { name, address });
    alert('Org created: ' + r.data.org_id);
    setName(''); setAddress('');
    const q = await api.get('/orgs'); setOrgs(q.data.orgs);
  }

  return (
    <AdminLayout>
     <AdminNavbar>
    
    <div>
      <h3>Organizations</h3>
      <div>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Address" value={address} onChange={e=>setAddress(e.target.value)} />
        <button onClick={createOrg}>Create Org</button>
      </div>

      <ul>
        {orgs.map(o => <li key={o.id}>{o.name} - {o.address} (ID: {o.id})</li>)}
      </ul>
    </div>
 </AdminNavbar >
 </AdminLayout>
  );
}
