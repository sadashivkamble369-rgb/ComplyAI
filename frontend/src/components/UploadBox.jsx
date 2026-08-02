import React, { useRef, useState } from "react";
import { UploadCloud, FileText, Loader2, ShieldCheck, AlertCircle } from "lucide-react";
 
function PdfField({ exhibitLabel, title, file, onFileSelected, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
 
  const acceptFile = (candidate) => {
    if (!candidate) return;
    const isPdf = candidate.type === "application/pdf" || candidate.name.toLowerCase().endsWith(".pdf");
    if (isPdf) {
      onFileSelected(candidate);
    }
  };

 
  return (
    <div
      className={`ub-dropzone ${isDragging ? "ub-dropzone-active" : ""} ${
        error ? "ub-dropzone-error" : ""
      }`}
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        acceptFile(e.dataTransfer.files?.[0]);
      }}
    >
      <span className="ub-exhibit-tab">{exhibitLabel}</span>
 
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="ub-hidden-input"
        onChange={(e) => acceptFile(e.target.files?.[0])}
      />
 
      {file ? (
        <div className="ub-file-chip">
          <FileText size={20} strokeWidth={1.75} />
          <div className="ub-file-chip-text">
            <span className="ub-file-name">{file.name}</span>
            <span className="ub-file-size">{(file.size / 1024).toFixed(0)} KB attached</span>
          </div>
        </div>
      ) : (
        <div className="ub-dropzone-empty">
          <UploadCloud size={26} strokeWidth={1.5} />
          <p className="ub-dropzone-title">{title}</p>
          <p className="ub-dropzone-hint">PDF only — drop file or click to browse</p>
        </div>
      )}
 
      {error && (
        <div className="ub-field-error">
          <AlertCircle size={13} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
 
export default function UploadBox({ loading, onAnalyze }) {
  const [companyFile, setCompanyFile] = useState(null);
  const [regulationFile, setRegulationFile] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
 
  const handleCompanyFile = (file) => {
    setCompanyFile(file);
    setValidationErrors((prev) => ({ ...prev, company: null }));
  };
 
  const handleRegulationFile = (file) => {
    setRegulationFile(file);
    setValidationErrors((prev) => ({ ...prev, regulation: null }));
  };
 
  const handleAnalyzeClick = () => {
    const errors = {};
    if (!companyFile) errors.company = "Company Policy PDF is required.";
    if (!regulationFile) errors.regulation = "Regulation PDF is required.";
 
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
 
    onAnalyze(companyFile, regulationFile);
  };
 
  const canAnalyze = companyFile && regulationFile && !loading;
 
  return (
    <div className="ub-card">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zilla+Slab:wght@600;700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@500;600&display=swap');
 
        .ub-card {
          --ub-paper: #F2F4EE;
          --ub-ink: #1C2A3A;
          --ub-ink-soft: #4B5A6B;
          --ub-brass: #A9812F;
          --ub-brass-soft: #D9C48C;
          --ub-line: #C7CDBD;
          --ub-green: #2F6F4E;
          --ub-red: #A03227;
          --ub-grey: #6B7178;
 
          font-family: 'Inter', sans-serif;
          color: var(--ub-ink);
          background: var(--ub-paper);
          border: 1px solid var(--ub-line);
          border-radius: 6px;
          padding: 28px;
          max-width: 720px;
          margin: 0 auto;
          box-shadow: 0 1px 0 rgba(28,42,58,0.04);
        }
 
        .ub-title {
          font-family: 'Zilla Slab', serif;
          font-weight: 700;
          font-size: 22px;
          margin: 0 0 20px;
          border-bottom: 3px solid var(--ub-ink);
          padding-bottom: 12px;
        }
 
        .ub-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 18px;
        }
 
        @media (max-width: 640px) {
          .ub-grid { grid-template-columns: 1fr; }
          .ub-card { padding: 20px; }
        }
 
        .ub-dropzone {
          position: relative;
          background: #FFFFFF;
          border: 2px dashed var(--ub-brass-soft);
          border-radius: 4px;
          padding: 26px 18px 20px;
          min-height: 148px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: border-color 0.15s ease, background 0.15s ease;
        }
 
        .ub-dropzone:hover { border-color: var(--ub-brass); }
 
        .ub-dropzone-active {
          border-color: var(--ub-green);
          background: #EAF1EA;
        }
 
        .ub-dropzone-error { border-color: var(--ub-red); }
 
        .ub-exhibit-tab {
          position: absolute;
          top: -13px;
          left: 16px;
          background: var(--ub-ink);
          color: var(--ub-paper);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          padding: 4px 9px;
          border-radius: 2px;
        }
 
        .ub-hidden-input { display: none; }
 
        .ub-dropzone-empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          color: var(--ub-ink-soft);
          text-align: center;
        }
 
        .ub-dropzone-title {
          font-weight: 600;
          color: var(--ub-ink);
          margin: 2px 0 0;
          font-size: 14.5px;
        }
 
        .ub-dropzone-hint {
          font-size: 12px;
          margin: 0;
        }
 
        .ub-file-chip {
          display: flex;
          align-items: center;
          gap: 10px;
          color: var(--ub-ink);
        }
 
        .ub-file-chip-text { display: flex; flex-direction: column; }
        .ub-file-name { font-weight: 600; font-size: 13.5px; word-break: break-all; }
        .ub-file-size {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 10.5px;
          color: var(--ub-ink-soft);
        }
 
        .ub-field-error {
          position: absolute;
          bottom: -22px;
          left: 2px;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          color: var(--ub-red);
        }
 
        .ub-submit-row {
          margin-top: 34px;
          display: flex;
          justify-content: center;
        }
 
        .ub-submit-btn {
          width: 100%;
          font-family: 'IBM Plex Mono', monospace;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          font-size: 14px;
          font-weight: 600;
          color: var(--ub-paper);
          background: var(--ub-ink);
          border: none;
          padding: 16px 32px;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 0.15s ease, transform 0.1s ease;
        }
 
        .ub-submit-btn:disabled {
          background: var(--ub-grey);
          cursor: not-allowed;
        }
 
        .ub-submit-btn:not(:disabled):hover {
          background: var(--ub-brass);
          transform: translateY(-1px);
        }
 
        .ub-spin { animation: ub-rotate 0.9s linear infinite; }
 
        @keyframes ub-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
 
      <h2 className="ub-title">Upload Documents</h2>
 
      <div className="ub-grid">
        <PdfField
          exhibitLabel="Exhibit A"
          title="Company Policy PDF"
          file={companyFile}
          onFileSelected={handleCompanyFile}
          error={validationErrors.company}
        />
        <PdfField
          exhibitLabel="Exhibit B"
          title="Regulation PDF"
          file={regulationFile}
          onFileSelected={handleRegulationFile}
          error={validationErrors.regulation}
        />
      </div>
 
      <div className="ub-submit-row">
        <button
          className="ub-submit-btn"
          disabled={!canAnalyze}
          onClick={handleAnalyzeClick}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="ub-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <ShieldCheck size={20} />
              Analyze Documents
            </>
          )}
        </button>
      </div>
    </div>
  );
}