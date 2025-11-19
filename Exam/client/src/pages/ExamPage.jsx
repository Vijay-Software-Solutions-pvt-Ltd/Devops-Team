// client/src/pages/ExamPage.jsx
import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressTimer from '../components/ProgressTimer';

function stripDataUrl(dataUrl) { return dataUrl.split(',')[1]; }

export default function ExamPage() {
  const { id } = useParams(); // exam id
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState(null); // initially null -> not loaded until start
  const [attempt, setAttempt] = useState(null);
  const [started, setStarted] = useState(false);
  const answersRef = useRef({});
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const timerRef = useRef({ remaining: 0, interval: null });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const snapshotIntervalRef = useRef(null);
  const autosaveIntervalRef = useRef(null);

  // on mount: fetch exam meta and check for active attempt (resume)
  useEffect(() => {
    async function init() {
      try {
        const token = localStorage.getItem('token');
        if (!token) { nav('/login'); return; }

        const examRes = await api.get(`/exams/${id}`);
        setExam(examRes.data.exam);

        // check for active attempt
        const resumeRes = await api.get(`/attempts/my-active/${id}`);
        if (resumeRes.data.attempt) {
          const att = resumeRes.data.attempt;
          setAttempt(att);
          setStarted(true);
          // compute remaining and restart timer
          const startedAt = new Date(att.started_at_server);
          const elapsed = Math.floor((Date.now() - startedAt.getTime()) / 1000);
          timerRef.current.remaining = att.allowed_duration - elapsed;
          if (timerRef.current.remaining < 0) timerRef.current.remaining = 0;

          // load questions now (only after resume)
          const qres = await api.get(`/exams/${id}`);
          setQuestions(qres.data.questions);
          startTimer();
          startWebcamCapture(att.id);
          autosaveIntervalRef.current = setInterval(() => autoSaveAll(att.id), 10000);
        }
      } catch (err) {
        console.error(err);
        nav('/login');
      }
    }
    init();

    return () => { clearIntervals(); };
  }, [id]);

  // helper: request fullscreen
  async function requestKioskMode() {
    try { await document.documentElement.requestFullscreen?.(); } catch (e) { console.warn(e); }
  }

  // Start attempt (user presses Start)
  async function startAttempt() {
    try {
      const r = await api.post(`/attempts/start/${id}`);
      const att = r.data.attempt;
      setAttempt(att);
      await requestKioskMode();

      // load questions only after start
      const qres = await api.get(`/exams/${id}`);
      setQuestions(qres.data.questions);
      setStarted(true);

      timerRef.current.remaining = att.allowedDuration || att.allowed_duration || (exam.duration_minutes * 60);
      startTimer();
      startWebcamCapture(att.id);
      autosaveIntervalRef.current = setInterval(() => autoSaveAll(att.id), 10000);
    } catch (err) {
      console.error('start failed', err);
      alert('Failed to start attempt');
    }
  }

  // Timer & auto-submit
  function startTimer() {
    if (timerRef.current.interval) clearInterval(timerRef.current.interval);
    timerRef.current.interval = setInterval(async () => {
      timerRef.current.remaining -= 1;
      if (timerRef.current.remaining <= 0) {
        clearInterval(timerRef.current.interval);
        if (attempt) {
          await autoSaveAll(attempt.id);
          await api.post(`/attempts/${attempt.id}/submit`).catch(()=>{});
          alert('Time is up. Exam auto-submitted.');
          nav('/');
        }
      } else {
        // force re-render
        setExam(e => ({ ...e }));
      }
    }, 1000);
  }

  // Autosave all answers
  async function autoSaveAll(attemptId) {
    const entries = Object.entries(answersRef.current);
    for (const [qid, payload] of entries) {
      try {
        await api.post(`/attempts/${attemptId}/answer`, { questionId: qid, answerPayload: payload });
      } catch (err) {
        console.error('autosave failed', err);
      }
    }
  }

  // webcam
  async function startWebcamCapture(attemptId) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      if (videoRef.current) videoRef.current.srcObject = stream;
      snapshotIntervalRef.current = setInterval(async () => {
        if (!canvasRef.current || !videoRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth || 320;
        canvasRef.current.height = videoRef.current.videoHeight || 240;
        ctx.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
        const base64 = stripDataUrl(canvasRef.current.toDataURL('image/png'));
        await api.post(`/attempts/${attemptId}/snapshot`, { imageBase64: base64 }).catch(()=>{});
      }, 30000);
    } catch (err) {
      console.warn('webcam not allowed', err);
    }
  }

  // heuristic devtools detection + block common keys
function installAdvancedAntiCheat(attemptId) {
  // 1) detect devtools by measuring execution time of debugger
  let devtoolsOpen = false;
  setInterval(()=> {
    const start = performance.now();
    // eslint-disable-next-line no-debugger
    debugger;
    const t = performance.now() - start;
    if (t > 200 && !devtoolsOpen) {
      devtoolsOpen = true;
      api.post(`/attempts/${attemptId}/log`, { eventType:'devtools_open', meta: { delta: t } }).catch(()=>{});
      // option: show overlay warning
      alert('Developer tools detected — this will be recorded.');
    }
  }, 1500);

  // 2) block keys: F12, Ctrl+Shift+I, Ctrl+Shift+C, Ctrl+W, Ctrl+Tab
  window.addEventListener('keydown', (e)=>{
    if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'C')) || (e.ctrlKey && e.key === 'w')) {
      e.preventDefault();
      api.post(`/attempts/${attemptId}/log`, { eventType:'shortcut_blocked', meta:{ key: e.key } }).catch(()=>{});
    }
  }, true);

  // 3) detect resize to strange sizes (indicating devtools docking)
  let lastWidth = window.innerWidth;
  setInterval(()=> {
    const w = window.innerWidth;
    if (Math.abs(w - lastWidth) > 200) {
      api.post(`/attempts/${attemptId}/log`, { eventType:'window_resize', meta:{ width:w } }).catch(()=>{});
      lastWidth = w;
    }
  }, 1000);
}


  function clearIntervals() {
    if (timerRef.current.interval) clearInterval(timerRef.current.interval);
    if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
    if (autosaveIntervalRef.current) clearInterval(autosaveIntervalRef.current);
  }

  // handle answer change
  function handleAnswerChange(qId, payload) {
    answersRef.current[qId] = payload;
  }

  // manual submit
  async function submitAttempt() {
  if (!attempt) return;

  await autoSaveAll(attempt.id);
  await api.post(`/attempts/${attempt.id}/submit`).catch(()=>{});

  alert('Time is up! Auto-submitting. Logging out in 30 seconds.');

  await autoSaveAll(attempt.id);
  await api.post(`/attempts/${attempt.id}/submit`).catch(()=>{});

  clearIntervals();

  setTimeout(() => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  nav('/login');
}, 30000);

}

  // Render:
  if (!exam) return <div>Loading exam...</div>;

  // If not started yet -> show Start overlay with instructions; show name/id
  if (!started) {
    return (
      <div className="card">
        <h2>{exam.title}</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>User ID:</strong> {user.id}</p>
        <h3>Instructions</h3>
        <ul>
          <li>Exam duration: {exam.duration_minutes} minutes</li>
          <li>Do not switch tabs; violations will be logged.</li>
          <li>Webcam snapshots will be captured.</li>
        </ul>
        <button onClick={startAttempt}>I Agree & Start Exam (Enter Fullscreen)</button>
      </div>
    );
  }

  // After started: questions are loaded into `questions`
  if (!questions) return <div>Starting exam...</div>;

  const minutes = Math.floor((timerRef.current.remaining || 0) / 60);
  const seconds = (timerRef.current.remaining || 0) % 60;

  return (
    <div className="exam-page">
      <div className="exam-header">
        <h3>{exam.title}</h3>
        <ProgressTimer remaining={timerRef.current.remaining} total={(exam.duration_minutes||0)*60} />
        <div>Timer: {String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}</div>
        <button onClick={submitAttempt}>Submit</button>
      </div>

      <div className="proctor-area">
        <video ref={videoRef} autoPlay muted playsInline width="160" height="120" style={{border:'1px solid #ddd'}} />
        <canvas ref={canvasRef} style={{display:'none'}} />
      </div>

      <div className="questions">
        {questions.map((q, idx) => (
          <div className="question-card" key={q.id}>
            <div><strong>Q{idx+1}</strong> - {q.type}</div>
            <div><p>{q.content.prompt || JSON.stringify(q.content)}</p></div>

            {q.type === 'mcq' && q.choices && q.choices.map((c, i) => (
              <label key={i}>
                <input type="radio" name={q.id} onChange={() => handleAnswerChange(q.id, { choice: i })} />
                {c}
              </label>
            ))}

            {q.type === 'coding' && (
              <textarea rows={10} placeholder="Write your code here..." onChange={(e) => handleAnswerChange(q.id, { code: e.target.value })} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
