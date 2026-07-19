import React from "react";

// Reusable 1-5 rating picker — used for both focus and fatigue ratings
// when ending a session. Keeping it as one component means both ratings
// always look and behave identically.
const RatingInput = ({ label, value, onChange }) => {
  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ marginBottom: "8px", color: "#c7d2fe" }}>{label}</p>
      <div style={{ display: "flex", gap: "8px" }}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "8px",
              border: "1px solid #4338ca",
              background: value === n ? "#4338ca" : "transparent",
              color: "#e0e7ff",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
};

export default RatingInput;
