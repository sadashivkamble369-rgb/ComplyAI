import React from "react";
import { ShieldCheck, Zap, Building2, Upload, ScrollText } from "lucide-react";

const LinkedInIcon = ({ size = 15 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
  </svg>
);


export default function Navbar({ activeTab, onTabChange, hasResults, isProcessing }) {
  const tabs = [
    { id: "platform", label: "Platform", icon: Zap },
    { id: "organization", label: "Organization", icon: Building2 },
    { id: "workspace", label: "Workspace", icon: Upload },
    {
      id: "report",
      label: "Audit Report",
      icon: ScrollText,
      badge: hasResults ? "Ready" : isProcessing ? "Analyzing" : null,
    },
  ];

  return (
    <header className="app-navbar">
      <style>{`
        .app-navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 32px;
          background: rgba(14, 20, 32, 0.85);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          font-family: var(--font-body, 'Inter', sans-serif);
        }

        .brand-section {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          text-decoration: none;
        }

        .brand-logo-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #4f7cff 0%, #8b6cf7 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(79, 124, 255, 0.35);
          flex-shrink: 0;
        }

        .brand-text-col {
          display: flex;
          flex-direction: column;
        }

        .brand-title {
          font-family: var(--font-display, 'Space Grotesk', sans-serif);
          font-size: 19px;
          font-weight: 700;
          color: #f3f5f9;
          letter-spacing: -0.01em;
          line-height: 1.2;
        }

        .brand-title span {
          background: linear-gradient(135deg, #4f7cff, #8b6cf7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-subtitle {
          font-size: 11px;
          color: #6c7488;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        .nav-tabs-container {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(255, 255, 255, 0.04);
          padding: 5px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .nav-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 10px;
          border: none;
          background: transparent;
          color: #a6aec2;
          font-size: 13.5px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          white-space: nowrap;
        }

        .nav-tab-btn:hover {
          color: #f3f5f9;
          background: rgba(255, 255, 255, 0.05);
        }

        .nav-tab-btn.is-active {
          color: #ffffff;
          background: linear-gradient(135deg, rgba(79, 124, 255, 0.25) 0%, rgba(139, 108, 247, 0.25) 100%);
          border: 1px solid rgba(79, 124, 255, 0.4);
          box-shadow: 0 4px 14px rgba(79, 124, 255, 0.2);
        }

        .nav-tab-btn .tab-icon {
          opacity: 0.7;
          transition: opacity 0.2s;
        }

        .nav-tab-btn.is-active .tab-icon {
          opacity: 1;
          color: #4f7cff;
        }

        .tab-badge {
          display: inline-flex;
          align-items: center;
          padding: 2px 7px;
          border-radius: 20px;
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .tab-badge.badge-ready {
          background: rgba(52, 211, 153, 0.15);
          color: #34d399;
          border: 1px solid rgba(52, 211, 153, 0.3);
        }

        .tab-badge.badge-analyzing {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
          animation: pulse 1.5s infinite;
        }

        .linkedin-profile-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 8px 14px;
          border-radius: 10px;
          background: rgba(10, 102, 194, 0.18);
          border: 1px solid rgba(10, 102, 194, 0.4);
          color: #38bdf8;
          font-size: 13px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }

        .linkedin-profile-btn:hover {
          background: rgba(10, 102, 194, 0.35);
          color: #ffffff;
          box-shadow: 0 4px 12px rgba(10, 102, 194, 0.3);
          transform: translateY(-1px);
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        @media (max-width: 840px) {
          .app-navbar {
            flex-direction: column;
            gap: 12px;
            padding: 12px 16px;
          }
          .nav-tabs-container {
            width: 100%;
            overflow-x: auto;
            justify-content: flex-start;
          }
          .nav-tab-btn {
            padding: 7px 12px;
            font-size: 12.5px;
          }
        }
      `}</style>

      <div className="brand-section" onClick={() => onTabChange && onTabChange("platform")}>
        <div className="brand-logo-box">
          <ShieldCheck size={22} strokeWidth={2.2} />
        </div>
        <div className="brand-text-col">
          <span className="brand-title">
            Comply<span>AI</span>
          </span>
          <span className="brand-subtitle">AI-Powered Compliance Infrastructure</span>
        </div>
      </div>

      <nav className="nav-tabs-container" aria-label="Main Navigation">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`nav-tab-btn ${isActive ? "is-active" : ""}`}
              onClick={() => onTabChange && onTabChange(tab.id)}
            >
              <Icon size={16} className="tab-icon" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`tab-badge badge-${tab.badge.toLowerCase()}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

    </header>
  );
}