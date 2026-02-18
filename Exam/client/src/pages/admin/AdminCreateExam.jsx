import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiPlus, FiTrash2, FiClock, FiCalendar, FiLayers, FiType, FiCode, FiUpload } from 'react-icons/fi';

export default function AdminCreateExam() {
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
    api.get('/admin/orgs')
      .then(res => {
        if (res.data && res.data.orgs) {
          setOrgs(res.data.orgs);
        }
      })
      .catch(err => console.error("Failed to fetch orgs", err));
  }, []);

  function addQuestion(type) {
    setQuestions(prev => [
      ...prev,
      {
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

  function handleJsonImport(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result);
        if (Array.isArray(json)) {
          // Expecting basic format: [{ type, content: { prompt }, ... }]
          // Ideally validate further. For now, trust nice JSON.
          // We map to our internal structure just in case
          const newQs = json.map(q => ({
            type: q.type || 'mcq',
            difficulty: q.difficulty || 'normal',
            content: q.content || { prompt: '' },
            choices: q.choices || (q.type === 'mcq' ? ['', '', '', ''] : null),
            correct_answer: q.correct_answer || (q.type === 'mcq' ? { correct: 0 } : null),
            points: q.points || 2
          }));
          setQuestions(prev => [...prev, ...newQs]);
          alert(`Successfully imported ${newQs.length} questions!`);
        } else {
          alert("Invalid JSON format. Expected an array of questions.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
        console.error(err);
      }
    };
    reader.readAsText(file);
  }

  async function createExam() {
    if (!exam.title || !exam.org_id) return alert("Title and Org ID are required");

    // Convert Local datetime-local string back to UTC ISO string for server
    const toUTC = (localStr) => {
      if (!localStr) return null;
      return new Date(localStr).toISOString();
    };

    try {
      await api.post('/admin/exams/create', {
        ...exam,
        start_date: toUTC(exam.start_date),
        end_date: toUTC(exam.end_date),
        duration_minutes: exam.duration,
        questions
      });
      alert('Exam created successfully!');
      setExam({ title: '', description: '', duration: 60, start_date: '', end_date: '', org_id: '' });
      setQuestions([]);
    } catch (err) {
      console.error(err);
      alert('Failed to create exam');
    }
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Create New Exam</h1>

      <div style={styles.grid}>

        {/* LEFT COLUMN: EXAM DETAILS */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}> <FiLayers style={{ marginRight: 8 }} /> Exam Details</h3>

          <div style={styles.formGroup}>
            <label style={styles.label}>Exam Title</label>
            <input
              style={styles.input}
              placeholder="e.g. Final Assessment 2024"
              value={exam.title}
              onChange={e => setExam({ ...exam, title: e.target.value })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Description</label>
            <textarea
              style={{ ...styles.input, height: '80px', resize: 'vertical' }}
              placeholder="Brief description..."
              value={exam.description}
              onChange={e => setExam({ ...exam, description: e.target.value })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Organization</label>
            <select
              style={styles.select}
              value={exam.org_id}
              onChange={e => setExam({ ...exam, org_id: e.target.value })}
            >
              <option value="">Select Organization</option>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3 style={{ ...styles.cardTitle, marginBottom: 0 }}>Questions ({questions.length})</h3>
              {/* Hidden File Input */}
              <input
                type="file"
                id="import-json"
                style={{ display: 'none' }}
                accept=".json"
                onChange={handleJsonImport}
              />
              <button
                style={styles.importBtn}
                onClick={() => document.getElementById('import-json').click()}
                title="Import Questions from JSON"
              >
                <FiUpload style={{ marginRight: 6 }} /> Import JSON
              </button>
            </div>
            <div style={styles.btnGroup}>
              <button style={styles.addBtn} onClick={() => addQuestion('mcq')}>+ MCQ</button>
              <button style={styles.addBtn} onClick={() => addQuestion('coding')}>+ Coding</button>
              {questions.length > 0 && (
                <button style={styles.publishBtn} onClick={createExam}>
                  <FiPlus style={{ marginRight: 6 }} /> Publish Exam
                </button>
              )}
            </div>
          </div>

          {questions.length === 0 && (
            <div style={styles.emptyState}>
              No questions added yet. Click above to add one.
            </div>
          )}

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
                  placeholder="Enter the question here..."
                />
              </div>

              <div style={styles.row}>
                <div style={styles.col}>
                  <label style={styles.label}>Points</label>
                  <input
                    type="number" style={styles.input}
                    value={q.points}
                    onChange={e => updateQuestion(i, 'points', Number(e.target.value))}
                  />
                </div>
                <div style={styles.col}>
                  <label style={styles.label}>Difficulty</label>
                  <select
                    style={styles.select}
                    value={q.difficulty}
                    onChange={e => updateQuestion(i, 'difficulty', e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="normal">Normal</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {q.type === 'mcq' && (
                <div style={{ marginTop: 12 }}>
                  <label style={styles.label}>Choices (Select correct index via radio)</label>
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
                        placeholder={`Option ${idx + 1}`}
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
    transition: 'border-color 0.2s',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box'
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
    cursor: 'pointer',
    transition: 'all 0.2s'
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
    color: '#475569',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  deleteBtn: {
    background: 'transparent',
    border: 'none',
    color: '#ef4444',
    cursor: 'pointer',
    padding: '4px'
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
    boxShadow: '0 4px 12px rgba(37,99,235,0.2)'
  },
  emptyState: {
    background: '#f8fafc',
    padding: '32px',
    borderRadius: '12px',
    border: '2px dashed #cbd5e1',
    textAlign: 'center',
    color: '#94a3b8'
  },
  importBtn: {
    background: '#f1f5f9',
    border: '1px solid #cbd5e1',
    color: '#475569',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'all 0.2s',
  }
};
