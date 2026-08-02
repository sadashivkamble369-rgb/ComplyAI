import React, { useState } from "react";
import {
  Sparkles,
  Zap,
  CheckCircle2,
  Copy,
  Check,
  ArrowRight,
  Shield,
  FileCode,
  Wand2,
} from "lucide-react";
import "./RecommendationsView.css";

export default function RecommendationsView({ analysis, onGenerateClause }) {
  const [copiedId, setCopiedId] = useState(null);
  const [generatedClauseMap, setGeneratedClauseMap] = useState({});

  const recommendations = analysis?.recommendations || [
    "Priority 1: Formally amend policy to mandate Data Protection Officer (DPO) designation under GDPR Article 37.",
    "Priority 2: Implement mandatory 72-hour security incident disclosure escalation procedure.",
    "Priority 3: Update third-party vendor agreements to require explicit subprocessors Data Processing Agreements (DPA).",
    "Priority 4: Conduct quarterly Data Protection Impact Assessments (DPIA) for high-risk processing operations.",
  ];

  const clauseImprovements = analysis?.clause_improvements || [];

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSynthesizeClause = (idx, recText) => {
    const syntheticClause = `Mandatory Compliance Clause Addendum (${recText.split(":")[0]}):\n"In strict compliance with applicable regulatory mandates, the Organization shall enforce ${recText.toLowerCase()} with 24/7 logging, mandatory DPO oversight, and automated SLA tracking."`;
    setGeneratedClauseMap((prev) => ({ ...prev, [idx]: syntheticClause }));
  };

  return (
    <div className="recs-view-root">
      {/* View Header */}
      <div className="recs-header">
        <div>
          <div className="view-badge"><Sparkles size={14} /> AI Remediation & Clause Synthesizer</div>
          <h1>Actionable Recommendations</h1>
          <p>Prioritized compliance roadmap and one-click AI clause generation.</p>
        </div>

        <div className="header-total-pill">
          <strong>{recommendations.length} Priority Remediation Tasks</strong>
        </div>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="recs-grid">
        {recommendations.map((rec, idx) => {
          const generated = generatedClauseMap[idx];
          return (
            <div key={idx} className="rec-card-full">
              <div className="rec-card-header">
                <div className="rec-badge-number">{idx + 1}</div>
                <div className="rec-title-wrap">
                  <h3>Priority {idx + 1} Remediation Action</h3>
                  <p>{rec}</p>
                </div>
              </div>

              {generated ? (
                <div className="generated-clause-box">
                  <div className="gbox-header">
                    <span className="gbox-tag"><Wand2 size={13} /> AI Generated Compliant Clause</span>
                    <button
                      type="button"
                      className="btn-copy-sm"
                      onClick={() => handleCopy(`gen-${idx}`, generated)}
                    >
                      {copiedId === `gen-${idx}` ? <Check size={14} className="text-green" /> : <Copy size={14} />}
                      {copiedId === `gen-${idx}` ? "Copied" : "Copy Clause"}
                    </button>
                  </div>
                  <pre className="clause-code">{generated}</pre>
                </div>
              ) : (
                <div className="rec-card-actions">
                  <button
                    type="button"
                    className="btn-synthesize-purple"
                    onClick={() => handleSynthesizeClause(idx, rec)}
                  >
                    <Wand2 size={15} /> Synthesize Compliant Clause
                  </button>
                  <button
                    type="button"
                    className="btn-copy-outline"
                    onClick={() => handleCopy(`rec-${idx}`, rec)}
                  >
                    {copiedId === `rec-${idx}` ? <Check size={14} /> : <Copy size={14} />}
                    {copiedId === `rec-${idx}` ? "Copied" : "Copy Task"}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Clause Improvements Table */}
      {clauseImprovements.length > 0 && (
        <div className="clause-improvements-section">
          <h3><FileCode size={18} className="icon-purple" /> AI Clause Improvements Comparison</h3>
          <div className="improvements-list">
            {clauseImprovements.map((imp, idx) => (
              <div key={idx} className="imp-row">
                <div className="imp-header">
                  <strong>{imp.section}</strong>
                  <span className="tag-gap">{imp.gap}</span>
                </div>
                <div className="imp-comparison">
                  <div className="comp-box original">
                    <span className="lbl">Original Clause:</span>
                    <p>"{imp.original_clause}"</p>
                  </div>
                  <div className="comp-box revised">
                    <span className="lbl text-purple">Revised Compliant Clause:</span>
                    <p>"{imp.revised_clause}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
