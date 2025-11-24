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
        const remaining = Math.max(
          att.allowed_duration - elapsed,
          0
        );
        setRemainingTime(remaining);

        const qRes = await api.get(`/user/exams/${id}`);
        setQuestions(qRes.data.questions);

        startTimer(remaining);

        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            await videoRef.current.play();
          }
          startSnapshots(att.id);
        } catch {}
      }
    } catch {
      nav("/login");
    }
  }

  async function startAttempt() {
    try {
      await forceFullscreen();

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      const res = await api.post(`/user/attempts/start/${id}`);
      const att = res.data.attempt;

      setAttempt(att);
      setStarted(true);

      const qRes = await api.get(`/user/exams/${id}`);
      setQuestions(qRes.data.questions);

      const duration =
        att.allowed_duration || exam.duration_minutes * 60;
      setRemainingTime(duration);
      startTimer(duration);
      startSnapshots(att.id);
    } catch (err) {
      console.error(err);
      alert("Failed to start exam");
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

        const dataUrl = canvasRef.current.toDataURL(
          "image/jpeg",
          0.7
        );

        const filePath = `exam-monitoring/${user.id}/${attemptId}/${Date.now()}.jpg`;
        const fileRef = ref(storage, filePath);

        await uploadString(fileRef, dataUrl, "data_url");
        const downloadURL = await getDownloadURL(fileRef);

        await api
          .post(`/user/attempts/${attemptId}/snapshot-url`, {
            imageUrl: downloadURL,
          })
          .catch(() => {});
      } catch (err) {
        console.error(err);
      }
    }, 30000);
  }

  // ✅ FULLSCREEN EXIT LOGGING
  useEffect(() => {
    if (!started) return;

    function handleFullscreenChange() {
      if (!document.fullscreenElement) {
        forceFullscreen();

        if (attempt?.id) {
          api
            .post(
              `/user/attempts/${attempt.id}/violation`,
              {
                type: "fullscreen_exit",
                severity: "high",
                timestamp: new Date().toISOString(),
              }
            )
            .catch(() => {});
        }
      }
    }

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () =>
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
  }, [started, attempt]);

  // ✅ TAB SWITCH / MINIMIZE LOGGING
  useEffect(() => {
    if (!started) return;

    function handleVisibility() {
      if (document.hidden && attempt?.id) {
        api
          .post(
            `/user/attempts/${attempt.id}/violation`,
            {
              type: "tab_switch_or_minimize",
              severity: "medium",
              timestamp: new Date().toISOString(),
            }
          )
          .catch(() => {});
      }
    }

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );
    return () =>
      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
  }, [started, attempt]);

  function clearAll() {
    if (timerRef.current)
      clearInterval(timerRef.current);
    if (snapshotRef.current)
      clearInterval(snapshotRef.current);

    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject
        .getTracks()
        .forEach((t) => t.stop());
    }
  }

  async function submitAttempt(auto = false) {
    if (!attempt) return;

    try {
      const entries = Object.entries(answersRef.current);

      for (const [qid, payload] of entries) {
        await api
          .post(
            `/user/attempts/${attempt.id}/answer`,
            {
              questionId: qid,
              answerPayload: payload,
            }
          )
          .catch(() => {});
      }

      await api.post(
        `/user/attempts/${attempt.id}/submit`
      );

      clearAll();
      if (document.fullscreenElement)
        await document.exitFullscreen();

      alert(
        auto
          ? "Time up. Submitted."
          : "Exam Submitted"
      );

      nav("/student");
    } catch (err) {
      alert("Submit failed");
    }
  }

  function handleAnswerChange(questionId, answer) {
    answersRef.current[questionId] = answer;
  }

  if (!exam) return <div>Loading...</div>;

  if (!started) {
    return (
      <div style={pageWrapper}>
        <div style={startCard}>
          <h1>{exam.title}</h1>
          <button onClick={startAttempt} style={startButton}>
            Begin Exam
          </button>
        </div>
        <canvas ref={canvasRef} hidden />
      </div>
    );
  }

  if (!questions) return <div>Loading...</div>;

  const currentQuestion = questions[currentIndex];
  const mins = Math.floor(remainingTime / 60);
  const secs = remainingTime % 60;
  const progress =
    ((currentIndex + 1) / questions.length) * 100;

  return (
    <>
      <div style={examContainer}>
        <div style={examHeader}>
          <h2>{exam.title}</h2>

          <div style={timerBox}>
            <FiClock />
            {String(mins).padStart(2, "0")}:
            {String(secs).padStart(2, "0")}
          </div>

          <button
            onClick={() => submitAttempt(false)}
            style={submitButton}
          >
            <FiSend /> Submit
          </button>
        </div>

        <video
          ref={videoRef}
          autoPlay
          muted
          style={{ width: 200 }}
        />
        <canvas ref={canvasRef} hidden />
      </div>
    </>
  );
}

const pageWrapper = {minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '40px'};
const loadingContainer = {minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc'};
const spinner = {width: 48, height: 48, border: '4px solid #e2e8f0', borderTop: '4px solid #667eea', borderRadius: '50%', animation: 'spin 1s linear infinite'};
const loadingText = {marginTop: 20, fontSize: 16, color: '#64748b'};
const startCard = {background: '#ffffff', borderRadius: 24, padding: 48, maxWidth: 600, boxShadow: '0 20px 60px rgba(0,0,0,0.3)', textAlign: 'center'};
const startHeader = {marginBottom: 32};
const startIcon = {width: 80, height: 80, margin: '0 auto 20px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'};
const startTitle = {fontSize: 28, fontWeight: 700, color: '#0f172a', marginBottom: 8};
const startSubtitle = {fontSize: 16, color: '#64748b'};
const instructionsBox = {background: '#f8fafc', borderRadius: 16, padding: 24, marginBottom: 24, textAlign: 'left'};
const instructionsTitle = {fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 16};
const instructionsList = {listStyle: 'none', padding: 0, margin: 0, fontSize: 14, color: '#64748b', lineHeight: 2};
const candidateInfo = {background: '#f1f5f9', borderRadius: 12, padding: 16, marginBottom: 24};
const candidateLabel = {fontSize: 12, color: '#64748b', marginBottom: 4};
const candidateName = {fontSize: 18, fontWeight: 600, color: '#0f172a', marginBottom: 2};
const candidateEmail = {fontSize: 14, color: '#64748b'};
const startButton = {width: '100%', padding: '16px 32px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', border: 'none', borderRadius: 12, fontSize: 16, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)', transition: 'all 0.3s'};
const examContainer = {minHeight: '100vh', background: '#f8fafc', display: 'flex', flexDirection: 'column'};
const examHeader = {background: '#ffffff', padding: '20px 40px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 100};
const examHeaderLeft = {display: 'flex', alignItems: 'center', gap: 24};
const examHeaderTitle = {fontSize: 20, fontWeight: 700, color: '#0f172a', margin: 0};
const questionProgress = {fontSize: 14, color: '#64748b', padding: '6px 12px', background: '#f1f5f9', borderRadius: 8};
const examHeaderRight = {display: 'flex', alignItems: 'center', gap: 16};
const timerBox = {display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', background: '#fef3c7', borderRadius: 12, color: '#92400e', fontSize: 18, fontWeight: 600};
const timerText = {fontFamily: 'monospace'};
const submitButton = {display: 'flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: '#10b981', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s'};
const progressBar = {height: 4, background: '#e2e8f0', position: 'relative'};
const progressFill = {height: '100%', background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)', transition: 'width 0.3s'};
const examBody = {flex: 1, display: 'flex', gap: 24, padding: 40, maxWidth: 1600, margin: '0 auto', width: '100%'};
const mainContent = {flex: 1, display: 'flex', flexDirection: 'column', gap: 24};
const questionCard = {background: '#ffffff', borderRadius: 20, padding: 32, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', flex: 1};
const questionHeader = {display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, paddingBottom: 16, borderBottom: '2px solid #f1f5f9'};
const questionNumber = {fontSize: 16, fontWeight: 700, color: '#fff', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: '6px 14px', borderRadius: 8};
const questionType = {fontSize: 12, fontWeight: 600, color: '#64748b', padding: '6px 12px', background: '#f1f5f9', borderRadius: 6};
const questionPoints = {fontSize: 12, fontWeight: 600, color: '#10b981', padding: '6px 12px', background: '#d1fae5', borderRadius: 6, marginLeft: 'auto'};
const questionText = {fontSize: 16, color: '#0f172a', lineHeight: 1.8, marginBottom: 24};
const answerSection = {marginTop: 24};
const mcqOptions = {display: 'flex', flexDirection: 'column', gap: 12};
const mcqOption = {display: 'flex', alignItems: 'center', gap: 12, padding: 16, background: '#f8fafc', borderRadius: 12, cursor: 'pointer', border: '2px solid transparent', transition: 'all 0.3s'};
const mcqRadio = {width: 20, height: 20, accentColor: '#667eea'};
const mcqLabel = {fontSize: 15, color: '#0f172a', flex: 1};
const codeTextarea = {width: '100%', padding: 16, fontSize: 14, fontFamily: 'monospace', border: '2px solid #e2e8f0', borderRadius: 12, resize: 'vertical', outline: 'none'};
const navigationButtons = {display: 'flex', gap: 16, justifyContent: 'space-between'};
const navButton = {flex: 1, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#667eea', color: '#fff', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.3s'};
const navButtonDisabled = {flex: 1, padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#e2e8f0', color: '#94a3b8', border: 'none', borderRadius: 12, fontSize: 15, fontWeight: 600, cursor: 'not-allowed'};
const sidebar = {width: 320, display: 'flex', flexDirection: 'column', gap: 24};
const cameraBox = {background: '#ffffff', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.06)'};
const cameraHeader = {display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 14, fontWeight: 600, color: '#0f172a'};
const videoElement = {width: '100%', borderRadius: 12, background: '#000', aspectRatio: '4/3'};
const cameraNote = {fontSize: 11, color: '#94a3b8', textAlign: 'center', marginTop: 8};
const questionsGrid = {background: '#ffffff', borderRadius: 20, padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.06)'};
const gridTitle = {fontSize: 14, fontWeight: 600, color: '#0f172a', marginBottom: 16};
const gridContainer = {display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8};
const gridItem = {width: '100%', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', border: '2px solid #e2e8f0', borderRadius: 8, fontSize: 13, fontWeight: 600, color: '#64748b', cursor: 'pointer', transition: 'all 0.3s'};
const gridItemActive = {background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff', borderColor: '#667eea'};
const gridItemAnswered = {background: '#d1fae5', borderColor: '#10b981', color: '#15803d'};

// Camera Notice Styles
const cameraNoticeBox = {background: '#f0f9ff', borderRadius: 16, padding: 20, marginBottom: 24, display: 'flex', gap: 16, alignItems: 'flex-start', border: '2px solid #3b82f6'};
const cameraNoticeIcon = {width: 48, height: 48, background: '#3b82f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0};
const cameraNoticeContent = {flex: 1};
const cameraNoticeTitle = {fontSize: 16, fontWeight: 600, color: '#1e40af', marginTop: 0, marginBottom: 8};
const cameraNoticeText = {fontSize: 14, color: '#1e3a8a', lineHeight: 1.6, margin: 0};
