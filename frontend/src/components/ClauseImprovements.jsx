import React, { useState, useMemo, useCallback } from "react";
import {
  Sparkles,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  FileCode,
  CheckCircle2,
  HelpCircle,
  Layers,
} from "lucide-react";

/**
 * ClauseImprovements
 *
 * Displays structured AI clause improvements inside expandable, color-coded cards.
 * Robustly handles missing/null/empty inputs.
 *
 * Props:
 *  - improvedClauses: Array<{ issue?: string, reason?: string, original?: string, improved?: string }>
 */
export default function ClauseImprovements({ improvedClauses = [] }) {
  // Normalize items to ensure valid structures
  const normalizedClauses = useMemo(() => {
    if (!Array.isArray(improvedClauses)) return [];
    return improvedClauses.map((item, index) => {
      if (!item || typeof item !== "object") {
        return {
          id: `clause-${index}`,
          issue: String(item || "Unspecified compliance issue"),
          reason: "No explanation provided.",
          original: "N/A - Original text not supplied",
          improved: "N/A - Improved text not supplied",
        };
      }
      return {
        id: `clause-${index}`,
        issue: item.issue || item.problem || "Compliance issue identified",
        reason: item.reason || item.explanation || "Added to address regulatory gap.",
        original: item.original || item.original_clause || "N/A - Missing clause",
        improved: item.improved || item.improved_clause || "N/A - No revised clause provided",
      };
    });
  }, [improvedClauses]);

  // Track expanded state for individual cards. By default, first card or all are expanded.
  const [expandedMap, setExpandedMap] = useState(() => {
    const initial = {};
    normalizedClauses.forEach((_, idx) => {
      initial[idx] = idx < 3; // Expand first 3 by default
    });
    return initial;
  });

  const allExpanded = useMemo(() => {
    if (normalizedClauses.length === 0) return false;
    return normalizedClauses.every((_, idx) => expandedMap[idx]);
  }, [normalizedClauses, expandedMap]);

  const toggleCard = useCallback((index) => {
    setExpandedMap((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }, []);

  const toggleAll = useCallback(() => {
    const nextState = !allExpanded;
    const nextMap = {};
    normalizedClauses.forEach((_, idx) => {
      nextMap[idx] = nextState;
    });
    setExpandedMap(nextMap);
  }, [allExpanded, normalizedClauses]);

  if (normalizedClauses.length === 0) {
    return (
      <div className="result-card clause-improvements-card empty-card">
        <div className="clause-section-header">
          <h3>
            <Sparkles size={18} className="icon-sparkles" aria-hidden="true" />
            AI Clause Improvements
          </h3>
        </div>
        <p className="empty-state-text">
          No clause-level improvements were returned for this analysis. The policy either has no major gaps or requires a full document review.
        </p>
      </div>
    );
  }

  return (
    <div className="result-card clause-improvements-card">
      <div className="clause-section-header">
        <div className="clause-header-title">
          <h3>
            <Sparkles size={18} className="icon-sparkles" aria-hidden="true" />
            AI Clause Improvements
          </h3>
          <span className="clause-count-badge">
            {normalizedClauses.length} Amendment{normalizedClauses.length === 1 ? "" : "s"}
          </span>
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-xs toggle-all-btn"
          onClick={toggleAll}
          aria-label={allExpanded ? "Collapse all clause cards" : "Expand all clause cards"}
        >
          <Layers size={14} aria-hidden="true" />
          {allExpanded ? "Collapse all" : "Expand all"}
        </button>
      </div>

      <div className="clause-accordion-list">
        {normalizedClauses.map((item, index) => {
          const isExpanded = Boolean(expandedMap[index]);
          return (
            <div
              key={item.id}
              className={`clause-item-card ${isExpanded ? "is-expanded" : "is-collapsed"}`}
            >
              <button
                type="button"
                className="clause-card-trigger"
                onClick={() => toggleCard(index)}
                aria-expanded={isExpanded}
              >
                <div className="clause-trigger-left">
                  <span className="clause-number-tag">Clause #{index + 1}</span>
                  <span className="clause-issue-preview">{item.issue}</span>
                </div>
                <div className="clause-trigger-right">
                  <span className="clause-expand-indicator">
                    {isExpanded ? (
                      <ChevronUp size={16} aria-hidden="true" />
                    ) : (
                      <ChevronDown size={16} aria-hidden="true" />
                    )}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="clause-card-content">
                  {/* Issue Explanation */}
                  <div className="clause-detail-block clause-issue-block">
                    <div className="clause-block-label label-issue">
                      <AlertTriangle size={14} aria-hidden="true" />
                      <span>Compliance Issue</span>
                    </div>
                    <p className="clause-block-text">{item.issue}</p>
                  </div>

                  {/* Comparison Grid: Original vs Improved */}
                  <div className="clause-comparison-grid">
                    <div className="clause-comparison-col col-original">
                      <div className="clause-block-label label-original">
                        <FileCode size={14} aria-hidden="true" />
                        <span>Original Clause</span>
                      </div>
                      <div className="clause-text-box box-original">
                        {item.original}
                      </div>
                    </div>

                    <div className="clause-comparison-col col-improved">
                      <div className="clause-block-label label-improved">
                        <CheckCircle2 size={14} aria-hidden="true" />
                        <span>Corrected Policy Clause</span>
                      </div>
                      <div className="clause-text-box box-improved">
                        {item.improved}
                      </div>
                    </div>
                  </div>

                  {/* Reason for Change */}
                  <div className="clause-detail-block clause-reason-block">
                    <div className="clause-block-label label-reason">
                      <HelpCircle size={14} aria-hidden="true" />
                      <span>Reason for Amendment</span>
                    </div>
                    <p className="clause-block-text">{item.reason}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
