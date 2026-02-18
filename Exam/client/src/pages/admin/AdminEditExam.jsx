import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';
import { FiSave, FiTrash2, FiClock, FiCalendar, FiLayers, FiType, FiCode, FiUpload } from 'react-icons/fi';

export default function AdminEditExam() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [exam, setExam] = useState({
        title: '',
        description: '',
        duration: 60,
        start_date: '',
        end_date: '',
        org_id: ''
    });

    const [questions, setQuestions] = useState([]);
    const [orgs, setOrgs] = useState([]);

    useEffect(() => {
        loadExamData();
    }, [id, navigate]);

    async function loadExamData() {
        setLoading(true);
        try {
            // Fetch Orgs & Exam Data
            const [orgRes, examRes] = await Promise.all([
                api.get('/admin/orgs'),
                api.get(`/admin/exams/${id}`)
            ]);

            if (orgRes.data?.orgs) setOrgs(orgRes.data.orgs);

            const eData = examRes.data.exam;
            const qData = examRes.data.questions;

            // Format UTC date to Local datetime-local string (YYYY-MM-DDTHH:mm)
            const formatDT = (isoStr) => {
                if (!isoStr) return '';
                const d = new Date(isoStr);
                // Get local ISO string by shifting time with timezone offset
                const local = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
                return local.toISOString().slice(0, 16);
            };

            setExam({
                title: eData.title,
                description: eData.description || '',
                duration: eData.duration_minutes,
                start_date: formatDT(eData.start_date),
                end_date: formatDT(eData.end_date),
                org_id: ''
            });

            // Parse question content if it's JSON string (it comes as object from pg usually if jsonb, but let's be safe)
            setQuestions(qData.map(q => ({
                ...q,
                content: typeof q.content === 'string' ? JSON.parse(q.content) : q.content,
                choices: typeof q.choices === 'string' ? JSON.parse(q.choices) : (q.choices || []),
                correct_answer: typeof q.correct_answer === 'string' ? JSON.parse(q.correct_answer) : (q.correct_answer || { correct: 0 })
            })));
            setLoading(false);
        } catch (err) {
            console.error(err);
            alert("Failed to load exam data");
            navigate('/admin/exams');
        }
    }

    function addQuestion(type) {
        setQuestions(prev => [
            ...prev,
            {
                // No ID means new
                type,
                difficulty: type === 'coding' ? 'hard' : 'normal',
                content: { prompt: '' },
                choices: type === 'mcq' ? ['', '', '', ''] : null,
                correct_answer: type === 'mcq' ? { correct: 0 } : null,
                points: type === 'coding' ? 10 : 2
            }
        ]);
    }

    function removeQuestion(index) {
        setQuestions(prev => prev.filter((_, i) => i !== index));
    }

    function updateQuestion(index, field, value) {
        const arr = [...questions];
        if (field === 'prompt') arr[index].content.prompt = value;
        else arr[index][field] = value;
        setQuestions(arr);
    }

    function updateChoice(qIndex, cIndex, value) {
        const arr = [...questions];
        arr[qIndex].choices[cIndex] = value;
        setQuestions(arr);
    }

    // Bulk Upload Handler
    function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (evt) => {
            try {
                const json = JSON.parse(evt.target.result);
                if (Array.isArray(json)) {
                    // Validate basic structure if needed
                    const newQs = json.map(q => ({
                        id: undefined, // ensure new IDs are generated
                        type: q.type || 'mcq',
                        difficulty: q.difficulty || 'normal',
                        content: q.content || { prompt: 'Imported Question' },
                        choices: q.choices || [],
                        correct_answer: q.correct_answer || { correct: 0 },
                        points: q.points || 1
                    }));
                    setQuestions(prev => [...prev, ...newQs]);
                    alert(`Imported ${newQs.length} questions!`);
                } else {
                    alert("JSON file must be an array of questions.");
                }
            } catch (err) {
                alert("Invalid JSON file");
            }
        };
        reader.readAsText(file);
    }

    async function saveExam() {
        if (!exam.title) return alert("Title required");

        // Convert Local datetime-local string back to UTC ISO string for server
        const toUTC = (localStr) => {
            if (!localStr) return null;
            return new Date(localStr).toISOString();
        };

        try {
            await api.put(`/admin/exams/${id}`, {
                ...exam,
                start_date: toUTC(exam.start_date),
                end_date: toUTC(exam.end_date),
                duration_minutes: exam.duration,
                questions
            });
            alert('Exam updated successfully!');
            // Reload exam data to show updated values
            await loadExamData();
        } catch (err) {
            console.error(err);
            alert('Failed to update exam');
        }
    }

    if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Edit Exam: {exam.title}</h1>

            <div style={styles.grid}>

                {/* LEFT COLUMN: EXAM DETAILS */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}> <FiLayers style={{ marginRight: 8 }} /> Exam Details</h3>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Exam Title</label>
                        <input
                            style={styles.input}
                            value={exam.title}
                            onChange={e => setExam({ ...exam, title: e.target.value })}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}>Description</label>
                        <textarea
                            style={{ ...styles.input, height: '80px', resize: 'vertical' }}
                            value={exam.description}
                            onChange={e => setExam({ ...exam, description: e.target.value })}
                        />
                    </div>

                    {/* Org Selection is tricky on Edit if we don't know current org. 
              We can allow re-assigning, but ideally we should fetch current assignment.
              For now, adding a note.
           */}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Organization (Re-assign)</label>
                        <select
                            style={styles.select}
                            value={exam.org_id}
                            onChange={e => setExam({ ...exam, org_id: e.target.value })}
                        >
                            <option value="">Keep current (or select to change)</option>
                            {orgs.map(org => (
                                <option key={org.id} value={org.id}>{org.name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.col}>
                            <label style={styles.label}><FiClock /> Duration (min)</label>
                            <input
                                type="number" style={styles.input}
                                value={exam.duration}
                                onChange={e => setExam({ ...exam, duration: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}><FiCalendar /> Start Date</label>
                        <input
                            type="datetime-local" style={styles.input}
                            value={exam.start_date}
                            onChange={e => setExam({ ...exam, start_date: e.target.value })}
                        />
                    </div>

                    <div style={styles.formGroup}>
                        <label style={styles.label}><FiCalendar /> End Date</label>
                        <input
                            type="datetime-local" style={styles.input}
                            value={exam.end_date}
                            onChange={e => setExam({ ...exam, end_date: e.target.value })}
                        />
                    </div>
                </div>

                {/* RIGHT COLUMN: QUESTIONS */}
                <div>
                    <div style={styles.questionsHeader}>
                        <h3 style={{ ...styles.cardTitle, marginBottom: 0 }}>Questions ({questions.length})</h3>
                        <div style={styles.btnGroup}>
                            <label style={styles.uploadBtn}>
                                <FiUpload style={{ marginRight: 6 }} /> Import JSON
                                <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
                            </label>
                            <button style={styles.addBtn} onClick={() => addQuestion('mcq')}>+ MCQ</button>
                            <button style={styles.addBtn} onClick={() => addQuestion('coding')}>+ Coding</button>
                            <button style={styles.publishBtn} onClick={saveExam}>
                                <FiSave style={{ marginRight: 8 }} /> Save Changes
                            </button>
                        </div>
                    </div>

                    {questions.map((q, i) => (
                        <div key={i} style={styles.questionCard}>
                            <div style={styles.qHeader}>
                                <span style={styles.qTypeBadge}>
                                    {q.type === 'mcq' ? <FiType /> : <FiCode />} {q.type.toUpperCase()}
                                </span>
                                <button style={styles.deleteBtn} onClick={() => removeQuestion(i)}>
                                    <FiTrash2 />
                                </button>
                            </div>

                            <div style={styles.formGroup}>
                                <label style={styles.label}>Prompt / Question</label>
                                <textarea
                                    style={{ ...styles.input, height: '60px' }}
                                    value={q.content.prompt}
                                    onChange={e => updateQuestion(i, 'prompt', e.target.value)}
                                />
                            </div>

                            {/* ... Same choices logic as create ... */}
                            {q.type === 'mcq' && (
                                <div style={{ marginTop: 12 }}>
                                    <label style={styles.label}>Choices</label>
                                    {q.choices.map((c, idx) => (
                                        <div key={idx} style={styles.choiceRow}>
                                            <input
                                                type="radio"
                                                name={`correct-${i}`}
                                                checked={q.correct_answer.correct === idx}
                                                onChange={() => {
                                                    const arr = [...questions];
                                                    arr[i].correct_answer.correct = idx;
                                                    setQuestions(arr);
                                                }}
                                            />
                                            <input
                                                style={styles.choiceInput}
                                                value={c}
                                                onChange={e => updateChoice(i, idx, e.target.value)}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        padding: '32px',
        maxWidth: '1200px',
        margin: '0 auto',
        fontFamily: "'Inter', sans-serif"
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1e293b',
        marginBottom: '32px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: '350px 1fr',
        gap: '32px',
        alignItems: 'start'
    },
    card: {
        background: '#fff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
        border: '1px solid #e2e8f0'
    },
    cardTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '20px',
        color: '#334155',
        display: 'flex',
        alignItems: 'center'
    },
    formGroup: {
        marginBottom: '16px'
    },
    label: {
        display: 'block',
        fontSize: '13px',
        fontWeight: '500',
        color: '#64748b',
        marginBottom: '6px'
    },
    input: {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box'
    },
    select: {
        width: '100%',
        padding: '10px 12px',
        borderRadius: '8px',
        border: '1px solid #cbd5e1',
        background: '#fff'
    },
    row: {
        display: 'flex',
        gap: '12px'
    },
    col: {
        flex: 1
    },
    questionsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
    },
    btnGroup: {
        display: 'flex',
        gap: '8px'
    },
    addBtn: {
        background: '#fff',
        border: '1px solid #cbd5e1',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#475569',
        cursor: 'pointer'
    },
    uploadBtn: {
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        padding: '8px 16px',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        color: '#166534',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center'
    },
    questionCard: {
        background: '#fff',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '16px',
        border: '1px solid #e2e8f0',
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
    },
    qHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '16px'
    },
    qTypeBadge: {
        background: '#f1f5f9',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600',
        color: '#475569'
    },
    deleteBtn: {
        background: 'transparent',
        border: 'none',
        color: '#ef4444',
        cursor: 'pointer'
    },
    choiceRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px'
    },
    choiceInput: {
        flex: 1,
        padding: '8px 12px',
        borderRadius: '6px',
        border: '1px solid #e2e8f0',
        fontSize: '14px'
    },
    publishBtn: {
        width: '100%',
        padding: '14px',
        background: '#2563eb',
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontWeight: '600',
        fontSize: '16px',
        cursor: 'pointer',
        marginTop: '16px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
    }
};
