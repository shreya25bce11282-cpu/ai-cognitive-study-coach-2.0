import React from "react";

function formatDuration(start, end) {
  if (!end) return "—";
  const minutes = Math.round((new Date(end) - new Date(start)) / 60000);
  return `${minutes} min`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Recent sessions table — shown under the tracker so you can see the
// last few sessions land right after you log them.
const SessionHistory = ({ sessions, loading }) => {
  if (loading) return <p style={{ color: "#94a3b8" }}>Loading history...</p>;

  if (sessions.length === 0) {
    return <p style={{ color: "#94a3b8" }}>No sessions logged yet — start one above.</p>;
  }

  return (
    <div style={{ overflowX: "auto", marginTop: "16px" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", color: "#e2e8f0" }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
            <th style={{ padding: "8px" }}>Subject</th>
            <th style={{ padding: "8px" }}>Started</th>
            <th style={{ padding: "8px" }}>Duration</th>
            <th style={{ padding: "8px" }}>Focus</th>
            <th style={{ padding: "8px" }}>Fatigue</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <td style={{ padding: "8px" }}>{s.subject}</td>
              <td style={{ padding: "8px" }}>{formatDate(s.start_time)}</td>
              <td style={{ padding: "8px" }}>{formatDuration(s.start_time, s.end_time)}</td>
              <td style={{ padding: "8px" }}>{s.focus_rating ?? "—"}</td>
              <td style={{ padding: "8px" }}>{s.fatigue_rating ?? "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SessionHistory;
