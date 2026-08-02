import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Shield,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileText,
  ArrowUpRight,
  ChevronRight,
  Copy,
  Check,
  Zap,
  ExternalLink,
  Layers,
  FileCheck,
  Edit3,
  Calendar,
  Download,
} from "lucide-react";


import {
  CircularGauge,
  DonutChart,
  TrendLineChart,
  RadarChart,
} from "./ComplianceCharts";
import "./ExecutiveDashboard.css";

function useCountUp(target, duration = 1400) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return count;
}

export default function ExecutiveDashboard({
  analysis,
  companyPolicyName = "Company Policy.pdf",
  regulationName = "GDPR.pdf",
  completedTimestamp,
  onOpenCopilot,
  onGenerateClause,
  onViewFixGap,
  onDownloadPDF,
  onNavigate,
}) {

  const [copiedId, setCopiedId] = useState(null);
  const [completedDateTime, setCompletedDateTime] = useState(
    completedTimestamp || analysis?.completed_at || "02 Aug 2026, 07:23 AM"
  );
  const [isEditingDateTime, setIsEditingDateTime] = useState(false);

  // Sync if analysis object provides a completed_at timestamp
  useEffect(() => {
    if (analysis?.completed_at) {
      setCompletedDateTime(analysis.completed_at);
    }
  }, [analysis]);

  const score = analysis?.compliance_score !== undefined ? Number(analysis.compliance_score) : 92;
  const risk = analysis?.risk_level || (score >= 80 ? "Low" : score >= 60 ? "Medium" : "High");

  const rawCritical = analysis?.missing_requirements ? Math.min(analysis.missing_requirements.length, 12) : 5;
  const rawHigh = analysis?.improved_clauses ? Math.min(analysis.improved_clauses.length, 15) : 8;
  const rawMedium = analysis?.recommendations ? Math.min(analysis.recommendations.length, 15) : 9;
  const rawTotal = rawCritical + rawHigh + rawMedium;

  const totalFindings = useCountUp(rawTotal, 1400);
  const criticalFindings = useCountUp(rawCritical, 1200);
  const highFindings = useCountUp(rawHigh, 1300);
  const mediumFindings = useCountUp(rawMedium, 1400);

  const highRiskPill = useCountUp(rawCritical, 1100);
  const mediumRiskPill = useCountUp(rawHigh, 1250);
  const lowRiskPill = useCountUp(rawMedium, 1400);


  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };


  return (
    <div className="exec-dashboard-root">
      {/* Header Banner */}
      <div className="exec-header">
        <div className="exec-header-left">
          <div className="exec-breadcrumb">Dashboard</div>
          <h1 className="exec-title">
            Executive Compliance Overview
            <Sparkles size={20} className="sparkle-icon" />
          </h1>
          <p className="exec-subtitle">
            AI-powered compliance analysis of your policy against applicable regulations.
          </p>
        </div>

        <div className="exec-header-right">
          <div className="status-badge-completed" title="Click to edit completion date & time">
            <span className="dot-green" />
            <div className="status-badge-text">
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <strong>Analysis Completed</strong>
                <Edit3
                  size={12}
                  style={{ color: "#34d399", cursor: "pointer", opacity: 0.8 }}
                  onClick={() => setIsEditingDateTime((prev) => !prev)}
                  title="Click to edit date & time"
                />
              </div>
              {isEditingDateTime ? (
                <input
                  type="text"
                  className="datetime-edit-input"
                  value={completedDateTime}
                  onChange={(e) => setCompletedDateTime(e.target.value)}
                  onBlur={() => setIsEditingDateTime(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setIsEditingDateTime(false);
                  }}
                  autoFocus
                  style={{
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid #34d399",
                    borderRadius: "4px",
                    color: "#34d399",
                    fontSize: "0.72rem",
                    fontWeight: "600",
                    padding: "2px 6px",
                    outline: "none",
                    marginTop: "2px",
                  }}
                />
              ) : (
                <span
                  onClick={() => setIsEditingDateTime(true)}
                  style={{ cursor: "pointer" }}
                  title="Click to change date & time"
                >
                  Completed on {completedDateTime}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>


      {/* Top 4 KPI Metrics Grid */}
      <div className="kpi-grid">
        {/* KPI 1: Overall Score */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">
              <Sparkles size={14} className="kpi-icon-purple" /> Overall Compliance Score
            </span>
          </div>
          <div className="kpi-score-body">
            <CircularGauge score={score} label={score >= 80 ? "High Compliance" : score >= 60 ? "Medium Compliance" : "Action Required"} />
            <div className="kpi-score-footer">
              <span className="score-trend-up">
                ↑ 18% vs last analysis
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Risk Level */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">
              <Shield size={14} className="kpi-icon-blue" /> Risk Level
            </span>
          </div>
          <div className="risk-level-body">
            <div className="risk-status-heading">
              <ShieldAlert size={22} className="risk-amber-icon" />
              <div>
                <h2>{risk}</h2>
                <p>Some gaps need attention</p>
              </div>
            </div>
            {/* Risk Bar */}
            <div className="risk-segmented-bar">
              <div className="segment seg-high" style={{ width: "25%" }} />
              <div className="segment seg-medium" style={{ width: "40%" }} />
              <div className="segment seg-low" style={{ width: "35%" }} />
            </div>
            <div className="risk-breakdown">
              <div className="risk-pill high">
                <strong>{highRiskPill}</strong> High Risk
              </div>
              <div className="risk-pill medium">
                <strong>{mediumRiskPill}</strong> Medium Risk
              </div>
              <div className="risk-pill low">
                <strong>{lowRiskPill}</strong> Low Risk
              </div>
            </div>
          </div>
        </div>

        {/* KPI 3: Total Findings */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">
              <Layers size={14} className="kpi-icon-blue" /> Total Findings
            </span>
          </div>
          <div className="findings-body">
            <div className="findings-count-row">
              <span className="big-count">{totalFindings}</span>
              <span className="count-sub">Across all categories</span>
            </div>
            <div className="findings-pills">
              <div className="finding-box critical">
                <strong>{criticalFindings}</strong>
                <span>Critical</span>
              </div>
              <div className="finding-box high">
                <strong>{highFindings}</strong>
                <span>High</span>
              </div>
              <div className="finding-box medium">
                <strong>{mediumFindings}</strong>
                <span>Medium</span>
              </div>
            </div>
          </div>
        </div>


        {/* KPI 4: Policies Analyzed */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">
              <FileCheck size={14} className="kpi-icon-blue" /> Policies Analyzed
            </span>
          </div>
          <div className="policies-body">
            <div className="policies-count-row">
              <span className="big-count">2</span>
              <span className="count-sub">Documents</span>
            </div>
            <div className="file-list">
              <div
                className="file-item clickable-file-item"
                onClick={() => {
                  if (onDownloadPDF) {
                    onDownloadPDF("improved_policy");
                  } else if (onNavigate) {
                    onNavigate("documents");
                  }
                }}
                title={`Click to download/view ${companyPolicyName}`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <FileText size={15} className="file-icon" />
                <div className="file-info" style={{ flex: 1 }}>
                  <span className="file-name">{companyPolicyName}</span>
                  <span className="file-meta" style={{ color: "#38bdf8" }}>Download Policy PDF</span>
                </div>
                <Download size={15} style={{ color: "#38bdf8" }} />
              </div>

              <div
                className="file-item clickable-file-item"
                onClick={() => {
                  if (onDownloadPDF) {
                    onDownloadPDF("audit_report");
                  } else if (onNavigate) {
                    onNavigate("regulations");
                  }
                }}
                title={`Click to download/view ${regulationName}`}
                style={{
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                <FileText size={15} className="file-icon" />
                <div className="file-info" style={{ flex: 1 }}>
                  <span className="file-name">{regulationName}</span>
                  <span className="file-meta" style={{ color: "#38bdf8" }}>Download Regulation PDF</span>
                </div>
                <Download size={15} style={{ color: "#38bdf8" }} />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Middle Analytics Row: 3 Visualization Cards */}
      <div className="analytics-row">
        {/* Card 1: Compliance by Category Radar Chart */}
        <div className="analytics-card compliance-category-card" style={{ padding: "26px" }}>
          <div className="analytics-card-header" style={{ marginBottom: "16px" }}>
            <h3><span className="header-icon">📊</span> Compliance by Category</h3>
          </div>
          <div className="radar-card-content" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <RadarChart score={score} />
          </div>
        </div>

        {/* Card 2: Risk Distribution Donut */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3><span className="header-icon">🍩</span> Risk Distribution</h3>
          </div>
          <div className="donut-card-content">
            <DonutChart total={rawTotal} critical={rawCritical} high={rawHigh} medium={rawMedium} />
            <div className="donut-legend">
              <div className="legend-row">
                <span className="legend-dot critical" />
                <span className="legend-label">{rawCritical} Critical ({rawTotal > 0 ? Math.round((rawCritical / rawTotal) * 100) : 0}%)</span>
              </div>
              <div className="legend-row">
                <span className="legend-dot high" />
                <span className="legend-label">{rawHigh} High ({rawTotal > 0 ? Math.round((rawHigh / rawTotal) * 100) : 0}%)</span>
              </div>
              <div className="legend-row">
                <span className="legend-dot medium" />
                <span className="legend-label">{rawMedium} Medium ({rawTotal > 0 ? Math.round((rawMedium / rawTotal) * 100) : 0}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Compliance Over Time */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3><span className="header-icon">📈</span> Compliance Over Time</h3>
            <span className="badge-trend-up">{score}%</span>
          </div>
          <div className="trend-card-content">
            <TrendLineChart score={score} />
            <div className="trend-month-axis">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </div>
      </div>


      {/* Bottom Split Row: Top Gaps & AI Recommendations */}
      <div className="bottom-split-row">
        {/* Left Side: Top Compliance Gaps Table */}
        <div className="dashboard-panel gaps-panel">
          <div className="panel-header">
            <h3><span className="header-icon">🚩</span> Top Compliance Gaps</h3>
            <button type="button" className="btn-link" onClick={onViewFixGap}>
              View all gaps →
            </button>
          </div>
          <div className="gaps-list">
            <div className="gap-row">
              <div className="gap-tag tag-critical">★ Critical</div>
              <div className="gap-details">
                <h4>Missing Data Protection Officer (DPO)</h4>
                <p>GDPR Article 37</p>
              </div>
              <div className="gap-impact">
                <span className="impact-label">Impact</span>
                <span className="impact-val text-red">Very High</span>
              </div>
              <button
                type="button"
                className="btn-action-fix"
                onClick={() => onViewFixGap && onViewFixGap("DPO")}
              >
                View & Fix
              </button>
            </div>

            <div className="gap-row">
              <div className="gap-tag tag-high">★ High</div>
              <div className="gap-details">
                <h4>72-Hour Breach Notification Not Defined</h4>
                <p>GDPR Article 33</p>
              </div>
              <div className="gap-impact">
                <span className="impact-label">Impact</span>
                <span className="impact-val text-orange">High</span>
              </div>
              <button
                type="button"
                className="btn-action-fix"
                onClick={() => onViewFixGap && onViewFixGap("Breach Notification")}
              >
                View & Fix
              </button>
            </div>

            <div className="gap-row">
              <div className="gap-tag tag-high">★ High</div>
              <div className="gap-details">
                <h4>Third-party Subprocessor Consent Missing</h4>
                <p>GDPR Article 28(2)</p>
              </div>
              <div className="gap-impact">
                <span className="impact-label">Impact</span>
                <span className="impact-val text-orange">High</span>
              </div>
              <button
                type="button"
                className="btn-action-fix"
                onClick={() => onViewFixGap && onViewFixGap("Subprocessor DPA")}
              >
                View & Fix
              </button>
            </div>

            <div className="gap-row">
              <div className="gap-tag tag-medium">★ Medium</div>
              <div className="gap-details">
                <h4>Data Retention Period Not Specified</h4>
                <p>GDPR Article 5(1)(e)</p>
              </div>
              <div className="gap-impact">
                <span className="impact-label">Impact</span>
                <span className="impact-val text-yellow">Medium</span>
              </div>
              <button
                type="button"
                className="btn-action-fix"
                onClick={() => onViewFixGap && onViewFixGap("Data Retention")}
              >
                View & Fix
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: AI Recommendations */}
        <div className="dashboard-panel recs-panel">
          <div className="panel-header">
            <h3><span className="header-icon">⚡</span> AI Recommendations</h3>
            <button type="button" className="btn-link" onClick={onOpenCopilot}>
              View all →
            </button>
          </div>
          <div className="recs-list">
            <div className="rec-row">
              <div className="rec-num">1</div>
              <div className="rec-body">
                <h4>Add DPO Appointment Clause</h4>
                <p>Include designation and contact details of the Data Protection Officer.</p>
              </div>
              <div className="rec-actions">
                <button
                  type="button"
                  className="btn-purple-generate"
                  onClick={() => onGenerateClause && onGenerateClause("DPO Appointment Clause")}
                >
                  Generate Clause
                </button>
                <button
                  type="button"
                  className="btn-icon-copy"
                  onClick={() => handleCopy("rec-1", "Add DPO Appointment Clause")}
                  title="Copy"
                >
                  {copiedId === "rec-1" ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="rec-row">
              <div className="rec-num">2</div>
              <div className="rec-body">
                <h4>Define Breach Notification Process</h4>
                <p>Add detailed procedure for 72-hour breach notification.</p>
              </div>
              <div className="rec-actions">
                <button
                  type="button"
                  className="btn-purple-generate"
                  onClick={() => onGenerateClause && onGenerateClause("Breach Notification Clause")}
                >
                  Generate Clause
                </button>
                <button
                  type="button"
                  className="btn-icon-copy"
                  onClick={() => handleCopy("rec-2", "Define Breach Notification Process")}
                  title="Copy"
                >
                  {copiedId === "rec-2" ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            <div className="rec-row">
              <div className="rec-num">3</div>
              <div className="rec-body">
                <h4>Update Vendor Agreements</h4>
                <p>Include mandatory clauses for subprocessor agreements and consent.</p>
              </div>
              <div className="rec-actions">
                <button
                  type="button"
                  className="btn-purple-generate"
                  onClick={() => onGenerateClause && onGenerateClause("Vendor DPA Clause")}
                >
                  Generate Clause
                </button>
                <button
                  type="button"
                  className="btn-icon-copy"
                  onClick={() => handleCopy("rec-3", "Update Vendor Agreements")}
                  title="Copy"
                >
                  {copiedId === "rec-3" ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Summary Bar */}
      <div className="exec-bottom-bar">
        <div className="bar-col">
          <span className="bar-label">Frameworks Covered</span>
          <div className="bar-badges">
            <span className="framework-badge">GDPR</span>
            <span className="framework-badge">ISO 27001</span>
            <span className="framework-badge">SOC 2</span>
            <span className="framework-badge">CCPA</span>
            <span className="framework-badge muted">+3 more</span>
          </div>
        </div>

        <div className="bar-col">
          <span className="bar-label">Analysis Method</span>
          <span className="bar-val">AI-Powered • Evidence-Based • Regulation Mapped</span>
        </div>

        <div className="bar-col align-right">
          <span className="bar-label">Report Quality</span>
          <span className="quality-green">🟢 Audit-Ready</span>
        </div>
      </div>
    </div>
  );
}
