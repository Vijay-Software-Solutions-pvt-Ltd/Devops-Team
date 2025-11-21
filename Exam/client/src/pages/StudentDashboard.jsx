// // client/src/pages/StudentDashboard.jsx
// import React, { useEffect, useState } from 'react';
// import api from '../services/api';
// import { Link } from 'react-router-dom';
// import AdminLayout from '../components/AdminLayout';

// export default function StudentDashboard() {
//   const [exams, setExams] = useState([]);
//   useEffect(()=> {
//     api.get('/exams/assigned').then(r => setExams(r.data.exams)).catch(()=>{});
//   },[]);

//   return (
//     <div style={{padding:20, maxWidth:1000, margin:'0 auto'}}>
//       <h2 style={{background:'linear-gradient(90deg,#4f46e5,#06b6d4)', WebkitBackgroundClip:'text', color:'transparent'}}>Welcome to your Exams</h2>
//       <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16, marginTop:16}}>
//         {exams.length === 0 && <div style={{gridColumn:'1/-1', padding:24, background:'#fff', borderRadius:12}}>No exams available</div>}
//         {exams.map(e=>(
//           <div key={e.id} style={{background:'linear-gradient(180deg,#ffffff,#f8fafc)', padding:16, borderRadius:12, boxShadow:'0 8px 20px rgba(0,0,0,0.06)'}}>
//             <h3>{e.title}</h3>
//             <p style={{color:'#6b7280'}}>{e.description}</p>
//             <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
//               <div style={{fontSize:12, color:'#6b7280'}}>Duration: {e.duration_minutes} mins</div>
//               <Link to={`/exams/${e.id}/details`} style={{background:'#4f46e5', color:'#fff', padding:'8px 10px', borderRadius:8}}>View</Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }






// client/src/pages/StudentDashboard.jsx

import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";

export default function StudentDashboard() {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    api
      .get("/exams/assigned")
      .then((r) => setExams(r.data.exams))
      .catch(() => {});
  }, []);

  return (
    <AdminLayout>
      <div className="px-10 py-12 max-w-6xl mx-auto">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-blue-900 mb-10">
          Welcome to your Exams
        </h2>

        {/* Cards */}
        <div>
          {/* If no exams */}
          {exams.length === 0 && (
            <div className="w-3/5 mx-auto bg-white border border-gray-200 rounded-2xl shadow-md p-8 text-center text-gray-600">
              No exams available
            </div>
          )}

          {/* Exam Cards */}
          {exams.map((e) => (
            <div
              key={e.id}
              className="w-4/5 bg-white border border-gray-200 rounded-2xl shadow-md p-8 mb-8"
            >
              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {e.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-[15px] mb-4">{e.description}</p>

              {/* Duration + Button */}
              <div className="flex justify-between items-center">
                <div className="text-gray-700 font-medium text-sm">
                  Duration : {e.duration_minutes} mins
                </div>

                <Link
                  to={`/exams/${e.id}/details`}
                  className="bg-blue-900 text-white px-6 py-2 rounded-md text-sm font-semibold hover:bg-blue-800 transition"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
