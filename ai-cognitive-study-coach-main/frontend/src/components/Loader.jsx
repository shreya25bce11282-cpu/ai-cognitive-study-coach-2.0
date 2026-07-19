import React from "react";

// Simple centered loading indicator, reused wherever a page is waiting on the API.
const Loader = ({ label = "Loading..." }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        color: "#c7d2fe",
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          border: "4px solid rgba(199, 210, 254, 0.25)",
          borderTopColor: "#c7d2fe",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <p style={{ marginTop: "12px" }}>{label}</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Loader;
