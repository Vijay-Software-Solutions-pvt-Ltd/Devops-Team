import React, { useEffect, useState, useRef } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import ProgressTimer from '../components/ProgressTimer';

function stripDataUrl(dataUrl) {
  return dataUrl.split(',')[1];
}

export default function ExamPage() {
  const { id } = useParams();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [started, setStarted] = useState(false);

  const answersRef = useRef({});
  const timerRef = useRef({ remaining: 0, interval: null });
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const snapshotIntervalRef = useRef(null);
  const autosaveIntervalRef = useRef(null);
  const mediaStreamRef = useRef(null);

  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    async function init() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          nav('/#/login');
          return;
        }

        const examRes = await api.get(`/user/exams/${id}`);
        setExam(examRes.data.exam);

        const resumeRes = await api.get(`/user/attempts/my-active/${id}`);
        if (resumeRes.data.attempt) {
          const att = resumeRes.data.attempt;
          setAttempt(att);
          setStarted(true);

          const startedAt = new Date(att.started_at_server);
          const elapsed = Math.floor((Date.now() - startedAt.getTime()) / 1000);
          timerRef.current.remaining = Math.max(
            att.allowed_duration - elapsed,
            0
          );

          const qres = await api.get(`/user/exams/${id}`);
          setQuestions(qres.data.questions);

          startTimer();
          startWebcamCapture(att.id);
          installAdvancedAntiCheat(att.id);

          autosaveIntervalRef.current = setInterval(
            () => autoSaveAll(att.id),
            10000
          );
        }
      } catch (err) {
        console.error('Init failed:', err);
        alert('Failed to load exam. Refresh page.');
      }
    }

    init();
    return () => clearIntervals();
  }, [id]);

  async function requestKioskMode() {
    try {
      await document.documentElement.requestFullscreen?.();
    } catch {}
  }

  async function startAttempt() {
    try {
      const r = await api.post(`/user/attempts/start/${id}`);
      const att = r.data.attempt;

      setAttempt(att);
      await requestKioskMode();

      const qres = await api.get(`/user/exams/${id}`);
      setQuestions(qres.data.questions);
      setStarted(true);

      timerRef.current.remaining =
        att.allowedDuration ||
        att.allowed_duration ||
        exam.duration_minutes * 60;

      startTimer();
      startWebcamCapture(att.id);
      installAdvancedAntiCheat(att.id);

      autosaveIntervalRef.current = setInterval(
        () => autoSaveAll(att.id),
        10000
      );
    } catch (err) {
      console.error('start failed', err);
      alert('Failed to start attempt');
    }
  }

  function startTimer() {
    if (timerRef.current.interval) clearInterval(timerRef.current.interval);

    timerRef.current.interval = setInterval(async () => {
      timerRef.current.remaining--;

      if (timerRef.current.remaining <= 0) {
        clearInterval(timerRef.current.interval);

        if (attempt) {
          await autoSaveAll(attempt.id);
          await api.post(`/user/attempts/${attempt.id}/submit`).catch(() => {});
          alert('Time up! Exam submitted.');
          nav('/');
        }
      } else {
        setExam((e) => ({ ...e }));
      }
    }, 1000);
  }

  async function autoSaveAll(attemptId) {
    const entries = Object.entries(answersRef.current);
    for (const [qid, payload] of entries) {
      try {
        await api.post(`/user/attempts/${attemptId}/answer`, {
          questionId: qid,
          answerPayload: payload
        });
      } catch (err) {
        console.error('Autosave failed', err);
      }
    }
  }

  async function startWebcamCapture(attemptId) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false
      });

      window.stream = stream;
      mediaStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      snapshotIntervalRef.current = setInterval(async () => {
        if (!canvasRef.current || !videoRef.current) return;

        const ctx = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth || 320;
        canvasRef.current.height = videoRef.current.videoHeight || 240;

        ctx.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );

        const base64 = stripDataUrl(
          canvasRef.current.toDataURL('image/png')
        );

        await api
          .post(`/user/attempts/${attemptId}/snapshot`, {
            imageBase64: base64
          })
          .catch(() => {});
      }, 30000);
    } catch (err) {
      console.warn('Webcam not allowed');
    }
  }

  function stopWebcam() {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (window.stream) {
      window.stream.getTracks().forEach((t) => t.stop());
      window.stream = null;
    }
  }

  function installAdvancedAntiCheat(attemptId) {
    setInterval(() => {
      const start = performance.now();
      debugger; // eslint-disable-line
      const delta = performance.now() - start;

      if (delta > 200) {
        api.post(`/user/attempts/${attemptId}/log`, {
          eventType: 'devtools_open',
          meta: { delta }
        }).catch(() => {});
        alert('Devtools detected. Logged.');
      }
    }, 1500);

    window.addEventListener(
      'keydown',
      (e) => {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && ['I', 'C'].includes(e.key)) ||
          (e.ctrlKey && e.key === 'w')
        ) {
          e.preventDefault();
          api.post(`/user/attempts/${attemptId}/log`, {
            eventType: 'shortcut_blocked',
            meta: { key: e.key }
          }).catch(() => {});
        }
      },
      true
    );
  }

  function clearIntervals() {
    if (timerRef.current.interval) clearInterval(timerRef.current.interval);
    if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
    if (autosaveIntervalRef.current) clearInterval(autosaveIntervalRef.current);
    stopWebcam();
  }

  function handleAnswerChange(qId, payload) {
    answersRef.current[qId] = payload;
  }

  async function submitAttempt() {
    if (!attempt) return;

    await autoSaveAll(attempt.id);
    await api.post(`/user/attempts/${attempt.id}/submit`).catch(() => {});

    clearIntervals();

    alert('Exam submitted successfully.');

    setTimeout(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      nav('/#/login');
    }, 3000);
  }

  if (!exam) return <div>Loading exam...</div>;

  if (!started) {
    return (
      <div className="card">
        <h2>{exam.title}</h2>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>User ID:</strong> {user.id}</p>

        <ul>
          <li>Duration: {exam.duration_minutes} mins</li>
          <li>No tab switching</li>
          <li>Webcam monitoring active</li>
        </ul>

        <button onClick={startAttempt}>
          I Agree & Start Exam
        </button>
      </div>
    );
  }

  if (!questions) return <div>Loading questions...</div>;

  const minutes = Math.floor(timerRef.current.remaining / 60);
  const seconds = timerRef.current.remaining % 60;

  return (
    <div className="exam-page">
      <div className="exam-header">
        <h3>{exam.title}</h3>
        <ProgressTimer
          remaining={timerRef.current.remaining}
          total={(exam.duration_minutes || 0) * 60}
        />
        <div>
          Timer: {String(minutes).padStart(2, '0')}:
          {String(seconds).padStart(2, '0')}
        </div>
        <button onClick={submitAttempt}>Submit</button>
      </div>

      <div className="proctor-area">
        <video ref={videoRef} autoPlay muted playsInline
          width="160" height="120" style={{ border: '1px solid #ddd' }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="questions">
        {questions.map((q, idx) => (
          <div className="question-card" key={q.id}>
            <div>
              <strong>Q{idx + 1}</strong> - {q.type}
            </div>

            <div>
              <p>{q.content.prompt || JSON.stringify(q.content)}</p>
            </div>

            {q.type === 'mcq' &&
              q.choices?.map((c, i) => (
                <label key={i}>
                  <input
                    type="radio"
                    name={q.id}
                    onChange={() =>
                      handleAnswerChange(q.id, { choice: i })
                    }
                  />
                  {c}
                </label>
              ))}

            {q.type === 'coding' && (
              <textarea
                rows={10}
                placeholder="Write code here"
                onChange={(e) =>
                  handleAnswerChange(q.id, { code: e.target.value })
                }
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
