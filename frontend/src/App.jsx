import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import axios from "axios";
import LoginPage from "./components/LoginPage";

import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Upload,
  FileText,
  FileCheck2,
  X,
  ArrowRight,
  Loader2,
  CheckCircle2,
  ScanText,
  GitCompare,
  SearchX,
  Lightbulb,
  Gauge,
  AlertTriangle,
  Clock,
  Zap,
  RefreshCw,
  Activity,
  BadgeCheck,
  CircleAlert,
  Info,
  ScrollText,
  Building2,
  Briefcase,
  Globe,
  MapPin,
  Users,
  Layers,
  Calendar,
  ChevronDown,
  Search,
  Check,
} from "lucide-react";

const LinkedInIcon = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88Z" />
  </svg>
);


import Navbar from "./components/Navbar";
import SidebarNav from "./components/SidebarNav";
import TopHeader from "./components/TopHeader";
import ExecutiveDashboard from "./components/ExecutiveDashboard";
import AnalysisView from "./components/AnalysisView";
import ReportsView from "./components/ReportsView";
import RecommendationsView from "./components/RecommendationsView";
import ClauseImprovements from "./components/ClauseImprovements";
import RevisedPolicyViewer from "./components/RevisedPolicyViewer";
import AIAssistant from "./components/AIAssistant";
import UpgradeModal from "./components/UpgradeModal";
import "./App.css";






/* ==================================================
   BACKEND CONTRACT — DO NOT MODIFY
================================================== */
const API_ENDPOINT = "http://127.0.0.1:8000/analyze";

/* ==================================================
   STATIC CONTENT
================================================== */
const STATS = [
  { id: "accuracy", value: 99.4, suffix: "%", label: "Detection accuracy", icon: BadgeCheck },
  { id: "regulations", value: 500, suffix: "+", label: "Regulations indexed", icon: ScrollText },
  { id: "speed", value: 12, suffix: "s", label: "Average analysis time", icon: Zap },
  { id: "enterprise", value: 100, suffix: "%", label: "Enterprise ready", icon: Building2 },
];

const FEATURES = [
  {
    id: "clause",
    icon: ScanText,
    title: "Clause-level extraction",
    description:
      "Every obligation, definition, and cross-reference is parsed and structured before a single comparison is made.",
  },
  {
    id: "matching",
    icon: GitCompare,
    title: "Semantic matching engine",
    description:
      "Policy language is mapped against regulatory intent, not just keywords — catching paraphrased and reworded clauses.",
  },
  {
    id: "gaps",
    icon: SearchX,
    title: "Automated gap detection",
    description:
      "Missing, weakened, or outdated obligations are surfaced instantly, ranked by exposure to regulatory risk.",
  },
  {
    id: "audit",
    icon: ShieldCheck,
    title: "Audit-ready reporting",
    description:
      "Every finding ships with a reference identifier and evidentiary trail your legal and compliance teams can defend.",
  },
];

const PROCESSING_STAGES = [
  { id: "parsing", label: "Document parsing", detail: "Reading structure, pages, and clauses", icon: FileText },
  { id: "extraction", label: "Clause extraction", detail: "Isolating obligations and definitions", icon: ScanText },
  { id: "matching", label: "Semantic matching", detail: "Aligning policy language to regulation intent", icon: GitCompare },
  { id: "gaps", label: "Gap detection", detail: "Flagging unmet or weakened requirements", icon: SearchX },
  { id: "risk", label: "Risk classification", detail: "Scoring exposure by severity", icon: ShieldAlert },
  { id: "recommendations", label: "Recommendation generation", detail: "Drafting remediation guidance", icon: Lightbulb },
  { id: "confidence", label: "Confidence estimation", detail: "Calibrating the final audit score", icon: Gauge },
];

const INDUSTRIES = [
  "Healthcare",
  "Banking",
  "Finance",
  "Insurance",
  "Manufacturing",
  "Automotive",
  "Pharmaceuticals",
  "Technology",
  "SaaS",
  "Retail",
  "E-Commerce",
  "Telecom",
  "Energy",
  "Oil & Gas",
  "Education",
  "Government",
  "Logistics",
  "Food & Beverage",
  "Aviation",
  "Construction",
  "Other",
];

const COUNTRIES = [
  "United States",
  "India",
  "United Kingdom",
  "Germany",
  "France",
  "Canada",
  "Australia",
  "Singapore",
  "Japan",
  "United Arab Emirates",
  "Saudi Arabia",
  "Netherlands",
  "Switzerland",
  "Ireland",
  "Sweden",
  "Spain",
  "Italy",
  "Brazil",
  "Mexico",
  "South Africa",
  "China",
  "South Korea",
  "Indonesia",
  "New Zealand",
  "Israel",
  "Qatar",
  "Kuwait",
  "Egypt",
  "Nigeria",
  "Kenya",
  "Poland",
  "Belgium",
  "Austria",
  "Denmark",
  "Norway",
  "Finland",
  "Portugal",
  "Malaysia",
  "Thailand",
  "Vietnam",
  "Philippines",
  "Hong Kong",
  "Other",
];

const COMPANY_SIZES = [
  { id: "startup", label: "Startup (1-50)" },
  { id: "small", label: "Small Business (51-200)" },
  { id: "mid", label: "Mid Market (201-1000)" },
  { id: "enterprise", label: "Enterprise (1000+)" },
];

const COMPLIANCE_FRAMEWORKS = [
  "GDPR",
  "HIPAA",
  "SOC 2",
  "ISO 27001",
  "PCI DSS",
  "NIST",
  "DPDP Act (India)",
  "SOX",
  "CCPA",
  "FERPA",
  "Custom",
];

const RISK_APPETITES = [
  { id: "low", label: "Low Risk" },
  { id: "balanced", label: "Balanced" },
  { id: "high", label: "High Growth" },
];

const AUDIT_YEARS = ["2025", "2026", "2027", "2028", "2030+"];

/* ==================================================
   HELPERS
================================================== */
const generateAuditRef = () => {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `CMP-${stamp}-${rand}`;
};

const normalizeRiskLevel = (riskLevel) => {
  const value = (riskLevel || "").toString().toLowerCase();
  if (value.includes("crit")) return "critical";
  if (value.includes("high")) return "high";
  if (value.includes("med")) return "medium";
  if (value.includes("low")) return "low";
  return "medium";
};

const RISK_META = {
  low: { label: "Low risk", color: "var(--risk-low)", icon: ShieldCheck },
  medium: { label: "Medium risk", color: "var(--risk-medium)", icon: ShieldAlert },
  high: { label: "High risk", color: "var(--risk-high)", icon: AlertTriangle },
  critical: { label: "Critical risk", color: "var(--risk-critical)", icon: CircleAlert },
};

/**
 * Backend may return missing_requirements / recommendations as plain strings
 * or as structured objects. This normalizes either shape without inventing
 * new backend fields — it only reads what may already be present.
 */
const normalizeListItem = (item, index, kind) => {
  if (typeof item === "string") {
    return { id: `${kind}-${index}`, title: item, description: "", level: null };
  }
  if (item && typeof item === "object") {
    const title =
      item.requirement || item.title || item.name || item.recommendation || `Item ${index + 1}`;
    const description = item.description || item.detail || item.explanation || "";
    const level = item.severity || item.priority || item.level || null;
    return { id: `${kind}-${index}`, title, description, level };
  }
  return { id: `${kind}-${index}`, title: String(item), description: "", level: null };
};

const formatFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

/* ==================================================
   SMALL PRESENTATIONAL PRIMITIVES
================================================== */
const SeverityChip = ({ level }) => {
  const normalized = normalizeRiskLevel(level);
  const meta = RISK_META[normalized];
  const Icon = meta.icon;
  return (
    <span className={`severity-chip severity-${normalized}`}>
      <Icon size={13} aria-hidden="true" />
      {level ? level : meta.label}
    </span>
  );
};

const CountUp = ({ value, suffix = "", duration = 1400 }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return undefined;
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(value * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [visible, value, duration]);

  const decimals = value % 1 !== 0 ? 1 : 0;

  return (
    <span ref={ref} className="count-up">
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const CircularGauge = ({ score = 0, riskLevel }) => {
  const normalized = normalizeRiskLevel(riskLevel);
  const color = RISK_META[normalized].color;
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = requestAnimationFrame(() => setProgress(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="gauge" role="img" aria-label={`Compliance score ${score} out of 100`}>
      <svg viewBox="0 0 200 200" className="gauge-svg">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="0.85" />
          </linearGradient>
        </defs>
        <circle cx="100" cy="100" r={radius} className="gauge-track" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          className="gauge-fill"
          stroke="url(#gaugeGradient)"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-center">
        <span className="gauge-value">{Math.round(progress)}</span>
        <span className="gauge-max">/ 100</span>
        <span className="gauge-caption">Compliance score</span>
      </div>
      <div className="gauge-sweep" style={{ "--sweep-color": color }} aria-hidden="true" />
    </div>
  );
};

/* ==================================================
   SEARCHABLE SELECT (single value, no external deps)
================================================== */
const SearchableSelect = ({ id, label, icon: FieldIcon, placeholder, options, value, onChange, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) searchRef.current?.focus();
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const normalized = query.trim().toLowerCase();
    return options.filter((option) => option.toLowerCase().includes(normalized));
  }, [options, query]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <div className="org-field" ref={containerRef}>
      <label className="org-label" htmlFor={id}>
        <FieldIcon size={14} aria-hidden="true" />
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <button
        type="button"
        id={id}
        className={`select-trigger ${isOpen ? "is-open" : ""} ${!value ? "is-placeholder" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{value || placeholder}</span>
        <ChevronDown size={16} aria-hidden="true" className="select-chevron" />
      </button>

      {isOpen && (
        <div className="select-panel" role="listbox">
          <div className="select-search">
            <Search size={14} aria-hidden="true" />
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={`Search ${label.toLowerCase()}…`}
              aria-label={`Search ${label}`}
            />
          </div>
          <div className="select-options">
            {filtered.length === 0 ? (
              <div className="select-empty">No matches found</div>
            ) : (
              filtered.map((option) => (
                <button
                  type="button"
                  key={option}
                  role="option"
                  aria-selected={option === value}
                  className={`select-option ${option === value ? "is-selected" : ""}`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                  {option === value && <Check size={14} aria-hidden="true" />}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ==================================================
   MULTI SELECT (compliance frameworks)
================================================== */
const MultiSelect = ({ id, label, icon: FieldIcon, placeholder, options, values, onChange, required }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const normalized = query.trim().toLowerCase();
    return options.filter((option) => option.toLowerCase().includes(normalized));
  }, [options, query]);

  const toggleValue = (option) => {
    if (values.includes(option)) {
      onChange(values.filter((item) => item !== option));
    } else {
      onChange([...values, option]);
    }
  };

  const removeValue = (option) => {
    onChange(values.filter((item) => item !== option));
  };

  return (
    <div className="org-field org-field-wide" ref={containerRef}>
      <label className="org-label" htmlFor={id}>
        <FieldIcon size={14} aria-hidden="true" />
        {label}
        {required && <span className="required-mark">*</span>}
      </label>
      <button
        type="button"
        id={id}
        className={`select-trigger multiselect-trigger ${isOpen ? "is-open" : ""}`}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {values.length === 0 ? (
          <span className="is-placeholder-text">{placeholder}</span>
        ) : (
          <span className="chip-row">
            {values.map((item) => (
              <span
                key={item}
                className="chip"
                onClick={(event) => {
                  event.stopPropagation();
                  removeValue(item);
                }}
              >
                {item}
                <X size={11} aria-hidden="true" />
              </span>
            ))}
          </span>
        )}
        <ChevronDown size={16} aria-hidden="true" className="select-chevron" />
      </button>

      {isOpen && (
        <div className="select-panel" role="listbox">
          <div className="select-search">
            <Search size={14} aria-hidden="true" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search frameworks…"
              aria-label="Search compliance frameworks"
              autoFocus
            />
          </div>
          <div className="select-options">
            {filtered.length === 0 ? (
              <div className="select-empty">No matches found</div>
            ) : (
              filtered.map((option) => {
                const checked = values.includes(option);
                return (
                  <button
                    type="button"
                    key={option}
                    role="option"
                    aria-selected={checked}
                    className={`select-option multiselect-option ${checked ? "is-selected" : ""}`}
                    onClick={() => toggleValue(option)}
                  >
                    <span className={`checkbox-box ${checked ? "is-checked" : ""}`}>
                      {checked && <Check size={12} aria-hidden="true" />}
                    </span>
                    {option}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/* ==================================================
   ORGANIZATION INFORMATION CARD
================================================== */
const OrganizationCard = ({ orgData, onFieldChange }) => (
  <section className="org-section" id="organization" aria-label="Organization information">
    <div className="section-heading">
      <span className="eyebrow">Organization context</span>
      <h2>Tell us where you operate</h2>
      <p>Compliance depends on jurisdiction — this context tells the engine which regulations apply.</p>
    </div>

    <div className="result-card org-card">
      <div className="org-grid">
        <div className="org-field">
          <label className="org-label" htmlFor="company-name">
            <Building2 size={14} aria-hidden="true" />
            Company name
            <span className="required-mark">*</span>
          </label>
          <input
            id="company-name"
            type="text"
            className="org-text-input"
            placeholder="Acme Corporation"
            value={orgData.companyName}
            onChange={(event) => onFieldChange("companyName", event.target.value)}
          />
        </div>

        <SearchableSelect
          id="industry"
          label="Industry"
          icon={Briefcase}
          placeholder="Select industry"
          options={INDUSTRIES}
          value={orgData.industry}
          onChange={(value) => onFieldChange("industry", value)}
          required
        />

        <SearchableSelect
          id="headquarters-country"
          label="Headquarters country"
          icon={Globe}
          placeholder="Select country"
          options={COUNTRIES}
          value={orgData.headquartersCountry}
          onChange={(value) => onFieldChange("headquartersCountry", value)}
          required
        />

        <SearchableSelect
          id="expansion-country"
          label="Expansion country"
          icon={Globe}
          placeholder="Select country"
          options={COUNTRIES}
          value={orgData.expansionCountry}
          onChange={(value) => onFieldChange("expansionCountry", value)}
          required
        />

        <div className="org-field">
          <label className="org-label" htmlFor="state-province">
            <MapPin size={14} aria-hidden="true" />
            State / Province
            <span className="optional-mark">optional</span>
          </label>
          <input
            id="state-province"
            type="text"
            className="org-text-input"
            placeholder="California, Ontario, Maharashtra…"
            value={orgData.state}
            onChange={(event) => onFieldChange("state", event.target.value)}
          />
        </div>

        <div className="org-field">
          <label className="org-label" htmlFor="company-size">
            <Users size={14} aria-hidden="true" />
            Company size
          </label>
          <div className="native-select-wrap">
            <select
              id="company-size"
              className="org-native-select"
              value={orgData.companySize}
              onChange={(event) => onFieldChange("companySize", event.target.value)}
            >
              <option value="">Select company size...</option>
              {COMPANY_SIZES.map((size) => (
                <option key={size.id} value={size.id}>
                  {size.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" className="select-chevron" />
          </div>
        </div>

        <div className="org-field">
          <label className="org-label" htmlFor="risk-appetite">
            <Gauge size={14} aria-hidden="true" />
            Risk appetite
          </label>
          <div className="native-select-wrap">
            <select
              id="risk-appetite"
              className="org-native-select"
              value={orgData.riskAppetite}
              onChange={(event) => onFieldChange("riskAppetite", event.target.value)}
            >
              <option value="">Select risk appetite...</option>
              {RISK_APPETITES.map((risk) => (
                <option key={risk.id} value={risk.id}>
                  {risk.label}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" className="select-chevron" />
          </div>
        </div>

        <div className="org-field">
          <label className="org-label" htmlFor="audit-year">
            <Calendar size={14} aria-hidden="true" />
            Expected audit year
          </label>
          <div className="native-select-wrap">
            <select
              id="audit-year"
              className="org-native-select"
              value={orgData.auditYear}
              onChange={(event) => onFieldChange("auditYear", event.target.value)}
            >
              <option value="">Select audit year...</option>
              {AUDIT_YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <ChevronDown size={16} aria-hidden="true" className="select-chevron" />
          </div>
        </div>


        <MultiSelect
          id="compliance-framework"
          label="Compliance framework"
          icon={Layers}
          placeholder="Select applicable frameworks"
          options={COMPLIANCE_FRAMEWORKS}
          values={orgData.complianceFrameworks}
          onChange={(values) => onFieldChange("complianceFrameworks", values)}
          required
        />
      </div>
    </div>
  </section>
);



/* ==================================================
   HERO
================================================== */
const Hero = ({ onWorkspace, onOrganization }) => (
  <section className="hero">
    <div className="hero-backdrop" aria-hidden="true">
      <div className="hero-grid" />
      <div className="hero-orb hero-orb-a" />
      <div className="hero-orb hero-orb-b" />
    </div>
    <div className="hero-content">
      <span className="eyebrow">
        <Sparkles size={13} aria-hidden="true" />
        Regulatory intelligence, automated
      </span>
      <h1 className="hero-title">
        Know exactly where your policy
        <br />
        <span className="hero-title-gradient">breaks from regulation.</span>
      </h1>
      <p className="hero-subtitle">
        Tell us where you operate, upload the policy and the regulation it must satisfy, and
        ComplyAI reads both like a senior compliance counsel — returning a scored, evidence-backed
        audit in seconds.
      </p>
      <div className="hero-actions">
        <button className="btn btn-primary btn-large" onClick={onOrganization}>
          Configure Organization
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </div>

      <div className="hero-badges">
        <span className="feature-badge">
          <FileCheck2 size={14} aria-hidden="true" /> PDF native
        </span>
        <span className="feature-badge">
          <ShieldCheck size={14} aria-hidden="true" /> SOC 2-aligned handling
        </span>
        <span className="feature-badge">
          <Clock size={14} aria-hidden="true" /> Results in seconds
        </span>
      </div>
    </div>
  </section>
);


/* ==================================================
   STATISTICS
================================================== */
const StatsSection = () => (
  <section className="stats" aria-label="Platform statistics">
    <div className="stats-grid">
      {STATS.map((stat) => (
        <div className="stat-card" key={stat.id}>
          <stat.icon className="stat-icon" size={20} aria-hidden="true" />
          <div className="stat-value">
            <CountUp value={stat.value} suffix={stat.suffix} />
          </div>
          <div className="stat-label">{stat.label}</div>
        </div>
      ))}
    </div>
  </section>
);

/* ==================================================
   FEATURES
================================================== */
const FeaturesSection = () => (
  <section className="features" id="features" aria-label="Platform capabilities">
    <div className="section-heading">
      <span className="eyebrow">Platform</span>
      <h2>Built like a compliance team, not a keyword search.</h2>
    </div>
    <div className="features-grid">
      {FEATURES.map((feature) => (
        <div className="feature-card" key={feature.id} tabIndex={0}>
          <div className="feature-icon">
            <feature.icon size={22} aria-hidden="true" />
          </div>
          <h3>{feature.title}</h3>
          <p>{feature.description}</p>
        </div>
      ))}
    </div>
  </section>
);

/* ==================================================
   UPLOAD CARD
================================================== */
const UploadCard = ({ id, label, description, file, onFileSelect, onRemove, accentIcon: AccentIcon }) => {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList) => {
      const picked = fileList && fileList[0];
      if (!picked) return;
      const isPdf = picked.type === "application/pdf" || picked.name.toLowerCase().endsWith(".pdf");
      if (!isPdf) {
        alert("Please select a valid PDF file (.pdf)");
        return;
      }
      onFileSelect(picked);
    },
    [onFileSelect]
  );

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    handleFiles(event.dataTransfer.files);
  };

  return (
    <div
      className={`upload-card ${isDragging ? "is-dragging" : ""} ${file ? "has-file" : ""}`}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <div className="upload-card-header">
        <span className="upload-card-icon">
          <AccentIcon size={18} aria-hidden="true" />
        </span>
        <div>
          <h3>{label}</h3>
          <p>{description}</p>
        </div>
      </div>

      {!file ? (
        <button
          type="button"
          className="upload-dropzone"
          onClick={() => inputRef.current?.click()}
          aria-label={`Upload ${label}, PDF only`}
        >
          <span className="upload-illustration" aria-hidden="true">
            <Upload size={26} />
          </span>
          <span className="upload-copy">
            <strong>Drop your PDF here</strong>
            <span>or click to browse your files</span>
          </span>
          <span className="pdf-badge">PDF only</span>
        </button>
      ) : (
        <div className="upload-file-preview">
          <span className="file-preview-icon">
            <FileCheck2 size={20} aria-hidden="true" />
          </span>
          <div className="file-preview-meta">
            <strong title={file.name}>{file.name}</strong>
            <span>{formatFileSize(file.size)}</span>
          </div>
          <button
            type="button"
            className="file-remove-btn"
            onClick={() => onRemove()}
            aria-label={`Remove ${file.name}`}
          >
            <X size={16} aria-hidden="true" />
          </button>
          <span className="file-success-pulse" aria-hidden="true">
            <CheckCircle2 size={16} />
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        id={id}
        type="file"
        accept="application/pdf,.pdf"
        className="sr-only"
        onChange={(event) => handleFiles(event.target.files)}
      />

    </div>
  );
};

/* ==================================================
   UPLOAD WORKSPACE
================================================== */
const UploadWorkspace = ({
  companyPolicy,
  regulationDocument,
  onCompanyPolicy,
  onRegulationDocument,
  onRemoveCompanyPolicy,
  onRemoveRegulationDocument,
  onAnalyze,
  status,
  errorMessage,
  canAnalyze,
  missingFieldsHint,
}) => {
  const isProcessing = status === "processing";

  return (
    <section className="workspace" id="workspace" aria-label="Document upload workspace">
      <div className="section-heading">
        <span className="eyebrow">Workspace</span>
        <h2>Upload both documents to begin</h2>
        <p>Your policy and the regulation it must comply with — both as PDF.</p>
      </div>

      <div className="upload-grid">
        <UploadCard
          id="company-policy-upload"
          label="Company policy"
          description="Your internal policy document"
          file={companyPolicy}
          onFileSelect={onCompanyPolicy}
          onRemove={onRemoveCompanyPolicy}
          accentIcon={FileText}
        />
        <UploadCard
          id="regulation-upload"
          label="Regulation"
          description="The regulatory text to comply with"
          file={regulationDocument}
          onFileSelect={onRegulationDocument}
          onRemove={onRemoveRegulationDocument}
          accentIcon={ScrollText}
        />
      </div>

      {errorMessage && status === "error" && (
        <div className="inline-alert" role="alert">
          <AlertTriangle size={16} aria-hidden="true" />
          {errorMessage}
        </div>
      )}

      <div className="workspace-actions">
        <button
          type="button"
          className="btn btn-primary btn-large"
          disabled={!canAnalyze || isProcessing}
          onClick={onAnalyze}
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="spin" aria-hidden="true" />
              Analyzing documents…
            </>
          ) : (
            <>
              Run compliance analysis
              <ArrowRight size={18} aria-hidden="true" />
            </>
          )}
        </button>
        <p className="workspace-hint">
          {canAnalyze ? "Everything looks good — ready when you are." : missingFieldsHint}
        </p>
      </div>
    </section>
  );
};

/* ==================================================
   PROCESSING DASHBOARD
================================================== */
const ProcessingDashboard = ({ activeStageIndex }) => {
  const progressPercent = Math.min(
    100,
    Math.round(((activeStageIndex + 1) / PROCESSING_STAGES.length) * 100)
  );

  return (
    <section className="processing" aria-live="polite" aria-label="Analysis in progress">
      <div className="processing-panel">
        <div className="processing-header">
          <span className="processing-orb">
            <Activity size={20} aria-hidden="true" />
          </span>
          <div>
            <h2>Running the compliance engine</h2>
            <p>Cross-referencing your policy against the regulation, clause by clause.</p>
          </div>
        </div>

        <div className="processing-scanbeam" aria-hidden="true">
          <span className="scan-doc scan-doc-left">
            <FileText size={16} />
          </span>
          <span className="scan-track">
            <span className="scan-beam" />
          </span>
          <span className="scan-doc scan-doc-right">
            <ScrollText size={16} />
          </span>
        </div>

        <div className="progress-bar-track" role="progressbar" aria-valuenow={progressPercent} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <span className="progress-percent">{progressPercent}%</span>

        <ol className="stage-list">
          {PROCESSING_STAGES.map((stage, index) => {
            const isComplete = index < activeStageIndex;
            const isActive = index === activeStageIndex;
            const StageIcon = stage.icon;
            return (
              <li
                key={stage.id}
                className={`stage-item ${isComplete ? "is-complete" : ""} ${isActive ? "is-active" : ""}`}
              >
                <span className="stage-icon">
                  {isComplete ? (
                    <CheckCircle2 size={16} aria-hidden="true" />
                  ) : isActive ? (
                    <Loader2 size={16} className="spin" aria-hidden="true" />
                  ) : (
                    <StageIcon size={16} aria-hidden="true" />
                  )}
                </span>
                <span className="stage-copy">
                  <strong>{stage.label}</strong>
                  <span>{stage.detail}</span>
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

/* ==================================================
   RESULTS DASHBOARD
================================================== */
const ResultsDashboard = ({ analysis, auditRef, onReset }) => {
  const {
    compliance_score: complianceScore = 0,
    risk_level: riskLevel = "Medium",
    summary = "",
    missing_requirements: missingRequirements = [],
    recommendations = [],
    improved_clauses: improvedClausesRaw = [],
    clause_improvements: clauseImprovementsRaw = [],
    revised_policy: revisedPolicyRaw = "",
    revised_policy_text: revisedPolicyTextRaw = "",
    policy_pdf_url: policyPdfUrl = "",
    audit_report_url: auditReportUrl = "",
  } = analysis || {};

  const improvedClauses = useMemo(() => {
    if (Array.isArray(clauseImprovementsRaw) && clauseImprovementsRaw.length > 0) return clauseImprovementsRaw;
    if (Array.isArray(improvedClausesRaw) && improvedClausesRaw.length > 0) return improvedClausesRaw;
    return [];
  }, [clauseImprovementsRaw, improvedClausesRaw]);

  const revisedPolicy = revisedPolicyTextRaw || revisedPolicyRaw || "";


  const normalizedRisk = normalizeRiskLevel(riskLevel);
  const riskMeta = RISK_META[normalizedRisk];
  const RiskIcon = riskMeta.icon;

  const normalizedMissing = useMemo(
    () => (missingRequirements || []).map((item, index) => normalizeListItem(item, index, "gap")),
    [missingRequirements]
  );
  const normalizedRecommendations = useMemo(
    () => (recommendations || []).map((item, index) => normalizeListItem(item, index, "rec")),
    [recommendations]
  );

  const coverage = Math.max(0, Math.min(100, Math.round(complianceScore)));
  const gapCount = normalizedMissing.length;

  return (
    <section className="results" id="results" aria-label="Compliance audit results">
      <div className="section-heading">
        <span className="eyebrow">Audit complete</span>
        <h2>Executive compliance copilot report</h2>
        <p>Reference {auditRef} — generated by the ComplyAI engine.</p>

        {/* PDF Download Buttons */}
        {(policyPdfUrl || auditReportUrl) && (
          <div className="pdf-actions-bar">
            {policyPdfUrl && (
              <a
                href={policyPdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="btn btn-primary btn-download"
              >
                <FileText size={16} aria-hidden="true" />
                Download Improved Policy
              </a>
            )}
            {auditReportUrl && (
              <a
                href={auditReportUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="btn btn-accent btn-download"
              >
                <ShieldCheck size={16} aria-hidden="true" />
                Download Audit Report
              </a>
            )}
          </div>
        )}
      </div>

      {/* 1. Executive Summary (Score, Risk Level, Summary) */}
      <div className="results-grid">
        <div className="result-card score-card">
          <CircularGauge score={coverage} riskLevel={riskLevel} />
          <span className={`risk-badge severity-${normalizedRisk}`}>
            <RiskIcon size={15} aria-hidden="true" />
            {riskMeta.label}
          </span>
        </div>

        <div className="result-card summary-card">
          <h3>
            <Info size={16} aria-hidden="true" /> Executive summary
          </h3>
          <p className="summary-text">{summary || "No summary was returned for this analysis."}</p>
          <div className="summary-metrics">
            <div className="summary-metric">
              <span className="summary-metric-value">{coverage}%</span>
              <span className="summary-metric-label">Policy health</span>
            </div>
            <div className="summary-metric">
              <span className="summary-metric-value">{gapCount}</span>
              <span className="summary-metric-label">Open gaps</span>
            </div>
            <div className="summary-metric">
              <span className="summary-metric-value">{normalizedRecommendations.length}</span>
              <span className="summary-metric-label">Recommendations</span>
            </div>
          </div>
          <div className="audit-ref">
            <ScrollText size={13} aria-hidden="true" />
            Audit reference <code>{auditRef}</code>
          </div>
        </div>
      </div>

      {/* 2. Missing Requirements & 3. Recommendations */}
      <div className="results-columns">
        <div className="result-card list-card">
          <h3>
            <SearchX size={16} aria-hidden="true" /> Missing requirements
          </h3>
          {normalizedMissing.length === 0 ? (
            <p className="empty-state-text">No gaps were detected against this regulation.</p>
          ) : (
            <ul className="finding-list">
              {normalizedMissing.map((item) => (
                <li key={item.id} className="finding-item">
                  <div className="finding-item-top">
                    <strong>{item.title}</strong>
                    {item.level && <SeverityChip level={item.level} />}
                  </div>
                  {item.description && <p>{item.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="result-card list-card">
          <h3>
            <Lightbulb size={16} aria-hidden="true" /> Recommendations
          </h3>
          {normalizedRecommendations.length === 0 ? (
            <p className="empty-state-text">No remediation actions were returned.</p>
          ) : (
            <ul className="finding-list">
              {normalizedRecommendations.map((item, index) => (
                <li key={item.id} className="finding-item">
                  <div className="finding-item-top">
                    <span className="priority-badge">Priority {index + 1}</span>
                    {item.level && <SeverityChip level={item.level} />}
                  </div>
                  <strong>{item.title}</strong>
                  {item.description && <p>{item.description}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* 4. AI Clause Improvements (NEW) */}
      <ClauseImprovements improvedClauses={improvedClauses} />

      {/* 5. AI Generated Revised Policy (NEW) */}
      <RevisedPolicyViewer revisedPolicy={revisedPolicy} auditRef={auditRef} />

      <div className="verdict-bar">
        <span className={`verdict-dot severity-${normalizedRisk}`} aria-hidden="true" />
        <span className="verdict-text">
          Overall verdict: <strong>{riskMeta.label}</strong> — {coverage}% compliant, {gapCount}{" "}
          requirement{gapCount === 1 ? "" : "s"} outstanding.
        </span>
        <button type="button" className="btn btn-ghost" onClick={onReset}>

          <RefreshCw size={15} aria-hidden="true" />
          Run another analysis
        </button>
      </div>
    </section>
  );
};

/* ==================================================
   FOOTER
================================================== */
const Footer = () => (
  <footer className="footer">
    <div className="footer-inner">
      <div className="navbar-brand">
        <span className="brand-mark brand-mark-small" aria-hidden="true">
          <Shield size={16} strokeWidth={2.25} />
        </span>
        <span className="brand-name">ComplyAI</span>
      </div>
      <p>Automated regulatory comparison for teams who cannot afford to guess.</p>

      <div className="footer-credits">
        <span>Designed & Engineered by <strong>Suryansh Pandey</strong></span>
      </div>


      <p className="footer-fine">
        ComplyAI supports human review of every finding. Reports are decision support, not legal advice.
      </p>
    </div>
  </footer>
);


/* ==================================================
   ROOT APP
================================================== */
const DEFAULT_ORG_DATA = {
  companyName: "",
  industry: "",
  headquartersCountry: "",
  expansionCountry: "",
  state: "",
  companySize: "",
  complianceFrameworks: [],
  riskAppetite: "",
  auditYear: "",
};


const formatCurrentDateTime = () => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, "0");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[now.getMonth()];
  const year = now.getFullYear();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = String(hours).padStart(2, "0");
  return `${day} ${month} ${year}, ${formattedHours}:${minutes} ${ampm}`;
};

const App = () => {
  const [userName, setUserName] = useState("Suryansh Pandey");
  const [userEmail, setUserEmail] = useState("suryansh@gmail.com");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginTimestamp, setLoginTimestamp] = useState(formatCurrentDateTime());
  const [activeTab, setActiveTab] = useState("dashboard"); // dashboard | platform | organization | workspace | report | documents | regulations | analysis | recommendations






  const [orgData, setOrgData] = useState(DEFAULT_ORG_DATA);
  const [companyPolicy, setCompanyPolicy] = useState(null);
  const [regulationDocument, setRegulationDocument] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | processing | results | error
  const [analysis, setAnalysis] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [auditRef, setAuditRef] = useState("");
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);



  const stageIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
    };
  }, []);

  const handleOrgFieldChange = useCallback((field, value) => {
    setOrgData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetWorkspace = () => {
    setOrgData(DEFAULT_ORG_DATA);
    setCompanyPolicy(null);
    setRegulationDocument(null);
    setStatus("idle");
    setAnalysis(null);
    setErrorMessage("");
    setActiveStageIndex(0);
    setAuditRef("");
  };

  const missingFields = useMemo(() => {
    const missing = [];
    if (!companyPolicy) missing.push("company policy PDF");
    if (!regulationDocument) missing.push("regulation PDF");
    return missing;
  }, [companyPolicy, regulationDocument]);

  const canAnalyze = Boolean(companyPolicy && regulationDocument);

  const missingFieldsHint =
    missingFields.length > 0
      ? `Upload ${missingFields.join(" and ")} to run analysis.`
      : "Everything looks good — ready when you are.";

  const handleAnalyze = useCallback(async () => {
    if (!canAnalyze) return;

    setStatus("processing");
    setActiveTab("report");
    setErrorMessage("");
    setActiveStageIndex(0);

    if (stageIntervalRef.current) clearInterval(stageIntervalRef.current);
    stageIntervalRef.current = setInterval(() => {
      setActiveStageIndex((prev) => {
        if (prev >= PROCESSING_STAGES.length - 2) return prev;
        return prev + 1;
      });
    }, 900);

    const formData = new FormData();
    formData.append("company_policy", companyPolicy);
    formData.append("regulation_document", regulationDocument);
    formData.append("company_name", orgData.companyName?.trim() || "Acme Global Enterprise");
    formData.append("industry", orgData.industry || "Technology");
    formData.append("headquarters_country", orgData.headquartersCountry || "United States");
    formData.append("expansion_country", orgData.expansionCountry || "United States");
    formData.append("state", orgData.state || "California");
    formData.append("company_size", orgData.companySize || "startup");
    formData.append("compliance_framework", (orgData.complianceFrameworks && orgData.complianceFrameworks.length > 0) ? orgData.complianceFrameworks.join(", ") : "GDPR");
    formData.append("risk_appetite", orgData.riskAppetite || "balanced");
    formData.append("audit_year", orgData.auditYear || "2026");


    try {
      const response = await axios.post(API_ENDPOINT, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(stageIntervalRef.current);
      setActiveStageIndex(PROCESSING_STAGES.length - 1);

      setTimeout(() => {
        setAnalysis(response.data.analysis);
        setAuditRef(generateAuditRef());
        setStatus("results");
      }, 700);
    } catch (error) {
      clearInterval(stageIntervalRef.current);
      const resDetail = error?.response?.data?.detail;
      const detailMsg = typeof resDetail === "string" ? resDetail : Array.isArray(resDetail) ? resDetail[0]?.msg : null;
      const message =
        detailMsg ||
        error?.response?.data?.message ||
        error?.message ||
        "The analysis could not be completed. Please try again.";

      setErrorMessage(message);
      setStatus("error");
    }
  }, [canAnalyze, companyPolicy, regulationDocument, orgData]);

  const handlePDFDownload = async (type = "audit_report") => {
    try {
      const isPolicyDoc = type.includes("policy") || type.includes("improved") || type.includes("revised");
      let downloadEndpoint = isPolicyDoc
        ? (analysis?.policy_pdf_url || `http://127.0.0.1:8000/download/improved_policy?ref=${auditRef || "complyai"}`)
        : (analysis?.audit_report_url || `http://127.0.0.1:8000/download/audit_report?ref=${auditRef || "complyai"}`);

      const filename = isPolicyDoc
        ? `AI_Revised_Policy_${auditRef || "COMPLI-2026"}.pdf`
        : `Executive_Audit_Report_${auditRef || "COMPLI-2026"}.pdf`;

      const response = await axios.get(downloadEndpoint, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error("PDF Download Error:", e);
      alert("Failed to download PDF report. Please ensure backend server is running.");
    }
  };


  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={(name, email) => {
          if (name) setUserName(name);
          if (email) setUserEmail(email);
          setLoginTimestamp(formatCurrentDateTime());
          setIsAuthenticated(true);
          setActiveTab("dashboard");
        }}
      />
    );
  }

  return (
    <div className="app-layout-shell" style={{ display: "flex", minHeight: "100vh", background: "#090d16" }}>

      {/* Left Sidebar */}
      <SidebarNav
        activeView={activeTab}
        onViewChange={setActiveTab}
        activeOrg={orgData.companyName || "Acme Global Enterprise"}
        onOrgChange={(name) => handleOrgFieldChange("companyName", name)}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
        isOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        onLogout={() => setIsAuthenticated(false)}
        userName={userName}
        userEmail={userEmail}
      />



      {/* Main Content Area */}
      <div className="main-viewport-area" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflowX: "hidden" }}>
        {/* Top Header Bar */}
        <TopHeader
          orgName={orgData.companyName || "Acme Global Enterprise"}
          userName={userName}
          onDownloadReport={() => handlePDFDownload("audit_report")}
          onShareReport={() => {
            navigator.clipboard.writeText(window.location.href);
            alert("Report link copied to clipboard!");
          }}
          onOpenWorkspace={() => setActiveTab("workspace")}
          onNavigate={(view) => setActiveTab(view)}
          onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
          onLogout={() => setIsAuthenticated(false)}
          onLogin={() => setIsAuthenticated(false)}
        />

        <main className="tab-content-area" style={{ padding: "24px", flex: 1 }}>
          {/* TAB 0: EXECUTIVE COMPLIANCE DASHBOARD */}
          {activeTab === "dashboard" && (
            <ExecutiveDashboard
              analysis={analysis}
              companyPolicyName={companyPolicy ? companyPolicy.name : "Company Policy.pdf"}
              regulationName={regulationDocument ? regulationDocument.name : "GDPR.pdf"}
              completedTimestamp={loginTimestamp}
              onOpenCopilot={() => {}}
              onGenerateClause={() => setActiveTab("recommendations")}
              onViewFixGap={() => setActiveTab("analysis")}
              onDownloadPDF={handlePDFDownload}
              onNavigate={(view) => setActiveTab(view)}
            />
          )}



          {/* TAB 1: DEDICATED AUDIT & RISK ANALYSIS VIEW */}
          {activeTab === "analysis" && (
            <AnalysisView
              analysis={analysis}
              onViewFixGap={(sec) => setActiveTab("recommendations")}
            />
          )}

          {/* TAB 2: DEDICATED EXECUTIVE REPORTS & EXPORT HUB VIEW */}
          {(activeTab === "reports" || activeTab === "report") && (
            <div className="tab-pane">
              {status === "processing" && (
                <ProcessingDashboard activeStageIndex={activeStageIndex} />
              )}

              {status === "results" && analysis ? (
                <ResultsDashboard
                  analysis={analysis}
                  auditRef={auditRef}
                  onReset={() => {
                    resetWorkspace();
                    setActiveTab("workspace");
                  }}
                />
              ) : (
                <ReportsView
                  analysis={analysis}
                  auditRef={auditRef}
                  onDownloadPDF={handlePDFDownload}
                />
              )}
            </div>
          )}

          {/* TAB 3: DEDICATED AI RECOMMENDATIONS & CLAUSE SYNTHESIZER VIEW */}
          {activeTab === "recommendations" && (
            <RecommendationsView
              analysis={analysis}
              onGenerateClause={(sec) => setActiveTab("report")}
            />
          )}

          {/* TAB 4: PLATFORM OVERVIEW */}
          {activeTab === "platform" && (
            <div className="tab-pane">
              <Hero
                onWorkspace={() => setActiveTab("workspace")}
                onOrganization={() => setActiveTab("organization")}
              />
              <StatsSection />
              <FeaturesSection />
              <div className="tab-nav-footer">
                <button
                  type="button"
                  className="btn btn-primary btn-large"
                  onClick={() => setActiveTab("organization")}
                >
                  Configure Organization Context <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 5: ORGANIZATION CONFIGURATION */}
          {(activeTab === "organization" || activeTab === "regulations") && (
            <div className="tab-pane">
              <OrganizationCard orgData={orgData} onFieldChange={handleOrgFieldChange} />
              <div className="tab-nav-footer">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab("workspace")}
                >
                  2. Proceed to Workspace & Upload PDFs <ArrowRight size={16} aria-hidden="true" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: WORKSPACE & DOCUMENT UPLOAD */}
          {(activeTab === "workspace" || activeTab === "documents") && (
            <div className="tab-pane">
              <UploadWorkspace
                companyPolicy={companyPolicy}
                regulationDocument={regulationDocument}
                onCompanyPolicy={setCompanyPolicy}
                onRegulationDocument={setRegulationDocument}
                onRemoveCompanyPolicy={() => setCompanyPolicy(null)}
                onRemoveRegulationDocument={() => setRegulationDocument(null)}
                onAnalyze={handleAnalyze}
                status={status}
                errorMessage={errorMessage}
                canAnalyze={canAnalyze}
                missingFieldsHint={missingFieldsHint}
              />
            </div>
          )}
        </main>

        <Footer />
      </div>

      <AIAssistant
        analysisResult={analysis}
        orgData={orgData}
        onOpenUpgradeModal={() => setIsUpgradeModalOpen(true)}
      />

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
    </div>
  );
};


export default App;