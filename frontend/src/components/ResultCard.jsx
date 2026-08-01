import React from "react";
import { AlertTriangle, CheckCircle2, ShieldCheck, ShieldAlert, ShieldQuestion } from "lucide-react";
import ClauseImprovements from "./ClauseImprovements";
import RevisedPolicyViewer from "./RevisedPolicyViewer";

function riskMeta(riskLevel) {
  const level = (riskLevel || "unknown").toLowerCase();
  if (level === "low") {
    return { label: "Low Risk", icon: ShieldCheck, className: "rc-badge-green" };
  }
  if (level === "medium") {
    return { label: "Medium Risk", icon: ShieldAlert, className: "rc-badge-amber" };
  }
  if (level === "high") {
    return { label: "High Risk", icon: ShieldAlert, className: "rc-badge-red" };
  }
  return { label: "Unknown Risk", icon: ShieldQuestion, className: "rc-badge-grey" };
}

function scoreBarClassName(score) {
  const numeric = Number(score);
  if (Number.isNaN(numeric)) return "rc-bar-grey";
  if (numeric >= 80) return "rc-bar-green";
  if (numeric >= 50) return "rc-bar-amber";
  return "rc-bar-red";
}

export default function ResultCard({ result }) {
  if (!result || !result.analysis) return null;

  const { company_file, regulation_file, analysis, policy_pdf_url: topPolicyUrl, audit_report_url: topAuditUrl } = result;
  const {
    compliance_score,
    risk_level,
    summary,
    missing_requirements = [],
    recommendations = [],
    improved_clauses = [],
    revised_policy = "",
    policy_pdf_url = topPolicyUrl || "",
    audit_report_url = topAuditUrl || "",
  } = analysis || {};

  const { label: riskLabel, icon: RiskIcon, className: riskClassName } = riskMeta(risk_level);
  const numericScore = Math.max(0, Math.min(100, Number(compliance_score) || 0));

  return (
    <div className="rc-card">
      <style>{`
        .rc-card {
          --rc-ink: #1C2A3A;
          --rc-ink-soft: #4B5A6B;
          --rc-line: #DDE1D8;
          --rc-paper: #F2F4EE;
          --rc-green: #2F6F4E;
          --rc-green-bg: #E4F0E8;
          --rc-amber: #B4791E;
          --rc-amber-bg: #FBF0DF;
          --rc-red: #A03227;
          --rc-red-bg: #F6E7E4;
          --rc-grey: #6B7178;
          --rc-grey-bg: #EAEAE7;

          font-family: 'Inter', sans-serif;
          color: var(--rc-ink);
          background: var(--rc-paper);
          border: 1px solid var(--rc-line);
          border-radius: 8px;
          padding: 28px;
          max-width: 760px;
          margin: 0 auto;
        }

        .rc-files {
          font-size: 12px;
          color: var(--rc-ink-soft);
          margin-bottom: 20px;
          display: flex;
          flex-wrap: wrap;
          gap: 6px 16px;
        }

        .rc-files strong { color: var(--rc-ink); }

        .rc-top-row {
          display: flex;
          flex-wrap: wrap;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid var(--rc-line);
          margin-bottom: 20px;
        }

        .rc-score-block {
          flex: 1;
          min-width: 220px;
        }

        .rc-score-label {
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--rc-ink-soft);
          margin: 0 0 6px;
        }

        .rc-score-value {
          font-size: 34px;
          font-weight: 700;
          margin: 0 0 10px;
        }

        .rc-progress-track {
          width: 100%;
          height: 10px;
          background: var(--rc-grey-bg);
          border-radius: 999px;
          overflow: hidden;
        }

        .rc-progress-fill {
          height: 100%;
          border-radius: 999px;
          transition: width 0.4s ease;
        }

        .rc-bar-green { background: var(--rc-green); }
        .rc-bar-amber { background: var(--rc-amber); }
        .rc-bar-red { background: var(--rc-red); }
        .rc-bar-grey { background: var(--rc-grey); }

        .rc-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
        }

        .rc-badge-green { background: var(--rc-green-bg); color: var(--rc-green); }
        .rc-badge-amber { background: var(--rc-amber-bg); color: var(--rc-amber); }
        .rc-badge-red { background: var(--rc-red-bg); color: var(--rc-red); }
        .rc-badge-grey { background: var(--rc-grey-bg); color: var(--rc-grey); }

        .rc-section { margin-bottom: 22px; }
        .rc-section:last-child { margin-bottom: 0; }

        .rc-section-title {
          font-size: 15.5px;
          font-weight: 700;
          margin: 0 0 10px;
        }

        .rc-summary {
          font-size: 14px;
          line-height: 1.6;
          color: var(--rc-ink);
          margin: 0;
        }

        .rc-list {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .rc-list-item {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 13.5px;
          line-height: 1.5;
          background: #FFFFFF;
          border: 1px solid var(--rc-line);
          border-radius: 6px;
          padding: 10px 12px;
        }

        .rc-list-item svg { flex-shrink: 0; margin-top: 1px; }
        .rc-list-item-warning svg { color: var(--rc-red); }
        .rc-list-item-good svg { color: var(--rc-green); }

        .rc-empty {
          font-size: 13px;
          color: var(--rc-ink-soft);
          font-style: italic;
        }

        @media (max-width: 520px) {
          .rc-card { padding: 20px; }
          .rc-top-row { flex-direction: column; align-items: stretch; }
        }
      `}</style>

      <div className="rc-files">
        <span><strong>Company File:</strong> {company_file || "—"}</span>
        <span><strong>Regulation File:</strong> {regulation_file || "—"}</span>
      </div>

      {(policy_pdf_url || audit_report_url) && (
        <div className="pdf-actions-bar" style={{ marginBottom: "20px" }}>
          {policy_pdf_url && (
            <a
              href={policy_pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="btn btn-primary btn-download"
            >
              Download Improved Policy
            </a>
          )}
          {audit_report_url && (
            <a
              href={audit_report_url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="btn btn-accent btn-download"
            >
              Download Audit Report
            </a>
          )}
        </div>
      )}

      <div className="rc-top-row">
        <div className="rc-score-block">
          <p className="rc-score-label">Compliance Score</p>
          <p className="rc-score-value">{compliance_score ?? "—"}</p>
          <div className="rc-progress-track">
            <div
              className={`rc-progress-fill ${scoreBarClassName(compliance_score)}`}
              style={{ width: `${numericScore}%` }}
            />
          </div>
        </div>

        <div className={`rc-badge ${riskClassName}`}>
          <RiskIcon size={18} strokeWidth={2} />
          {riskLabel}
        </div>
      </div>

      <div className="rc-section">
        <h3 className="rc-section-title">Summary</h3>
        <p className="rc-summary">{summary || "No summary available."}</p>
      </div>

      <div className="rc-section">
        <h3 className="rc-section-title">Missing Requirements</h3>
        {missing_requirements.length > 0 ? (
          <ul className="rc-list">
            {missing_requirements.map((item, index) => (
              <li key={index} className="rc-list-item rc-list-item-warning">
                <AlertTriangle size={16} strokeWidth={2} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rc-empty">None identified.</p>
        )}
      </div>

      <div className="rc-section">
        <h3 className="rc-section-title">Recommendations</h3>
        {recommendations.length > 0 ? (
          <ul className="rc-list">
            {recommendations.map((item, index) => (
              <li key={index} className="rc-list-item rc-list-item-good">
                <CheckCircle2 size={16} strokeWidth={2} />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rc-empty">No specific recommendations provided.</p>
        )}
      </div>

      <div className="rc-section">
        <ClauseImprovements improvedClauses={improved_clauses} />
      </div>

      <div className="rc-section">
        <RevisedPolicyViewer revisedPolicy={revised_policy} />
      </div>
    </div>
  );
}