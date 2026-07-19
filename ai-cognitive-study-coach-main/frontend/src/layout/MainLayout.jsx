import React, { useState } from "react";
import Dashboard from "../pages/Dashboard";
import Fatigue from "../pages/Fatigue";

// Simple tab-based layout — no router library needed for just two pages.
// If more pages get added later, swap this for react-router-dom.
const TABS = [
  { id: "dashboard", label: "Dashboard", Component: Dashboard },
  { id: "fatigue", label: "Fatigue", Component: Fatigue },
];

const MainLayout = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const ActiveComponent = TABS.find((t) => t.id === activeTab)?.Component;

  return (
    <div>
      <nav
        style={{
          display: "flex",
          gap: "8px",
          padding: "16px 20px 0",
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
    </div>
  );
};

export default MainLayout;
