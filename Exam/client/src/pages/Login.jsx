// client/src/pages/Login.jsx
import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      // store user object for client-side RBAC
      localStorage.setItem('user', JSON.stringify(res.data.user || {}));

      // redirect based on role
      const role = res.data.user?.role || 'user';
      if (role === 'admin') {
        nav('/admin');
      } else {
        nav('/');
      }
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Login failed');
    }
  }

  return (
    <div className="card" style={{maxWidth:400, margin:'40px auto'}}>
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
