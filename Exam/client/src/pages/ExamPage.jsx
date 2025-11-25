import React, { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiClock,
  FiVideo,
  FiAlertCircle,
  FiChevronLeft,
  FiChevronRight,
  FiSend,
  FiCamera,
} from "react-icons/fi";
import { storage, ref, uploadString, getDownloadURL } from "../firebaseClient";

export default function ExamPage() {
  const { id } = useParams();
  const nav = useNavigate();

  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [attempt, setAttempt] = useState(null);
  const [started, setStarted] = useState(false);
  const [violationModal, setViolationModal] = useState({
    show: false,
    message: "",
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  // ✅ NEW: Camera status tracking
  const [cameraStatus, setCameraStatus] = useState({
    loading: true,
    error: null,
    active: false,
  });

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const answersRef = useRef({});
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const snapshotRef = useRef(null);

  // ✅ Force Fullscreen Helper
  async function forceFullscreen() {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request blocked:", err);
    }
  }

  // ✅ IMPROVED: Camera initialization with proper error handling
  async function initializeCamera(attemptId = null) {
    setCameraStatus({ loading: true, error: null, active: false });

    try {
      // Request camera with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        },
        audio: false,
      });

      if (!videoRef.current) {
        await new Promise(r => setTimeout(r, 300));
        return initializeCamera(attemptId);
      }


      // Set the stream
      videoRef.current.srcObject = stream;

      // ✅ CRITICAL FIX: Wait for metadata to load before playing
      await new Promise((resolve, reject) => {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play()
            .then(resolve)
            .catch(reject);
        };

        // Timeout after 5 seconds
        setTimeout(() => reject(new Error("Camera timeout")), 5000);
      });

      setCameraStatus({ loading: false, error: null, active: true });

      // Start snapshots if attempt is active
      if (attemptId) {
        startSnapshots(attemptId);
      }

      return true;
    } catch (err) {
      console.error("Camera initialization error:", err);

      let errorMessage = "Failed to access camera. ";

      if (err.name === "NotAllowedError") {
        errorMessage += "Please grant camera permission and refresh the page.";
      } else if (err.name === "NotFoundError") {
        errorMessage += "No camera detected on your device.";
      } else if (err.name === "NotReadableError") {
        errorMessage += "Camera is already in use by another application.";
      } else {
        errorMessage += err.message || "Unknown error occurred.";
      }

      setCameraStatus({ loading: false, error: errorMessage, active: false });
      return false;
    }
  }

  useEffect(() => {
    init();
    return clearAll;
  }, [id]);

  async function init() {
    try {
      const completedCheck = await api
        .get(`/user/attempts/check-completed/${id}`)
        .catch(() => ({ data: { completed: false } }));

      if (completedCheck.data.completed) {
        alert("You have already completed this exam!");
        nav("/student");
        return;
      }

      const examRes = await api.get(`/user/exams/${id}`);
      setExam(examRes.data.exam);

      const resume = await api.get(`/user/attempts/my-active/${id}`);
      if (resume.data.attempt) {
        const att = resume.data.attempt;
        setAttempt(att);
        setStarted(true);

        const startedAt = new Date(att.started_at_server);
        const elapsed = Math.floor((Date.now() - startedAt) / 1000);
        const remaining = Math.max(att.allowed_duration - elapsed, 0);
        setRemainingTime(remaining);

        const qRes = await api.get(`/user/exams/${id}`);
        setQuestions(qRes.data.questions);

        startTimer(remaining);

        // ✅ FIXED: Proper camera initialization with error handling
        await initializeCamera(att.id);
      }
    } catch {
      nav("/login");
    }
  }

  async function startAttempt() {
    try {
      await forceFullscreen();

      // ✅ FIXED: Initialize camera BEFORE starting the attempt
      const cameraReady = await initializeCamera();

      if (!cameraReady) {
        alert("Camera access is required to start the exam. Please grant permission and try again.");
        return;
      }

      const res = await api.post(`/user/attempts/start/${id}`);
      const att = res.data.attempt;

      setAttempt(att);
      setStarted(true);

      const qRes = await api.get(`/user/exams/${id}`);
      setQuestions(qRes.data.questions);

      const duration = att.allowed_duration || exam.duration_minutes * 60;
      setRemainingTime(duration);
      startTimer(duration);

      // Start snapshots now that we have an attempt ID
      startSnapshots(att.id);
    } catch (err) {
      console.error(err);
      alert("Failed to start exam: " + (err.message || "Unknown error"));
    }
  }

  function startTimer(duration) {
    let remaining = duration;
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      remaining--;
      setRemainingTime(remaining);

      if (remaining <= 0) {
        submitAttempt(true);
      }
    }, 1000);
  }

  function startSnapshots(attemptId) {
    snapshotRef.current = setInterval(async () => {
      if (
        !canvasRef.current ||
        !videoRef.current ||
        videoRef.current.videoWidth === 0
      )
        return;

      try {
        const ctx = canvasRef.current.getContext("2d");
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);

        const dataUrl = canvasRef.current.toDataURL("image/jpeg", 0.7);

        const filePath = `exam-monitoring/${user.id}/${attemptId}/${Date.now()}.jpg`;
        const fileRef = ref(storage, filePath);

        await uploadString(fileRef, dataUrl, "data_url");
        const downloadURL = await getDownloadURL(fileRef);

        await api
          .post(`/user/attempts/${attemptId}/snapshot-url`, {
            imageUrl: downloadURL,
          })
          .catch(() => { });
      } catch (err) {
        console.error(err);
      }
    }, 30000);
  }

  const [securityMessage, setSecurityMessage] = useState("");
  // ✅ FULLSCREEN EXIT LOGGING
  useEffect(() => {
    if (!started) return;

    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        setSecurityMessage("⚠️ Not allowed! Returning to fullscreen…");

        // Force it back
        forceFullscreen();
        if (attempt?.id) {
          api
            .post(`/user/attempts/${attempt.id}/violation`, {
              type: "fullscreen_exit",
              severity: "high",
              timestamp: new Date().toISOString(),
            })
            .catch(() => { });
        }
        setTimeout(() => setSecurityMessage(""), 3000);
      }
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [started, attempt]);

  // ✅ TAB SWITCH / MINIMIZE LOGGING
  useEffect(() => {
    if (!started) return;

    function handleVisibility() {
      if (document.hidden && attempt?.id) {
        api
          .post(`/user/attempts/${attempt.id}/violation`, {
            type: "tab_switch_or_minimize",
            severity: "medium",
            timestamp: new Date().toISOString(),
          })
          .catch(() => { });
      }
    }

    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [started, attempt]);

  function clearAll() {
    if (timerRef.current) clearInterval(timerRef.current);
    if (snapshotRef.current) clearInterval(snapshotRef.current);

    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
    }
  }

  async function submitAttempt(auto = false) {
    if (!attempt) return;

    try {
      const entries = Object.entries(answersRef.current);

      for (const [qid, payload] of entries) {
        await api
          .post(`/user/attempts/${attempt.id}/answer`, {
            questionId: qid,
            answerPayload: payload,
          })
          .catch(() => { });
      }

      await api.post(`/user/attempts/${attempt.id}/submit`);

      clearAll();
      if (document.fullscreenElement) await document.exitFullscreen();

      alert(auto ? "Time up. Submitted." : "Exam Submitted");

      nav("/student");
    } catch (err) {
      alert("Submit failed");
    }
  }

  function handleAnswerChange(questionId, answer) {
    answersRef.current[questionId] = answer;
  }

  if (!exam) return <div>Loading...</div>;
  <div style={{ display: "none" }}>
    <video ref={videoRef} autoPlay playsInline muted />
    <canvas ref={canvasRef} />
  </div>
  if (!started) {
    return (

      <div style={pageWrapper}>
        <div style={startCard}>
          <h1>{exam.title}</h1>
          <button onClick={startAttempt} style={startButton}>
            Begin Exam
          </button>
        </div>
      </div>
    );
  }

  if (!questions) return <div>Loading...</div>;

  const currentQuestion = questions[currentIndex];
  const mins = Math.floor(remainingTime / 60);
  const secs = remainingTime % 60;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <>
      <div style={examContainer}>
        <div style={examHeader}>
          <div style={examHeaderLeft}>
            <h2 style={examHeaderTitle}>{exam.title}</h2>
            <div style={questionProgress}>
              Question {currentIndex + 1} of {questions.length}
            </div>
          </div>

          <div style={examHeaderRight}>
            <div style={timerBox}>
              <FiClock size={20} />
              <span style={timerText}>
                {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
              </span>
            </div>

            <button onClick={() => submitAttempt(false)} style={submitButton}>
              <FiSend size={18} /> Submit Exam
            </button>
          </div>
        </div>
        {securityMessage && (
          <div style={{
            background: '#fee2e2',
            color: '#991b1b',
            padding: '10px 16px',
            borderRadius: 8,
            fontWeight: 600,
            textAlign: 'center',
            margin: '10px 20px'
          }}>
            {securityMessage}
          </div>
        )}
        <div style={progressBar}>
          <div
            style={{
              ...progressFill,
              width: `${progress}%`,
            }}
          ></div>
        </div>

        <div style={examBody}>
          {/* LEFT SIDE: QUESTIONS */}
          <div style={mainContent}>
            <div style={questionCard}>
              <div style={questionHeader}>
                <span style={questionNumber}>Q{currentIndex + 1}</span>
                <span style={questionType}>
                  {currentQuestion.question_type?.toUpperCase() || "MCQ"}
                </span>
                <span style={questionPoints}>
                  {currentQuestion.marks ||
                    currentQuestion.points ||
                    1}{" "}
                  points
                </span>
              </div>

              <p style={questionText}>
                {currentQuestion.question_text ||
                  currentQuestion.content?.prompt ||
                  currentQuestion.content}
              </p>

              <div style={answerSection}>
                {(currentQuestion.question_type === "mcq" ||
                  currentQuestion.type === "mcq") && (
                    <div style={mcqOptions}>
                      {(currentQuestion.options ||
                        currentQuestion.choices ||
                        []).map((choice, i) => (
                          <label key={i} style={mcqOption}>
                            <input
                              type="radio"
                              name={`question-${currentQuestion.id}`}
                              checked={
                                answersRef.current[currentQuestion.id]?.choice === i
                              }
                              onChange={() =>
                                handleAnswerChange(currentQuestion.id, {
                                  choice: i,
                                })
                              }
                              style={mcqRadio}
                            />
                            <span style={mcqLabel}>{choice}</span>
                          </label>
                        ))}
                    </div>
                  )}

                {currentQuestion.question_type !== "mcq" &&
                  currentQuestion.type !== "mcq" && (
                    <textarea
                      rows={12}
                      placeholder="Write your code here..."
                      onChange={(e) =>
                        handleAnswerChange(currentQuestion.id, {
                          code: e.target.value,
                        })
                      }
                      style={codeTextarea}
                    />
                  )}
              </div>
            </div>

            <div style={navigationButtons}>
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((i) => i - 1)}
                style={currentIndex === 0 ? navButtonDisabled : navButton}
              >
                <FiChevronLeft size={20} />
                Previous
              </button>

              <button
                disabled={currentIndex === questions.length - 1}
                onClick={() => setCurrentIndex((i) => i + 1)}
                style={
                  currentIndex === questions.length - 1
                    ? navButtonDisabled
                    : navButton
                }
              >
                Next
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* RIGHT SIDE: CAMERA + NAVIGATOR */}
          <div style={sidebar}>
            <div style={cameraBox}>
              <div style={cameraHeader}>
                <FiVideo size={16} />
                <span>Camera Feed</span>
                {/* ✅ NEW: Status indicator */}
                {cameraStatus.active && (
                  <span style={liveIndicator}>
                    <span style={liveDot}></span> LIVE
                  </span>
                )}
              </div>

              {/* ✅ NEW: Loading state */}
              {cameraStatus.loading && (
                <div style={cameraPlaceholder}>
                  <FiCamera size={48} color="#94a3b8" />
                  <p style={cameraPlaceholderText}>Initializing camera...</p>
                </div>
              )}

              {/* ✅ NEW: Error state */}
              {cameraStatus.error && (
                <div style={cameraError}>
                  <FiAlertCircle size={48} color="#ef4444" />
                  <p style={cameraErrorText}>{cameraStatus.error}</p>
                  <button
                    onClick={() => initializeCamera(attempt?.id)}
                    style={retryButton}
                  >
                    Retry Camera
                  </button>
                </div>
              )}

              {/* ✅ IMPROVED: Video element with mirror effect */}
              <video
                autoPlay
                playsInline
                muted
                style={{
                  ...videoElement,
                  display: cameraStatus.active ? 'block' : 'none',
                  transform: 'scaleX(-1)',
                }}
              />


              <canvas ref={canvasRef} hidden />

              <p style={cameraNote}>Your session is being monitored</p>
            </div>

            <div style={questionsGrid}>
              <h4 style={gridTitle}>Question Navigator</h4>

              <div style={gridContainer}>
                {questions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    style={{
                      ...gridItem,
                      ...(idx === currentIndex ? gridItemActive : {}),
                      ...(answersRef.current[q.id] ? gridItemAnswered : {}),
                    }}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ... (keeping all your existing styles)

const pageWrapper = { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px' };
const loadingContainer = { minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' };
const spinner = { width: 48, height: 48, border: '4px solid #e2e8f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite' };
const loadingText = { marginTop: 20, fontSize: 16, color: '#64748b' };
const startCard = { background: '#ffffff', borderRadius: 24, padding: 48, maxWidth: 600, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center' };
const startHeader = { marginBottom: 32 };
const startIcon = { width: 80, height: 80, margin: '0 auto 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' };
const startTitle = { fontSize: 28, fontWeight: 700, color: '#0f172a', marginBottom: 8 };
const startSubtitle = { fontSize: 16, color: '#64748b' };
const instructionsBox = { background: '#f8fafc', borderRadius: 16, padding: 24, marginBottom: 24, textAlign: 'left' };
const instructionsTitle = { fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 16 };
const instructionsList = { listStyle: 'none', padding: 0, margin: 0, fontSize: 14, color: '#64748b', lineHeight: 2 };
const candidateInfo = { background: '#f1f5f9', borderRadius: 12, padding: 16, marginBottom: 24 };
const candidateLabel = { fontSize: 12, color: '#64748b', marginBottom: 4 };
const candidateName = { fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 2 };
const candidateEmail = { fontSize: 14, color: '#64748b' };
const startButton = { width: '100%', padding: '16px 32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)', transition: 'all 0.3s' };
const examContainer = { minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column' };
const examHeader = { background: '#ffffff', padding: '20px 40px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100 };
const examHeaderLeft = { display: 'flex', alignItems: 'center', gap: 24 };
const examHeaderTitle = { fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0 };
const questionProgress = { fontSize: 14, color: '#64748b', padding: '6px 12px', background: '#f1f5f9', borderRadius: 8 };
const examHeaderRight = { display: 'flex', alignItems: 'center', gap: 16 };
const timerBox = { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: '#fef3c7', borderRadius: 12, color: '#92400e', fontSize: 18, fontWeight: 600 };
const timerText = { fontFamily: 'monospace' };
const submitButton = { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' };
const progressBar = { height: 4, background: '#e2e8f0', position: 'relative' };
const progressFill = { height: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', transition: 'width 0.3s' };
const examBody = { flex: 1, display: 'flex', gap: 24, padding: 40, maxWidth: 1600, margin: '0 auto', width: '100%' };
const mainContent = { flex: 1, display: 'flex', flexDirection: 'column', gap: 24 };
const questionCard = { background: '#ffffff', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', flex: 1 };
const questionHeader = { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #f1f5f9' };
const questionNumber = { fontSize: 16, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '6px 14px', borderRadius: 8 };
const questionType = { fontSize: 12, fontWeight: 600, color: '#64748b', padding: '6px 12px', background: '#f1f5f9', borderRadius: 6 };
const questionPoints = { fontSize: 12, fontWeight: 600, color: '#10b981', padding: '6px 12px', background: '#d1fae5', borderRadius: 6, marginLeft: 'auto' };
const questionText = { fontSize: 16, color: '#0f172a', lineHeight: 1.8, marginBottom: 24 };
const answerSection = { marginTop: 24 };
const mcqOptions = { display: 'flex', flexDirection: 'column', gap: 12 };
const mcqOption = { display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#f8fafc', borderRadius: 12, cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s' };
const mcqRadio = { width: 20, height: 20, accentColor: '#667eea' };
const mcqLabel = { fontSize: 15, color: '#0f172a', flex: 1 };
const codeTextarea = { width: '100%', padding: 16, fontSize: 14, fontFamily: 'monospace', border: '2px solid #e2e8f0', borderRadius: 12, resize: 'vertical', outline: 'none' };
const navigationButtons = { display: 'flex', gap: 16, justifyContent: 'space-between' };
const navButton = { flex: 1, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#667eea', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s' };
const navButtonDisabled = { flex: 1, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#e2e8f0', color: '#94a3b8', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'not-allowed' };
const sidebar = { width: 320, display: 'flex', flexDirection: 'column', gap: 24 };
const cameraBox = { background: '#ffffff', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' };
const cameraHeader = { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#0f172a' };
const videoElement = { width: '100%', borderRadius: 12, background: '#1e293b', aspectRatio: '4/3', objectFit: 'cover' };
const cameraNote = { fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 8 };
const questionsGrid = { background: '#ffffff', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.06)' };
const gridTitle = { fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 16 };
const gridContainer = { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8 };
const gridItem = { width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer', transition: 'all 0.3s' };
const gridItemActive = { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', borderColor: '#667eea' };
const gridItemAnswered = { background: '#d1fae5', borderColor: '#10b981', color: '#15803d' };

// ✅ NEW STYLES for camera states
const liveIndicator = {
  marginLeft: 'auto',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  fontSize: 11,
  fontWeight: 700,
  color: '#ef4444',
  padding: '4px 8px',
  background: '#fee2e2',
  borderRadius: 6
};

const liveDot = {
  width: 6,
  height: 6,
  borderRadius: '50%',
  background: '#ef4444',
  animation: 'pulse 2s infinite'
};

const cameraPlaceholder = {
  width: '100%',
  aspectRatio: '4/3',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#f1f5f9',
  borderRadius: 12,
  gap: 12
};

const cameraPlaceholderText = {
  fontSize: 13,
  color: '#64748b',
  margin: 0
};

const cameraError = {
  width: '100%',
  aspectRatio: '4/3',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fef2f2',
  borderRadius: 12,
  gap: 12,
  padding: 20
};

const cameraErrorText = {
  fontSize: 12,
  color: '#991b1b',
  margin: 0,
  textAlign: 'center',
  lineHeight: 1.5
};

const retryButton = {
  padding: '8px 16px',
  background: '#ef4444',
  color: '#fff',
  border: 'none',
  borderRadius: 8,
  fontSize: 13,
  fontWeight: 600,
  cursor: 'pointer',
  marginTop: 8
};