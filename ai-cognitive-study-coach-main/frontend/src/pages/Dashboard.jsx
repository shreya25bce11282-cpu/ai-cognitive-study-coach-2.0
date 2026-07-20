import React from "react";
import Card from "../components/Card";
import Loader from "../components/Loader";
import useAnalytics from "../hooks/useAnalytics";

export default function Dashboard() {
  const { data, loading, error } = useAnalytics("Math");

  if (loading) return <Loader label="Loading your dashboard..." />;
  if (error) {
    return (
      <p style={{ textAlign: "center", marginTop: "40px", color: "#f87171" }}>
        Couldn't reach the backend. Make sure the server is running on port 5000.
      </p>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {data.aiInsight && (
        <div
          style={{
            maxWidth: "700px",
            margin: "0 auto 20px",
            padding: "20px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(99,102,241,0.15), rgba(168,85,247,0.1))",
            border: "1px solid rgba(129,140,248,0.3)",
          }}
        >
          <h3 style={{ margin: "0 0 8px", color: "#c7d2fe" }}>
            {data.aiInsight.source === "ai" ? "✨ AI Insight" : "💡 Insight"}
          </h3>
          <p style={{ margin: 0, color: "#e0e7ff" }}>{data.aiInsight.insight}</p>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center" }}>
        <Card title="📊 Summary">
          <p>{data.summary?.total_sessions ?? 0} sessions</p>
          <p>{data.summary?.total_hours ?? 0} hrs</p>
          <p>{data.summary?.avg_session_minutes ?? 0} min avg</p>
        </Card>

        <Card title="⏱ Best Time">
          <p>{data.bestTime?.best_hour ?? "Not enough data yet"}</p>
          <p>{data.bestTime?.insight}</p>
        </Card>

        <Card title="🔥 Burnout">
          <p>{data.burnout?.burnout_risk}</p>
          <p>{data.burnout?.recommendation}</p>
        </Card>

        <Card title="☕ Break">
          <p>{data.breakRec?.recommendation}</p>
        </Card>

        <Card title="🧠 Prediction">
          <p>{data.prediction?.predicted_duration} min</p>
          <p>{data.prediction?.insight}</p>
        </Card>
      </div>
    </div>
  );
}
