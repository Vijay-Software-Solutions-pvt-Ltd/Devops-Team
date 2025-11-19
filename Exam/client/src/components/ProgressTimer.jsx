// client/src/components/ProgressTimer.jsx
import React from 'react';

export default function ProgressTimer({ remaining, total }) {
  const pct = total > 0 ? Math.max(0, Math.min(100, Math.round((remaining / total) * 100))) : 0;
  return (
    <div style={{width:'100%'}}>
      <div style={{height:10, background:'#e6e6e6', borderRadius:6, overflow:'hidden'}}>
        <div style={{width:`${pct}%`, height:'100%', background:'linear-gradient(90deg,#4f46e5,#06b6d4)'}} />
      </div>
      <div style={{marginTop:6, fontSize:12, color:'#6b7280'}}>{String(Math.floor(remaining/60)).padStart(2,'0')}:{String(remaining%60).padStart(2,'0')} remaining</div>
    </div>
  );
}
