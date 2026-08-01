import React from "react";
import { ShieldCheck } from "lucide-react";

export default function Navbar() {
  return (
    <header className="nb-navbar">
      <style>{`
        .nb-navbar {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px 28px;
          background: #F2F4EE;
          border-bottom: 3px solid #1C2A3A;
          font-family: 'Inter', sans-serif;
        }

        .nb-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 8px;
          background: #1C2A3A;
          color: #F2F4EE;
          flex-shrink: 0;
        }

        .nb-text {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .nb-title {
          font-size: 20px;
          font-weight: 700;
          color: #1C2A3A;
          letter-spacing: 0.01em;
          white-space: nowrap;
        }

        .nb-title span { color: #A9812F; }

        .nb-subtitle {
          font-size: 12px;
          color: #4B5A6B;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 480px) {
          .nb-navbar { padding: 14px 16px; gap: 10px; }
          .nb-icon { width: 34px; height: 34px; }
          .nb-title { font-size: 17px; }
          .nb-subtitle { font-size: 10.5px; }
        }
      `}</style>

      <div className="nb-icon">
        <ShieldCheck size={22} strokeWidth={2} />
      </div>

      <div className="nb-text">
        <span className="nb-title">
          Comply<span>AI</span>
        </span>
        <span className="nb-subtitle">AI Powered Compliance Gap Analysis</span>
      </div>
    </header>
  );
}