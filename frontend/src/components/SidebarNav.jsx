import React, { useState } from "react";
import {
  ShieldCheck,
  LayoutDashboard,
  Folder,
  BookOpen,
  Search,
  FileCheck,
  Sparkles,
  Building2,
  Plus,
  Crown,
  X,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from "lucide-react";

import "./SidebarNav.css";



export default function SidebarNav({
  activeView = "dashboard",
  onViewChange,
  activeOrg = "Acme Global Enterprise",
  onOrgChange,
  onOpenUpgradeModal,
  isOpen = true,
  onToggleSidebar,
  onLogout,
  userName = "Suryansh Pandey",
}) {


  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const triggerUpgrade = () => {
    if (onOpenUpgradeModal) {
      onOpenUpgradeModal();
    } else {
      setShowUpgradeModal(true);
    }
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "documents", label: "Documents", icon: Folder },
    { id: "regulations", label: "Regulations", icon: BookOpen },
    { id: "analysis", label: "Analysis", icon: Search },
    { id: "reports", label: "Reports", icon: FileCheck },
    { id: "recommendations", label: "Recommendations", icon: Sparkles },
  ];

  const orgs = ["Acme Global Enterprise", "Globex Corporation", "Umbrella Corp"];

  const handleNavClick = (item) => {
    onViewChange && onViewChange(item.id);
  };

  return (
    <>
      <aside className={`sidebar-root ${!isOpen ? "is-collapsed" : ""}`}>
        {/* Brand Header Logo & Collapse Toggle Button */}
        <div className="sidebar-brand-row">
          <div
            className="sidebar-brand"
            onClick={() => onViewChange && onViewChange("dashboard")}
            style={{ cursor: "pointer" }}
            title="Return to Dashboard Overview"
          >
            <div className="brand-logo-icon">
              <ShieldCheck size={22} />
            </div>
            {isOpen && (
              <span className="brand-title-text">
                Comply<span>AI</span>
              </span>
            )}
          </div>

          <button
            type="button"
            className="btn-sidebar-toggle"
            onClick={onToggleSidebar}
            title={isOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isOpen ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
          </button>
        </div>

        {/* Main Navigation Items (Workspace Button Removed) */}
        <nav className="sidebar-nav-list">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`sidebar-nav-btn ${isActive ? "is-active" : ""}`}
                onClick={() => handleNavClick(item)}
                title={!isOpen ? item.label : ""}
              >
                <Icon size={18} className="nav-icon" />
                {isOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Recent Organizations */}
        {isOpen && (
          <div className="sidebar-section">
            <div className="section-title">Recent Organizations</div>
            <div className="orgs-list">
              {orgs.map((org) => {
                const isSelected = activeOrg === org;
                return (
                  <button
                    key={org}
                    type="button"
                    className={`org-btn ${isSelected ? "is-selected" : ""}`}
                    onClick={() => onOrgChange && onOrgChange(org)}
                  >
                    <span className={`org-dot ${isSelected ? "dot-active" : ""}`} />
                    <span className="org-name">{org}</span>
                  </button>
                );
              })}
              <button
                type="button"
                className="org-btn btn-add-org"
                onClick={() => onViewChange && onViewChange("organization")}
              >
                <Plus size={14} /> New Organization
              </button>
            </div>
          </div>
        )}

        {/* Upgrade Pro Card */}
        {isOpen && (
          <div className="sidebar-upgrade-card" onClick={triggerUpgrade} style={{ cursor: "pointer" }}>
            <div className="upgrade-header">
              <Crown size={16} className="crown-icon" />
              <span>Upgrade to Pro</span>
            </div>
            <p>Unlock advanced features, custom reports, and priority support.</p>
            <button
              type="button"
              className="btn-upgrade-now"
              onClick={(e) => {
                e.stopPropagation();
                triggerUpgrade();
              }}
            >
              Upgrade Now
            </button>
          </div>
        )}

        {/* User Profile Footer (Directly below Upgrade Pro card) */}
        <div className="sidebar-user-footer" style={{ marginTop: "8px" }}>
          <a
            href="https://www.linkedin.com/in/suryansh-pandey-0a6505380"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "flex", flex: 1, alignItems: "center", gap: "10px", textDecoration: "none" }}
            title="View Suryansh Pandey's Public Profile on LinkedIn"
          >
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userName)}`}
              alt={userName}
              className="user-avatar"
            />
            {isOpen && (
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-email">suryansh@acme.com</span>
              </div>
            )}
          </a>


          {isOpen && onLogout && (
            <button
              type="button"
              className="btn-sidebar-logout"
              onClick={onLogout}
              title="Logout from ComplyAI"
              style={{
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#ef4444",
                borderRadius: "6px",
                width: "28px",
                height: "28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <LogOut size={13} />
            </button>
          )}
        </div>
      </aside>



      {/* Pro Upgrade Modal */}
      {showUpgradeModal && (
        <div className="upgrade-modal-overlay" onClick={() => setShowUpgradeModal(false)}>
          <div className="upgrade-modal-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="upgrade-modal-close"
              onClick={() => setShowUpgradeModal(false)}
            >
              <X size={18} />
            </button>
            <div className="upgrade-modal-header">
              <Crown size={28} className="crown-glow-icon" />
              <h2>Upgrade to ComplyAI Pro</h2>
              <p>Accelerate enterprise compliance auditing with AI automated agents.</p>
            </div>
            <div className="upgrade-features-list">
              <div className="up-feat-item">
                <CheckCircle2 size={16} className="check-purple" />
                <span>Unlimited Policy & Regulatory Document Audits</span>
              </div>
              <div className="up-feat-item">
                <CheckCircle2 size={16} className="check-purple" />
                <span>500+ Global Compliance Frameworks (GDPR, ISO, SOC 2, HIPAA)</span>
              </div>
              <div className="up-feat-item">
                <CheckCircle2 size={16} className="check-purple" />
                <span>Automated PDF Executive Report Exporting & Webhook Integrations</span>
              </div>
              <div className="up-feat-item">
                <CheckCircle2 size={16} className="check-purple" />
                <span>24/7 Dedicated AI Copilot with Priority Gemini 2.5 Flash API</span>
              </div>
            </div>
            <div className="upgrade-modal-actions">
              <button
                type="button"
                className="btn-activate-pro"
                onClick={() => {
                  alert("Pro Plan Activated Successfully! Welcome Suryansh Pandey.");
                  setShowUpgradeModal(false);
                }}
              >
                Start 14-Day Free Trial ✨
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
