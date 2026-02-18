import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiEdit, FiPlus, FiList } from 'react-icons/fi';

export default function AdminExams() {
    const [exams, setExams] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchExams();
    }, []);

    async function fetchExams() {
        try {
            // NOTE: reusing assigned endpoint because validation for admin returns all
            const res = await api.get('/admin/exams/assigned');
            if (res.data && res.data.exams) {
                setExams(res.data.exams);
            }
        } catch (err) {
            console.error("Failed to fetch exams", err);
        }
    }

    async function deleteExam(id) {
        if (!confirm("Are you sure you want to delete this exam? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/exams/${id}`);
            setExams(exams.filter(e => e.id !== id));
        } catch (err) {
            alert("Failed to delete exam: " + (err.response?.data?.error || err.message));
        }
    }

    return (
        <div style={styles.container}>
            <div style={commonStyles.header}>
                <div>
                    <h1 style={commonStyles.title}><FiList style={{ marginRight: 10 }} /> Manage Exams</h1>
                    <p style={commonStyles.subtitle}>Create, edit, and assign exams to organizations</p>
                </div>
                <Link to="/admin/create-exam" style={commonStyles.primaryButton}>
                    <FiPlus style={{ marginRight: 6 }} /> Create New Exam
                </Link>
            </div>

            <div style={styles.card}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.theadRow}>
                            <th style={styles.th}>Title</th>
                            <th style={styles.th}>Organization</th>
                            <th style={styles.th}>Start Date</th>
                            <th style={styles.th}>Duration</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam, i) => (
                            <tr key={exam.id} style={i % 2 === 0 ? styles.trEven : styles.trOdd}>
                                <td style={styles.td}>
                                    <div style={styles.examTitle}>{exam.title}</div>
                                    <div style={styles.examDesc}>{exam.description || 'No description'}</div>
                                </td>
                                <td style={styles.td}>
                                    <div style={styles.orgNameText}>{exam.org_name || 'N/A'}</div>
                                    <div style={styles.orgIdText}>{exam.assigned_org_id || ''}</div>
                                </td>
                                <td style={styles.td}>
                                    {exam.start_date ? new Date(exam.start_date).toLocaleString() : 'N/A'}
                                </td>
                                <td style={styles.td}>{exam.duration_minutes} min</td>
                                <td style={styles.td}>
                                    <button style={styles.actionBtn} onClick={() => navigate(`/admin/edit-exam/${exam.id}`)}>
                                        <FiEdit /> Edit
                                    </button>
                                    <button style={{ ...styles.actionBtn, color: '#ef4444', marginLeft: 8 }} onClick={() => deleteExam(exam.id)}>
                                        <FiTrash2 /> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {exams.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ padding: 20, textAlign: 'center', color: '#888' }}>
                                    No exams found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

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
        padding: '12px 24px',
        borderRadius: '10px',
        textDecoration: 'none',
        fontWeight: '600',
        display: 'flex',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(37,99,235,0.2)',
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
    card: {
        background: '#fff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
        border: '1px solid #e2e8f0'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse'
    },
    theadRow: {
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0'
    },
    th: {
        padding: '16px 24px',
        textAlign: 'left',
        fontSize: '13px',
        fontWeight: '600',
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    trEven: { background: '#fff' },
    trOdd: { background: '#fcfcfc' },
    td: {
        padding: '16px 24px',
        borderBottom: '1px solid #f1f5f9',
        fontSize: '14px',
        color: '#334155',
        verticalAlign: 'middle'
    },
    examTitle: {
        fontWeight: '600',
        color: '#0f172a',
        marginBottom: '4px',
        fontSize: '15px'
    },
    examDesc: {
        fontSize: '13px',
        color: '#64748b',
        maxWidth: '350px',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    orgNameText: {
        fontSize: '14px',
        fontWeight: '600',
        color: '#334155'
    },
    orgIdText: {
        fontSize: '11px',
        fontFamily: 'monospace',
        color: '#94a3b8',
        background: '#f1f5f9',
        padding: '2px 6px',
        borderRadius: '4px',
        display: 'inline-block',
        marginTop: '4px'
    },
    actionBtn: {
        background: '#fff',
        border: '1px solid #cbd5e1',
        borderRadius: '8px',
        padding: '8px 12px',
        cursor: 'pointer',
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        transition: 'all 0.2s',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
    }
};
