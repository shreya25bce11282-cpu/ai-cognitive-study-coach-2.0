import React, { useState } from "react";

const inputStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #4338ca",
  background: "transparent",
  color: "white",
  marginBottom: "12px",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "10px",
  borderRadius: "8px",
  border: "none",
  background: "#4338ca",
  color: "white",
  cursor: "pointer",
  fontSize: "15px",
};

// Combined login/register screen — a toggle link switches modes rather
// than being two separate routes, since there's no router in this app.
// Receives auth state/handlers as props from MainLayout (the single owner
// of useAuth()) rather than calling the hook itself — two independent
// hook instances would have two independent isAuthenticated states.
export default function Auth({ doLogin, doRegister, error, loading }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === "login") {
      doLogin(email, password);
    } else {
      doRegister(email, password);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "60px 20px" }}>
      <div
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          padding: "32px",
          width: "100%",
          maxWidth: "360px",
        }}
      >
        <h2 style={{ color: "#e0e7ff", marginTop: 0 }}>
          {mode === "login" ? "Log in" : "Create an account"}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
            required
          />
          <input
            type="password"
            placeholder={mode === "register" ? "Password (min 8 characters)" : "Password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            required
          />

          {error && <p style={{ color: "#f87171", marginTop: 0 }}>{error}</p>}

          <button type="submit" style={{ ...buttonStyle, opacity: loading ? 0.6 : 1 }} disabled={loading}>
            {loading ? "..." : mode === "login" ? "Log in" : "Sign up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginBottom: 0, color: "#94a3b8" }}>
          {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            style={{ background: "none", border: "none", color: "#a5b4fc", cursor: "pointer", padding: 0, textDecoration: "underline" }}
          >
            {mode === "login" ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}
