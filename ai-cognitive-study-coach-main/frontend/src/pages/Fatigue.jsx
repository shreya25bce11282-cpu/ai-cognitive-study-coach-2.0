import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { useFatigue } from "../hooks/useFatigue";

import Loader from "../components/Loader";

const Fatigue = () => {
  const { data, aggregate, loading, error } = useFatigue();

  if (loading) return <Loader label="Loading fatigue data..." />;
  if (error) return <p style={{ color: "#f87171" }}>Couldn't load fatigue data. Is the backend running?</p>;

  return (
    <div className="container">
      <h1>Fatigue Analytics</h1>

      {/* Chart */}
      {data.length > 0 ? (
        <div style={{ height: "300px", marginTop: "20px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="fatigue" stroke="#6366f1" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p style={{ marginTop: "20px" }}>
          No completed sessions with a fatigue rating yet — log a few study
          sessions to see your trend here.
        </p>
      )}

      {/* Insight Box */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          background: "var(--card)",
          borderRadius: "16px",
        }}
      >
        <h3>AI Insight</h3>
        <p>{aggregate?.message ?? "Not enough data yet to generate an insight."}</p>
        {aggregate?.avg_fatigue_duration ? (
          <p>
            On average, fatigue sets in after ~{aggregate.avg_fatigue_duration}{" "}
            minutes of studying.
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default Fatigue;