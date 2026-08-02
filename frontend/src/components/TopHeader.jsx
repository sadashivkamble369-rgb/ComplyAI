import React, { useState, useRef, useEffect } from "react";
import {
  ChevronDown,
  Search,
  Bell,
  Download,
  Share2,
  CheckCircle2,
  FileCheck,
  BookOpen,
  Folder,
  Sparkles,
  Bot,
  X,
  ArrowRight,
  Shield,
  PanelLeft,
  Plus,
  Clock,
  History,
  Building2,
  Activity,
  Check,
  LogOut,
  LogIn,
} from "lucide-react";


import "./TopHeader.css";

// 5 Enterprise Organizations Dataset
const RECENT_ORGANIZATIONS = [
  {
    id: "org-1",
    name: "Acme Global Enterprise",
    industry: "Healthcare",
    lastAudit: "Today",
    status: "healthy", // healthy | review | risk
    score: 92,
  },
  {
    id: "org-2",
    name: "Umbrella Corp",
    industry: "Technology",
    lastAudit: "Yesterday",
    status: "risk",
    score: 64,
  },
  {
    id: "org-3",
    name: "Globex Corporation",
    industry: "Finance",
    lastAudit: "3 days ago",
    status: "review",
    score: 78,
  },
  {
    id: "org-4",
    name: "Stark Industries",
    industry: "Aerospace",
    lastAudit: "Jul 28",
    status: "healthy",
    score: 95,
  },
  {
    id: "org-5",
    name: "Wayne Enterprises",
    industry: "Defense",
    lastAudit: "Jul 25",
    status: "healthy",
    score: 91,
  },
];

// 4 Recent Audit History Reports Dataset
const RECENT_AUDITS = [
  {
    id: "audit-1",
    title: "GDPR 2026 Audit",
    time: "Today • 11:42 AM",
    status: "healthy",
    badge: "🟢",
    score: 92,
    org: "Acme Global Enterprise",
    target: "dashboard",
  },
  {
    id: "audit-2",
    title: "ISO 27001 Security Audit",
    time: "Yesterday",
    status: "review",
    badge: "🟡",
    score: 84,
    org: "Globex Corporation",
    target: "reports",
  },
  {
    id: "audit-3",
    title: "HIPAA Privacy Analysis",
    time: "Jul 30",
    status: "risk",
    badge: "🔴",
    score: 68,
    org: "Umbrella Corp",
    target: "analysis",
  },
  {
    id: "audit-4",
    title: "SOC 2 Type II Re-analysis",
    time: "Jul 28",
    status: "healthy",
    badge: "🟢",
    score: 95,
    org: "Stark Industries",
    target: "reports",
  },
];

export default function TopHeader({
  orgName = "Acme Global Enterprise",
  userName = "Suryansh Pandey",
  onOrgChange,
  onDownloadReport,
  onShareReport,
  onOpenWorkspace,
  onNavigate,
  onOpenUpgradeModal,
  onToggleSidebar,
  onLogout,
  onLogin,
}) {


  const [isOrgDropdownOpen, setIsOrgDropdownOpen] = useState(false);
  const [orgSearchQuery, setOrgSearchQuery] = useState("");
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const orgDropdownRef = useRef(null);
  const notifRef = useRef(null);
  const searchRef = useRef(null);

  // Close dropdowns on click outside & Esc key
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (orgDropdownRef.current && !orgDropdownRef.current.contains(e.target)) {
        setIsOrgDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOrgDropdownOpen(false);
        setIsNotificationsOpen(false);
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Filtered Orgs and Audits
  const filteredOrgs = RECENT_ORGANIZATIONS.filter(
    (org) =>
      org.name.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
      org.industry.toLowerCase().includes(orgSearchQuery.toLowerCase())
  );

  const filteredAudits = RECENT_AUDITS.filter(
    (audit) =>
      audit.title.toLowerCase().includes(orgSearchQuery.toLowerCase()) ||
      audit.org.toLowerCase().includes(orgSearchQuery.toLowerCase())
  );

  // Switch Active Organization
  const handleSelectOrg = (org) => {
    setIsOrgDropdownOpen(false);
    setOrgSearchQuery("");
    if (onOrgChange) onOrgChange(org.name);
  };

  // Restore Audit Context
  const handleRestoreAudit = (audit) => {
    setIsOrgDropdownOpen(false);
    setOrgSearchQuery("");
    if (onOrgChange) onOrgChange(audit.org);
    if (onNavigate) onNavigate(audit.target);
  };

  // Notifications dataset
  const notifications = [
    {
      id: "n1",
      icon: CheckCircle2,
      iconColor: "icon-green",
      title: "Analysis Completed",
      desc: "Executive compliance analysis finished for Company Policy.pdf against GDPR.",
      time: "2 mins ago",
      target: "dashboard",
    },
    {
      id: "n2",
      icon: BookOpen,
      iconColor: "icon-blue",
      title: "New Regulation Published",
      desc: "GDPR 2026 Regulatory Addendum update is now available for indexing.",
      time: "15 mins ago",
      target: "regulations",
    },
    {
      id: "n3",
      icon: FileCheck,
      iconColor: "icon-purple",
      title: "Report Generated",
      desc: "Compliance Audit Report PDF (REF: COMPLI-2026-X892) is ready for download.",
      time: "1 hour ago",
      target: "reports",
    },
    {
      id: "n4",
      icon: Folder,
      iconColor: "icon-amber",
      title: "Policy Upload Finished",
      desc: "Company Policy.pdf (1.2 MB) successfully extracted & parsed.",
      time: "2 hours ago",
      target: "documents",
    },
    {
      id: "n5",
      icon: Sparkles,
      iconColor: "icon-purple",
      title: "AI Recommendation Ready",
      desc: "4 new high-priority AI clause improvements generated.",
      time: "3 hours ago",
      target: "recommendations",
    },
  ];

  // Global Search Items Dataset
  const searchCategories = [
    {
      category: "📑 Search Reports",
      items: [
        { label: "Executive Compliance Audit Report", target: "reports", meta: "REF: COMPLI-2026-X892" },
        { label: "Compliance Score & Risk Rating (92%)", target: "dashboard", meta: "Overview Metrics" },
      ],
    },
    {
      category: "📜 Search Regulations",
      items: [
        { label: "GDPR Article 37 — DPO Mandate", target: "regulations", meta: "Data Protection Officer" },
        { label: "GDPR Article 33 — 72-Hour Breach SLA", target: "regulations", meta: "Incident Management" },
        { label: "ISO 27001 / SOC 2 Security Controls", target: "regulations", meta: "Framework Index" },
      ],
    },
    {
      category: "📁 Search Policies",
      items: [
        { label: "Company Policy.pdf (Active)", target: "documents", meta: "1.2 MB Uploaded" },
        { label: "Vendor Data Processing Agreement (DPA)", target: "documents", meta: "Subprocessor Clause" },
      ],
    },
    {
      category: "🤖 AI Commands",
      items: [
        { label: "/explain-risk — Explain highest risk gap", target: "analysis", meta: "AI Copilot Command" },
        { label: "/generate-dpo-clause — Synthesize DPO amendment", target: "recommendations", meta: "AI Clause Generator" },
        { label: "/export-pdf — Download full PDF audit report", target: "reports", meta: "Export Command" },
      ],
    },
  ];

  const handleNotifClick = (notif) => {
    setIsNotificationsOpen(false);
    if (unreadCount > 0) setUnreadCount((prev) => Math.max(0, prev - 1));
    if (onNavigate) onNavigate(notif.target);
  };

  const handleSearchResultClick = (target) => {
    setIsSearchOpen(false);
    setSearchQuery("");
    if (onNavigate) onNavigate(target);
  };

  return (
    <header className="top-header-root">
      {/* Left: Organization Selector Dropdown */}
      <div className="top-header-left">
        {/* Floating Organization Switcher Button */}

        <div className="org-switcher-wrapper" ref={orgDropdownRef}>
          <button
            type="button"
            className={`btn-org-selector ${isOrgDropdownOpen ? "is-open" : ""}`}
            onClick={() => setIsOrgDropdownOpen((prev) => !prev)}
            title="Switch Organization or Reopen Audit History"
          >
            <span className="org-badge-icon">🏢</span>
            <span className="org-title">{orgName}</span>
            <ChevronDown
              size={16}
              className={`chevron-icon ${isOrgDropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Floating Recent Organizations + Audit History Dropdown Panel */}
          {isOrgDropdownOpen && (
            <div className="org-history-dropdown">
              {/* Search Bar */}
              <div className="org-dropdown-search">
                <Search size={14} className="org-search-icon" />
                <input
                  type="text"
                  placeholder="Search organizations & audit history..."
                  className="org-search-input"
                  value={orgSearchQuery}
                  onChange={(e) => setOrgSearchQuery(e.target.value)}
                  autoFocus
                />
                {orgSearchQuery && (
                  <button
                    type="button"
                    className="btn-clear-org-search"
                    onClick={() => setOrgSearchQuery("")}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <div className="org-dropdown-body">
                {/* 1. RECENT ORGANIZATIONS SECTION */}
                <div className="dropdown-section">
                  <div className="section-label-row">
                    <span>Recent Organizations</span>
                  </div>

                  <div className="orgs-dropdown-list">
                    {filteredOrgs.length > 0 ? (
                      filteredOrgs.map((org) => {
                        const isCurrent = org.name === orgName;
                        return (
                          <div
                            key={org.id}
                            className={`org-history-item ${isCurrent ? "is-current" : ""}`}
                            onClick={() => handleSelectOrg(org)}
                          >
                            <span className={`status-indicator ${org.status}`} />
                            <div className="org-item-info">
                              <div className="org-item-header">
                                <span className="org-item-name">{org.name}</span>
                                {isCurrent && <span className="current-tag">Current</span>}
                              </div>
                              <div className="org-item-meta">
                                <span className="meta-sub">{org.industry}</span>
                                <span className="meta-dot">•</span>
                                <span className="meta-time">Last Audit: {org.lastAudit}</span>
                              </div>
                            </div>
                            <span className="org-item-score">{org.score}%</span>
                          </div>
                        );
                      })
                    ) : (
                      <div className="empty-search-state">
                        <p>No matching organizations found.</p>
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn-create-new-org"
                      onClick={() => {
                        setIsOrgDropdownOpen(false);
                        onNavigate && onNavigate("organization");
                      }}
                    >
                      <Plus size={14} /> Create New Organization
                    </button>
                  </div>
                </div>

                <div className="dropdown-divider" />

                {/* 2. RECENT AUDITS HISTORY SECTION */}
                <div className="dropdown-section">
                  <div className="section-label-row">
                    <History size={13} className="history-icon" />
                    <span>Recent Audits</span>
                  </div>

                  <div className="audits-dropdown-list">
                    {filteredAudits.length > 0 ? (
                      filteredAudits.map((audit) => (
                        <div
                          key={audit.id}
                          className="audit-history-item"
                          onClick={() => handleRestoreAudit(audit)}
                        >
                          <span className="audit-badge">{audit.badge}</span>
                          <div className="audit-item-info">
                            <span className="audit-item-title">{audit.title}</span>
                            <div className="audit-item-meta">
                              <span className="meta-time">{audit.time}</span>
                              <span className="meta-dot">•</span>
                              <span className="meta-sub">{audit.org}</span>
                            </div>
                          </div>
                          <span className="audit-score-pill">{audit.score}%</span>
                        </div>
                      ))
                    ) : (
                      <div className="empty-search-state">
                        <p>No matching audit reports found.</p>
                      </div>
                    )}

                    <button
                      type="button"
                      className="btn-view-all-history"
                      onClick={() => {
                        setIsOrgDropdownOpen(false);
                        onNavigate && onNavigate("reports");
                      }}
                    >
                      View All Audit History <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="top-header-right">
        {/* Purpose-Driven Search Bar with Overlay */}
        <div className="header-search-wrap" ref={searchRef}>
          <div className="header-search">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              placeholder="Search reports, regulations, policies, AI commands..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
            />
            {searchQuery && (
              <button
                type="button"
                className="btn-clear-search"
                onClick={() => {
                  setSearchQuery("");
                  setIsSearchOpen(false);
                }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Search Dropdown Overlay */}
          {isSearchOpen && (
            <div className="search-results-overlay">
              {searchCategories.map((cat, idx) => (
                <div key={idx} className="search-cat-group">
                  <div className="search-cat-title">{cat.category}</div>
                  <div className="search-cat-items">
                    {cat.items
                      .filter(
                        (item) =>
                          !searchQuery ||
                          item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.meta.toLowerCase().includes(searchQuery.toLowerCase())
                      )
                      .map((item, itemIdx) => (
                        <div
                          key={itemIdx}
                          className="search-result-item"
                          onClick={() => handleSearchResultClick(item.target)}
                        >
                          <span className="res-label">{item.label}</span>
                          <span className="res-meta">{item.meta}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clickable Notification Bell with Dropdown Drawer */}
        <div className="notif-wrapper" ref={notifRef}>
          <button
            type="button"
            className="btn-icon-circle btn-bell"
            title="Notifications & System Activity"
            onClick={() => setIsNotificationsOpen((prev) => !prev)}
          >
            <Bell size={18} />
            {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
          </button>

          {/* Notifications Dropdown Drawer */}
          {isNotificationsOpen && (
            <div className="notifications-drawer">
              <div className="notif-drawer-header">
                <div className="notif-title-row">
                  <h3>Notifications & Activity</h3>
                  <span className="unread-pill">{unreadCount} New</span>
                </div>
                <p>Click any item to view analysis, reports, or regulations.</p>
              </div>

              <div className="notif-list">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  return (
                    <div
                      key={notif.id}
                      className="notif-item-row"
                      onClick={() => handleNotifClick(notif)}
                    >
                      <div className={`notif-icon-box ${notif.iconColor}`}>
                        <Icon size={16} />
                      </div>
                      <div className="notif-body">
                        <h4>{notif.title}</h4>
                        <p>{notif.desc}</p>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                      <ArrowRight size={14} className="arrow-hover" />
                    </div>
                  );
                })}
              </div>

              <div className="notif-drawer-footer">
                <button
                  type="button"
                  className="btn-mark-all-read"
                  onClick={() => setUnreadCount(0)}
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Header Action Buttons */}
        <button
          type="button"
          className="btn-header-ghost"
          onClick={onDownloadReport}
        >
          <Download size={15} /> Download Report
        </button>

        <button
          type="button"
          className="btn-header-purple"
          onClick={onShareReport}
        >
          <Share2 size={15} /> Share Report
        </button>

        {/* Top Right Clickable Sign In / Switch Account Button */}
        {onLogin && (
          <button
            type="button"
            className="btn-header-auth-login"
            onClick={onLogin}
            title="Sign In / Switch Account"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(56, 189, 248, 0.12)",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              color: "#38bdf8",
              fontSize: "0.8rem",
              fontWeight: "600",
              padding: "7px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <LogIn size={14} /> Sign In
          </button>
        )}

        {/* Top Right Clickable Logout Button */}
        {onLogout && (
          <button
            type="button"
            className="btn-header-logout"
            onClick={onLogout}
            title="Logout of ComplyAI"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              color: "#ef4444",
              fontSize: "0.8rem",
              fontWeight: "600",
              padding: "7px 12px",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        )}

      </div>
    </header>
  );
}


