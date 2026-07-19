import { useEffect, useState } from "react";
import { startSession, endSession, getSessions } from "../services/api";

const STORAGE_KEY = "activeStudySession";

// Manages the full lifecycle of a study session: start -> (live timer) -> end.
// The active session is mirrored to localStorage so it survives a page
// refresh or switching tabs mid-session — otherwise closing the laptop lid
// during a 2-hour study session would silently lose the start time.
export default function useSessionTracker() {
  const [activeSession, setActiveSession] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Live-updating timer while a session is active
  useEffect(() => {
    if (!activeSession) {
      setElapsedSeconds(0);
      return;
    }
    const tick = () => {
      const elapsed = Math.floor((Date.now() - new Date(activeSession.start_time).getTime()) / 1000);
      setElapsedSeconds(elapsed);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [activeSession]);

  const loadHistory = async () => {
    setLoadingHistory(true);
    try {
      const sessions = await getSessions();
      setRecentSessions(sessions.slice(0, 10));
    } catch (err) {
      console.error("Error loading session history:", err);
      setError(err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const begin = async (subject) => {
    setError(null);
    try {
      const session = await startSession(subject);
      setActiveSession(session);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch (err) {
      console.error("Error starting session:", err);
      setError(err);
    }
  };

  const finish = async (fatigueRating, focusRating) => {
    if (!activeSession) return;
    setSubmitting(true);
    setError(null);
    try {
      await endSession(activeSession.id, fatigueRating, focusRating);
      localStorage.removeItem(STORAGE_KEY);
      setActiveSession(null);
      await loadHistory();
    } catch (err) {
      console.error("Error ending session:", err);
      setError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const discard = () => {
    // Escape hatch if a session was started by mistake — clears local
    // state only, the row still exists in the DB with no end_time.
    localStorage.removeItem(STORAGE_KEY);
    setActiveSession(null);
  };

  return {
    activeSession,
    elapsedSeconds,
    recentSessions,
    loadingHistory,
    submitting,
    error,
    begin,
    finish,
    discard,
  };
}
