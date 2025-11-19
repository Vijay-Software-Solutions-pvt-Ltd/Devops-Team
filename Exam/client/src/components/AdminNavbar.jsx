import { Link, useNavigate } from 'react-router-dom';

export default function AdminNavbar() {
  const nav = useNavigate();

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    nav('/login');
  }

  return (
    <div style={{
      background:'#222', color:'#fff', padding:'10px', display:'flex',
      gap:'20px', alignItems:'center'
    }}>
      <Link to="/admin/orgs" style={{color:'white'}}>Organizations</Link>
      <Link to="/admin/users" style={{color:'white'}}>Users</Link>
      <Link to="/admin/create-exam" style={{color:'white'}}>Create Exam</Link>
      <button onClick={logout} style={{marginLeft:'auto'}}>Logout</button>
    </div>
  );
}
