import React, { useState } from "react";
import {
  FileCheck,
  Download,
  Share2,
  FileText,
  ShieldCheck,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import "./ReportsView.css";

export default function ReportsView({ analysis, auditRef, onDownloadPDF }) {
  const [copiedLink, setCopiedLink] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };


  const score = analysis?.compliance_score !== undefined ? Number(analysis.compliance_score) : 92;
  const risk = analysis?.risk_level || (score >= 80 ? "Low" : score >= 60 ? "Medium" : "High");
  const summaryText =
    analysis?.summary ||
    `The executive compliance analysis reveals an overall score of ${score}% (${risk} Risk). Core operational safeguards are referenced; however, key regulatory controls require formalization in the revised policy addendum.`;


  return (
    <div className="reports-view-root">
      {/* View Header */}
      <div className="reports-header">
        <div>
          <div className="view-badge"><FileCheck size={14} /> Executive Audit Reports & Export Hub</div>
          <h1>Compliance Reports Center</h1>
          <p>Download certified audit PDFs, export executive summaries, or share report links.</p>
        </div>

        <div className="reports-actions-row">
          <button type="button" className="btn-report-ghost" onClick={handleShare}>
            {copiedLink ? <Check size={15} className="text-green" /> : <Share2 size={15} />}
            {copiedLink ? "Link Copied!" : "Share Link"}
          </button>
          <button type="button" className="btn-report-purple" onClick={() => onDownloadPDF("audit_report")}>
            <Download size={15} /> Download Full Audit PDF
          </button>
        </div>

      </div>

      {/* Available Downloads Grid */}
      <div className="download-options-grid">
        <div className="dl-card">
          <div className="dl-icon-box purple">
            <FileText size={22} />
          </div>
          <div className="dl-info">
            <h3>Executive Audit Report PDF</h3>
            <p>Comprehensive gap matrix, compliance score, and regulatory mapping.</p>
            <span className="file-meta font-mono">audit_report_{auditRef || "complyai"}.pdf • 1.4 MB</span>
          </div>
          <button type="button" className="btn-dl-action" onClick={() => onDownloadPDF("audit_report")}>
            <Download size={14} /> Download
          </button>
        </div>

        <div className="dl-card">
          <div className="dl-icon-box blue">
            <ShieldCheck size={22} />
          </div>
          <div className="dl-info">
            <h3>AI Generated Revised Policy PDF</h3>
            <p>Full amended policy document with mandatory regulatory clauses injected.</p>
            <span className="file-meta font-mono">revised_policy_{auditRef || "complyai"}.pdf • 1.1 MB</span>
          </div>
          <button type="button" className="btn-dl-action" onClick={() => onDownloadPDF("improved_policy")}>
            <Download size={14} /> Download
          </button>
        </div>
      </div>

      {/* Formatted Report Preview Card */}
      <div className="report-preview-paper">
        <div className="paper-header">
          <div className="paper-brand">
            <ShieldCheck size={26} className="brand-logo" />
            <div className="brand-text">
              <h2>COMPLYAI EXECUTIVE AUDIT REPORT</h2>
              <span>REF: {auditRef || "COMPLI-2026-X892"} • CONFIDENTIAL</span>
            </div>
          </div>

          <div className="paper-verdict">
            <span className="verdict-score">{score}%</span>
            <span className={`verdict-pill ${risk.toLowerCase()}`}>{risk} Risk</span>
          </div>
        </div>

        <div className="paper-body">
          <section className="paper-section">
            <h4>1. EXECUTIVE SUMMARY</h4>
            <p>{summaryText}</p>
          </section>

          <section className="paper-section">
            <h4>2. AUDIT VERDICT & FRAMEWORK COVERAGE</h4>
            <div className="summary-metrics-grid">
              <div className="sm-box">
                <span className="sm-label">Audit Score</span>
                <span className="sm-val">{score}%</span>
              </div>
              <div className="sm-box">
                <span className="sm-label">Risk Rating</span>
                <span className="sm-val">{risk} Risk</span>
              </div>
              <div className="sm-box">
                <span className="sm-label">Audit Status</span>
                <span className="sm-val text-green">🟢 Audit-Ready</span>
              </div>
              <div className="sm-box">
                <span className="sm-label">Framework</span>
                <span className="sm-val">GDPR / ISO 27001</span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
