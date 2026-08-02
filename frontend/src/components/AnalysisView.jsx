import React, { useState } from "react";
import {
  Search,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Filter,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import "./AnalysisView.css";

export default function AnalysisView({ analysis, onViewFixGap }) {
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const score = analysis?.compliance_score !== undefined ? Number(analysis.compliance_score) : 92;
  const risk = analysis?.risk_level || (score >= 80 ? "Low" : score >= 60 ? "Medium" : "High");

  const missingReqs = analysis?.missing_requirements || [
    "Missing explicit clause for Data Protection Officer (DPO) under GDPR Article 37.",
    "72-Hour Security Incident & Breach Disclosure SLA not defined.",
    "Third-Party Subprocessor DPA consent requirement omitted.",
    "Data retention and erasure schedule timeframe unspecified.",
  ];

  const clauseGaps = analysis?.clause_improvements || [
    {
      section: "Section 4.1 — Incident Management",
      original_clause: "Security incidents will be reported to IT management in a reasonable timeframe.",
      status: "Non-Compliant",
      gap: "Lacks 72-hour mandatory supervisory authority notification requirement.",
      revised_clause: "In the event of a personal data breach, the Organization shall notify the relevant Supervisory Authority without undue delay and, where feasible, not later than 72 hours after having become aware of it.",
    },
    {
      section: "Section 7.3 — Data Subject Rights",
      original_clause: "Users may request information regarding stored data by contacting support.",
      status: "Weak",
      gap: "Does not specify right to erasure, data portability, or 30-day response window.",
      revised_clause: "Data subjects hold the right to access, rectify, port, and request immediate erasure of personal data within 30 calendar days of request submission without fee.",
    },
    {
      section: "Section 9.0 — Vendor Risk Management",
      original_clause: "Third-party vendors should adhere to standard industry security standards.",
      status: "Non-Compliant",
      gap: "Does not mandate legally binding Data Processing Agreements (DPA) or subprocessor notification.",
      revised_clause: "All third-party vendors processing personal data must execute a binding Data Processing Agreement (DPA) subject to regular compliance audits.",
    },
  ];

  const filteredGaps = clauseGaps.filter((item) => {
    const matchesSev =
      filterSeverity === "all" ||
      (filterSeverity === "non-compliant" && item.status.toLowerCase().includes("non")) ||
      (filterSeverity === "weak" && item.status.toLowerCase().includes("weak"));
    const matchesSearch =
      item.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.gap.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesSearch;
  });

  return (
    <div className="analysis-view-root">
      {/* View Header */}
      <div className="analysis-header">
        <div>
          <div className="view-badge"><Search size={14} /> Audit & Risk Analysis Engine</div>
          <h1>Deep Compliance Gap Analysis</h1>
          <p>Clause-by-clause regulatory risk breakdown and gap severity matrix.</p>
        </div>

        <div className="header-score-card">
          <span className="score-num">{score}%</span>
          <div className="score-meta">
            <strong>{risk} Risk Verdict</strong>
            <span>Based on 10 Regulatory Controls</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="analysis-filter-bar">
        <div className="filter-search-input">
          <Search size={15} className="icon-search" />
          <input
            type="text"
            placeholder="Search gaps, clauses, or sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-buttons">
          <button
            type="button"
            className={`btn-filter ${filterSeverity === "all" ? "active" : ""}`}
            onClick={() => setFilterSeverity("all")}
          >
            All Findings ({clauseGaps.length})
          </button>
          <button
            type="button"
            className={`btn-filter filter-critical ${filterSeverity === "non-compliant" ? "active" : ""}`}
            onClick={() => setFilterSeverity("non-compliant")}
          >
            Non-Compliant
          </button>
          <button
            type="button"
            className={`btn-filter filter-weak ${filterSeverity === "weak" ? "active" : ""}`}
            onClick={() => setFilterSeverity("weak")}
          >
            Weak / Incomplete
          </button>
        </div>
      </div>

      {/* Missing Regulatory Requirements Cards */}
      <div className="analysis-missing-card">
        <h3><ShieldAlert size={18} className="icon-red" /> Identified Regulatory Violations</h3>
        <div className="missing-list">
          {missingReqs.map((req, idx) => (
            <div key={idx} className="missing-item">
              <span className="missing-bullet">•</span>
              <p>{req}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Clause Gap Analysis Matrix Table */}
      <div className="analysis-matrix-card">
        <h3><Layers size={18} className="icon-purple" /> Clause-Level Inspection Matrix</h3>
        <div className="matrix-list">
          {filteredGaps.map((item, idx) => (
            <div key={idx} className="matrix-row">
              <div className="row-header">
                <span className="section-title">{item.section}</span>
                <span className={`status-tag ${item.status.toLowerCase().includes("non") ? "tag-red" : "tag-amber"}`}>
                  {item.status}
                </span>
              </div>

              <div className="row-body">
                <div className="clause-box orig">
                  <strong>Original Policy Extract:</strong>
                  <p>"{item.original_clause}"</p>
                </div>
                <div className="clause-box gap">
                  <strong>Regulatory Gap Identified:</strong>
                  <p>{item.gap}</p>
                </div>
              </div>

              <div className="row-footer">
                <div className="revised-clause-preview">
                  <strong>Suggested Fix:</strong>
                  <span>{item.revised_clause}</span>
                </div>
                <button
                  type="button"
                  className="btn-fix-gap"
                  onClick={() => onViewFixGap && onViewFixGap(item.section)}
                >
                  Apply Fix <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
