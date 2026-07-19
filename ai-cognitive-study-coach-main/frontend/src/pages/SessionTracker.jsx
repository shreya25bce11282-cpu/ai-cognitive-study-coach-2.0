import React, { useState } from "react";
import RatingInput from "../components/RatingInput";
import SessionHistory from "../components/SessionHistory";
import useSessionTracker from "../hooks/useSessionTracker";

function formatElapsed(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

const cardStyle = {
  background: "rgba(255, 255, 255, 0.05)",
  border: "1px solid rgba(255, 255, 255, 0.1)",
  borderRadius: "16px",
  padding: "24px",
  maxWidth: "480px",
  margin: "0 auto",
};

const buttonStyle = {
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  background: "#4338ca",
  color: "white",
  cursor: "pointer",
  fontSize: "15px",
};

export default function SessionTracker() {
  const {
    activeSession,
    elapsedSeconds,
    recentSessions,
    loadingHistory,
    submitting,
    error,
    begin,
    finish,
    discard,
  } = useSessionTracker();

  const [subject, setSubject] = useState("");
  const [focusRating, setFocusRating] = useState(null);
  const [fatigueRating, setFatigueRating] = useState(null);

  // Suggest subjects the user has already logged, so "Math" and "math"
  // don't end up as two different rows in the analytics breakdown.
  const knownSubjects = [...new Set(recentSessions.map((s) => s.subject))];

  const handleStart = (e) => {
    e.preventDefault();
    if (!subject.trim()) return;
    begin(subject.trim());
  };

  const handleEnd = async (e) => {
    e.preventDefault();
    if (!focusRating || !fatigueRating) return;
    await finish(fatigueRating, focusRating);
    setSubject("");
    setFocusRating(null);
    setFatigueRating(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={cardStyle}>
        {error && (
          <p style={{ color: "#f87171", marginBottom: "12px" }}>
            Something went wrong talking to the server. Check that it's running.
          </p>
        )}

        {!activeSession ? (
          <form onSubmit={handleStart}>
            <label style={{ display: "block", marginBottom: "8px", color: "#c7d2fe" }}>
              What are you studying?
            </label>
            <input
              list="subject-suggestions"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Math, DSA, Physics"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #4338ca",
                background: "transparent",
                color: "white",
                marginBottom: "16px",
                boxSizing: "border-box",
              }}
            />
            <datalist id="subject-suggestions">
              {knownSubjects.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
            <button type="submit" style={buttonStyle}>
              ▶ Start session
            </button>
          </form>
        ) : (
          <>
            <p style={{ color: "#94a3b8", marginBottom: "4px" }}>Studying</p>
            <h2 style={{ margin: "0 0 4px", color: "#e0e7ff" }}>{activeSession.subject}</h2>
            <p style={{ fontSize: "32px", fontFamily: "monospace", margin: "12px 0" }}>
              {formatElapsed(elapsedSeconds)}
            </p>

            <form onSubmit={handleEnd}>
              <RatingInput label="How's your focus? (1 = distracted, 5 = locked in)" value={focusRating} onChange={setFocusRating} />
              <RatingInput label="How fatigued are you? (1 = fresh, 5 = exhausted)" value={fatigueRating} onChange={setFatigueRating} />

              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button
                  type="submit"
                  disabled={!focusRating || !fatigueRating || submitting}
                  style={{
                    ...buttonStyle,
                    opacity: !focusRating || !fatigueRating || submitting ? 0.5 : 1,
                  }}
                >
                  {submitting ? "Saving..." : "■ End session"}
                </button>
                <button
                  type="button"
                  onClick={discard}
                  style={{ ...buttonStyle, background: "transparent", border: "1px solid #64748b", color: "#94a3b8" }}
                >
                  Discard
                </button>
              </div>
            </form>
          </>
        )}
      </div>

      <div style={{ maxWidth: "700px", margin: "32px auto 0" }}>
        <h3 style={{ color: "#c7d2fe" }}>Recent sessions</h3>
        <SessionHistory sessions={recentSessions} loading={loadingHistory} />
      </div>
    </div>
  );
}
