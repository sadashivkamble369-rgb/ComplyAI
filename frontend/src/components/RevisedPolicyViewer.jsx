import React, { useState, useMemo, useCallback, useRef } from "react";
import {
  FileText,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  ShieldCheck,
  Download,
  Printer,
  FileCheck,
} from "lucide-react";

/**
 * Parses raw text into structured policy paragraphs and headings.
 * Preserves numbered headings, section titles, and list items.
 * Keeping this structured data internally makes export to PDF/DOCX/Print seamless.
 *
 * @param {string} rawText
 * @returns {Array<{ id: string, type: 'heading' | 'subheading' | 'paragraph', content: string, number?: string }>}
 */
function parsePolicyText(rawText) {
  if (!rawText || typeof rawText !== "string") return [];

  const lines = rawText.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  const headingRegex = /^(?:ARTICLE|SECTION|\d+(?:\.\d+)*\.?)\s+/i;
  const majorHeadingRegex = /^(?:[A-Z0-9\s.,\-\:\(\)]{4,80})$/; // ALL CAPS titles

  return lines.map((line, index) => {
    let type = "paragraph";
    let numberMatch = line.match(/^(\d+(?:\.\d+)*|\b[A-Z0-9]+\b(?=\.|\s))/);

    if (headingRegex.test(line)) {
      type = line.split(".").length > 2 ? "subheading" : "heading";
    } else if (line.length < 90 && majorHeadingRegex.test(line) && !line.endsWith(".")) {
      type = "heading";
    }

    return {
      id: `p-${index}`,
      type,
      content: line,
      number: numberMatch ? numberMatch[1] : undefined,
    };
  });
}

/**
 * RevisedPolicyViewer
 *
 * Displays the complete AI-generated revised policy in a formal white-paper legal document view.
 * Features copy-to-clipboard, expand/collapse view height, and lazy rendering for large policies.
 *
 * Props:
 *  - revisedPolicy: string
 *  - auditRef: string
 */
export default function RevisedPolicyViewer({ revisedPolicy = "", auditRef = "AUD-8821" }) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [visibleLimit, setVisibleLimit] = useState(60); // Progressive rendering limit for large documents

  const copyTimeoutRef = useRef(null);

  // Structured representation of the document for rendering and future PDF export
  const parsedSections = useMemo(() => {
    return parsePolicyText(revisedPolicy);
  }, [revisedPolicy]);

  const totalSections = parsedSections.length;
  const visibleSections = useMemo(() => {
    if (isExpanded) return parsedSections;
    return parsedSections.slice(0, visibleLimit);
  }, [parsedSections, isExpanded, visibleLimit]);

  const handleCopy = useCallback(async () => {
    if (!revisedPolicy) return;
    try {
      await navigator.clipboard.writeText(revisedPolicy);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2200);
    } catch (err) {
      console.error("Failed to copy policy text: ", err);
    }
  }, [revisedPolicy]);

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const loadMoreSections = useCallback(() => {
    setVisibleLimit((prev) => Math.min(prev + 50, totalSections));
  }, [totalSections]);

  if (!revisedPolicy || !revisedPolicy.trim()) {
    return (
      <div className="result-card revised-policy-card empty-card">
        <div className="policy-card-header">
          <h3>
            <FileText size={18} className="icon-policy" aria-hidden="true" />
            AI Generated Revised Policy
          </h3>
        </div>
        <p className="empty-state-text">
          No revised policy document was generated for this audit.
        </p>
      </div>
    );
  }

  return (
    <div className="result-card revised-policy-card">
      {/* Action Toolbar */}
      <div className="policy-card-header">
        <div className="policy-header-title">
          <h3>
            <FileText size={18} className="icon-policy" aria-hidden="true" />
            AI Generated Revised Policy
          </h3>
          <span className="policy-status-badge">
            <ShieldCheck size={13} aria-hidden="true" /> Audit-Ready Draft
          </span>
        </div>

        <div className="policy-toolbar-actions">
          <button
            type="button"
            className={`btn ${copied ? "btn-success" : "btn-secondary"} btn-xs`}
            onClick={handleCopy}
            title="Copy full revised policy text to clipboard"
          >
            {copied ? (
              <>
                <Check size={14} aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Copy size={14} aria-hidden="true" />
                Copy Policy
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-xs"
            onClick={toggleExpand}
            title={isExpanded ? "Collapse document view" : "Expand document view"}
          >
            {isExpanded ? (
              <>
                <Minimize2 size={14} aria-hidden="true" />
                Compact View
              </>
            ) : (
              <>
                <Maximize2 size={14} aria-hidden="true" />
                Expand View
              </>
            )}
          </button>
        </div>
      </div>

      {/* Official White Legal Document Paper View */}
      <div className={`policy-viewer-container ${isExpanded ? "is-expanded-view" : "is-compact-view"}`}>
        <div className="policy-document-sheet" data-policy-export="true">
          {/* Document Header Watermark */}
          <div className="policy-doc-header">
            <div className="policy-doc-brand">
              <FileCheck size={20} className="doc-brand-icon" aria-hidden="true" />
              <div>
                <span className="doc-title-main">COMPLIANCE-READY REVISED POLICY</span>
                <span className="doc-subtitle">COMPLYAI ENGINE • AUTOMATED LEGAL REWRITE</span>
              </div>
            </div>
            <div className="policy-doc-meta">
              <span>Ref: <strong>{auditRef}</strong></span>
              <span>Status: <strong className="status-compliant">Compliant Draft</strong></span>
            </div>
          </div>

          <hr className="doc-divider" />

          {/* Structured Document Body */}
          <div className="policy-doc-body">
            {visibleSections.map((item) => {
              if (item.type === "heading") {
                return (
                  <h3 key={item.id} className="legal-heading-main">
                    {item.content}
                  </h3>
                );
              }
              if (item.type === "subheading") {
                return (
                  <h4 key={item.id} className="legal-heading-sub">
                    {item.content}
                  </h4>
                );
              }
              return (
                <p key={item.id} className="legal-paragraph">
                  {item.content}
                </p>
              );
            })}

            {!isExpanded && visibleLimit < totalSections && (
              <div className="lazy-load-bar">
                <span>Showing {visibleLimit} of {totalSections} sections</span>
                <button type="button" className="btn btn-ghost btn-xs" onClick={loadMoreSections}>
                  Load remaining sections
                </button>
              </div>
            )}
          </div>

          {/* Document Footer */}
          <div className="policy-doc-footer">
            <span>CONFIDENTIAL & PROPRIETARY — PREPARED FOR CORPORATE COMPLIANCE AUDIT</span>
            <span>PAGE 1 OF 1 (DIGITAL DRAFT)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
