// client/src/pages/AttemptView.jsx
import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useParams } from 'react-router-dom';
import StudentHeader from "../components/StudentHeader";
import { FiUser, FiCode, FiActivity, FiCamera, FiBarChart2 } from "react-icons/fi";

export default function AttemptView() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get(`/admin/attempts/${id}`).then(r => setData(r.data)).catch(e => console.error(e));
  }, [id]);

  if (!data) return <div style={styles.loading}>Loading attempt data...</div>;

  const { attempt, answers, logs, snapshots } = data;

  return (
    <>
      <StudentHeader />
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Attempt Analysis</h1>
          <p style={styles.subtitle}>Detailed review of exam session {id}</p>
        </div>

        {/* Summary Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.iconBox}><FiBarChart2 /></span>
            <h3 style={styles.cardTitle}>Performance Summary</h3>
          </div>
          <div style={styles.statGrid}>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Total Score</span>
              <span style={styles.statValue}>{attempt.total_score || 0}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>User ID</span>
              <span style={styles.statValueSm}>{attempt.user_id}</span>
            </div>
            <div style={styles.statItem}>
              <span style={styles.statLabel}>Status</span>
              <span style={{ ...styles.badge, background: attempt.status === 'submitted' ? '#dcfce7' : '#fee2e2', color: attempt.status === 'submitted' ? '#166534' : '#991b1b' }}>
                {attempt.status || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.row}>

          {/* Logs Timeline */}
          <div style={{ ...styles.card, flex: 1 }}>
            <div style={styles.cardHeader}>
              <span style={{ ...styles.iconBox, background: '#fef3c7', color: '#d97706' }}><FiActivity /></span>
              <h3 style={styles.cardTitle}>Activity Log</h3>
            </div>
            <div style={styles.logList}>
              {logs.length === 0 ? <p style={styles.empty}>No logs recorded.</p> :
                logs.map(l => (
                  <div key={l.id} style={styles.logItem}>
                    <div style={styles.logTime}>{new Date(l.event_ts).toLocaleTimeString()}</div>
                    <div style={styles.logContent}>
                      <div style={styles.logType}>{l.event_type}</div>
                      <div style={styles.logMeta}>{JSON.stringify(l.meta)}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>

          {/* Snapshots */}
          <div style={{ ...styles.card, flex: 1 }}>
            <div style={styles.cardHeader}>
              <span style={{ ...styles.iconBox, background: '#e0e7ff', color: '#4338ca' }}><FiCamera /></span>
              <h3 style={styles.cardTitle}>Snapshots ({snapshots.length})</h3>
            </div>
            <div style={styles.snapGrid}>
              {snapshots.map(s => (
                <div key={s.id} style={styles.snapItem}>
                  <div style={styles.snapPlaceholder}>
                    <FiUser size={24} color="#cbd5e1" />
                  </div>
                  <div style={styles.snapMeta}>
                    {new Date(s.captured_at).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              {snapshots.length === 0 && <p style={styles.empty}>No snapshots captured.</p>}
            </div>
          </div>

        </div>

        {/* Answers Dump */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={{ ...styles.iconBox, background: '#f3f4f6', color: '#1f2937' }}><FiCode /></span>
            <h3 style={styles.cardTitle}>Submitted Answers</h3>
          </div>
          <div style={styles.codeBlock}>
            {JSON.stringify(answers, null, 2)}
          </div>
        </div>

      </div>
    </>
  );
}

const styles = {
  container: {
    padding: '32px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Inter', sans-serif",
    background: '#f8fafc',
    minHeight: '100vh'
  },
  loading: {
    padding: '40px',
    textAlign: 'center',
    fontSize: '18px',
    color: '#64748b'
  },
  header: {
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b'
  },
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginBottom: '24px',
    border: '1px solid #e2e8f0'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    gap: '12px'
  },
  iconBox: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    background: '#dbeafe',
    color: '#1e40af',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#1e293b',
    margin: 0
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '24px'
  },
  statItem: {
    display: 'flex',
    flexDirection: 'column'
  },
  statLabel: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#64748b',
    marginBottom: '4px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#0f172a'
  },
  statValueSm: {
    fontSize: '16px',
    fontWeight: '500',
    color: '#334155',
    fontFamily: 'monospace'
  },
  badge: {
    alignSelf: 'flex-start',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600'
  },
  row: {
    display: 'flex',
    gap: '24px',
    flexWrap: 'wrap'
  },
  logList: {
    maxHeight: '400px',
    overflowY: 'auto'
  },
  logItem: {
    display: 'flex',
    gap: '12px',
    marginBottom: '12px',
    fontSize: '14px',
    borderLeft: '2px solid #e2e8f0',
    paddingLeft: '12px',
    paddingBottom: '12px'
  },
  logTime: {
    minWidth: '70px',
    fontSize: '12px',
    color: '#94a3b8',
    fontWeight: '500'
  },
  logContent: {
    flex: 1
  },
  logType: {
    fontWeight: '600',
    color: '#334155',
    marginBottom: '2px'
  },
  logMeta: {
    fontSize: '12px',
    color: '#64748b',
    background: '#f1f5f9',
    padding: '4px',
    borderRadius: '4px',
    wordBreak: 'break-all'
  },
  snapGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
    gap: '12px'
  },
  snapItem: {
    background: '#f8fafc',
    borderRadius: '8px',
    padding: '8px',
    border: '1px solid #e2e8f0'
  },
  snapPlaceholder: {
    width: '100%',
    height: '60px',
    background: '#e2e8f0',
    borderRadius: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '8px'
  },
  snapMeta: {
    fontSize: '11px',
    color: '#64748b',
    textAlign: 'center'
  },
  codeBlock: {
    background: '#1e293b',
    color: '#f1f5f9',
    padding: '16px',
    borderRadius: '8px',
    fontFamily: 'monospace',
    fontSize: '13px',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap'
  },
  empty: {
    color: '#cbd5e1',
    fontStyle: 'italic',
    fontSize: '14px'
  }
};
