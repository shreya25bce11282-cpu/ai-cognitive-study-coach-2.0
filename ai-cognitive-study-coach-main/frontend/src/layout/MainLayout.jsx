import React, { useState } from "react";
import Auth from "../pages/Auth";
import SessionTracker from "../pages/SessionTracker";
import Dashboard from "../pages/Dashboard";
import Fatigue from "../pages/Fatigue";
import useAuth from "../hooks/useAuth";

// Simple tab-based layout — no router library needed for three pages.
// If more pages get added later, swap this for react-router-dom.
// Note: switching tabs unmounts the inactive page, so Dashboard/Fatigue
// naturally refetch fresh data every time you switch back to them —
// no extra "refresh after logging a session" logic needed.
const TABS = [
  { id: "track", label: "Track Session", Component: SessionTracker },
  { id: "dashboard", label: "Dashboard", Component: Dashboard },
  { id: "fatigue", label: "Fatigue", Component: Fatigue },
];

const MainLayout = () => {
  const { isAuthenticated, error, loading, doLogin, doRegister, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("track");
  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.Component;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", position: "relative", marginTop: "20px" }}>
        <h1 style={{ fontSize: "28px", color: "#c7d2fe", margin: 0 }}>AI Study Coach</h1>
        {isAuthenticated && (
          <button
            onClick={logout}
            style={{
              position: "absolute",
              right: "20px",
              padding: "6px 14px",
              borderRadius: "8px",
              border: "1px solid #64748b",
              background: "transparent",
              color: "#94a3b8",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            Log out
          </button>
        )}
      </div>

      {!isAuthenticated ? (
        <Auth doLogin={doLogin} doRegister={doRegister} error={error} loading={loading} />
      ) : (
        <>
          <nav
            style={{
              display: "flex",
              gap: "8px",
              padding: "16px 20px",
              justifyContent: "center",
            }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "1px solid #4338ca",
                  background: activeTab === tab.id ? "#4338ca" : "transparent",
                  color: "#c7d2fe",
                  cursor: "pointer",
                }}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {ActiveComponent && <ActiveComponent />}
        </>
      )}
    </div>
  );
};

export default MainLayout;
