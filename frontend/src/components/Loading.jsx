import React from "react";

export default function Loading({ text = "Analyzing compliance..." }) {
  return (
    <div className="ld-wrap">
      <style>{`
        .ld-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
          padding: 48px 24px;
          font-family: 'Inter', sans-serif;
        }

        .ld-spinner {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 4px solid #E2E5E0;
          border-top-color: #1C2A3A;
          animation: ld-spin 0.8s linear infinite;
        }

        @keyframes ld-spin {
          to { transform: rotate(360deg); }
        }

        .ld-text {
          font-size: 14.5px;
          font-weight: 500;
          letter-spacing: 0.02em;
          color: #4B5A6B;
          margin: 0;
        }
      `}</style>

      <div className="ld-spinner" role="status" aria-label="Loading" />
      <p className="ld-text">{text}</p>
    </div>
  );
}