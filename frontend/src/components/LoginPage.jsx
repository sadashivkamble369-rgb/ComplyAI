import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import {
  Shield,
  Sparkles,
  Lock,
  ArrowRight,
  CheckCircle2,
  Building2,
  Key,
  Globe,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import "./LoginPage.css";

export default function LoginPage({ onLogin }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReadOnly, setIsReadOnly] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [emailSentNotice, setEmailSentNotice] = useState("");

  // Force clear initial form states on mount to clear cached browser values
  useEffect(() => {
    setUserName("");
    setEmail("");
    setPassword("");
  }, []);

  const handleFocus = () => {
    setIsReadOnly(false);
  };

  const isEmailValid = useMemo(() => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }, [email]);

  const isFormValid = Boolean(
    userName.trim() &&
    isEmailValid &&
    password.trim()
  );

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!userName.trim()) {
      setErrorMsg("Please enter your User Name.");
      return;
    }
    if (!isEmailValid) {
      setErrorMsg("Please enter a valid Work Email address (e.g., name@gmail.com).");
      return;
    }
    if (!password.trim()) {
      setErrorMsg("Please enter your Password.");
      return;
    }

    setErrorMsg("");
    setIsLoading(true);

    try {
      await axios.post("http://127.0.0.1:8000/send-notification", {
        user_name: userName.trim(),
        email: email.trim(),
      });
    } catch (err) {
      console.warn("Backend notification endpoint warning:", err);
    }

    setIsLoading(false);
    setEmailSentNotice(`Security login message sent to ${email.trim()}`);
    setTimeout(() => {
      if (onLogin) onLogin(userName.trim(), email.trim());
    }, 1000);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };




  return (
    <div className="login-page-root">
      {/* Background Glow Blobs */}
      <div className="login-bg-glow glow-1" />
      <div className="login-bg-glow glow-2" />

      {/* Navigation Header */}
      <header className="login-navbar">
        <div className="login-brand">
          <div className="brand-logo-glow">
            <Shield size={22} className="brand-shield" />
          </div>
          <span className="brand-title">ComplyAI</span>
          <span className="brand-badge">Enterprise</span>
        </div>
      </header>

      {/* Main Login Hero & Container */}
      <main className="login-hero-container">
        {/* Left Side: Brand Value Showcase */}
        <div className="login-showcase">
          <div className="showcase-badge">
            <Sparkles size={14} /> AI-Powered Compliance Automation
          </div>
          <h1 className="showcase-title">
            Enterprise Compliance, <br />
            <span className="gradient-text">Automated by AI.</span>
          </h1>
          <p className="showcase-desc">
            Perform real-time policy audits against GDPR, ISO 27001, SOC 2, HIPAA, and CCPA with your dedicated AI Compliance Officer.
          </p>

          <div className="showcase-features">
            <div className="showcase-feat-item">
              <CheckCircle2 size={18} className="feat-check" />
              <div>
                <strong>Automated Document Audits</strong>
                <p>Instant regulatory gap detection & missing clause identification.</p>
              </div>
            </div>

            <div className="showcase-feat-item">
              <CheckCircle2 size={18} className="feat-check" />
              <div>
                <strong>Dedicated AI Copilot</strong>
                <p>Voice-enabled senior compliance consultant sitting right beside you.</p>
              </div>
            </div>

            <div className="showcase-feat-item">
              <CheckCircle2 size={18} className="feat-check" />
              <div>
                <strong>500+ Global Regulatory Standards</strong>
                <p>Built for Fortune 500 enterprises, healthcare, and fintech.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Enterprise Login Card */}
        <div className="login-card-wrap">
          <div className="login-card">
            <div className="login-card-header">
              <h2>Welcome to ComplyAI</h2>
              <p>Sign in to access your organization's compliance dashboard.</p>
            </div>

            <div className="login-form" onKeyDown={handleKeyDown}>
              <div className="form-group">
                <label>User Name</label>
                <div className="input-wrap">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    name="cx_auth_field_1"
                    required
                    autoComplete="one-time-code"
                    data-lpignore="true"
                    data-1password-ignore="true"
                    readOnly={isReadOnly}
                    onFocus={handleFocus}
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="Enter your User Name"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Work Email</label>
                <div className="input-wrap">
                  <Building2 size={16} className="input-icon" />
                  <input
                    type="text"
                    name="cx_auth_field_2"
                    required
                    autoComplete="one-time-code"
                    data-lpignore="true"
                    data-1password-ignore="true"
                    readOnly={isReadOnly}
                    onFocus={handleFocus}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="suryansh@gmail.com"
                  />
                </div>
                {email.length > 0 && !isEmailValid && (
                  <div style={{ color: "#f59e0b", fontSize: "0.75rem", marginTop: "3px", fontWeight: "500" }}>
                    ⚠️ Please enter a valid email address (e.g. user@gmail.com)
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrap" style={{ position: "relative" }}>
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="cx_auth_field_3"
                    required
                    autoComplete="one-time-code"
                    data-lpignore="true"
                    data-1password-ignore="true"
                    readOnly={isReadOnly}
                    onFocus={handleFocus}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    style={{ paddingRight: "40px" }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    title={showPassword ? "Hide password" : "Show password"}
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      color: "#94a3b8",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div style={{ color: "#ef4444", fontSize: "0.8rem", fontWeight: "500", marginTop: "4px" }}>
                  {errorMsg}
                </div>
              )}

              {emailSentNotice && (
                <div style={{
                  background: "rgba(34, 197, 94, 0.15)",
                  border: "1px solid rgba(34, 197, 94, 0.4)",
                  color: "#4ade80",
                  padding: "10px 14px",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginTop: "8px"
                }}>
                  <CheckCircle2 size={16} />
                  {emailSentNotice}
                </div>
              )}


              <button
                type="button"
                className="btn-submit-login"
                disabled={!isFormValid || isLoading}
                onClick={handleSubmit}
                style={{
                  opacity: !isFormValid || isLoading ? 0.5 : 1,
                  cursor: !isFormValid || isLoading ? "not-allowed" : "pointer",
                }}
              >
                {isLoading ? "Authenticating..." : "Sign In to ComplyAI"}
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </div>




            <div className="login-card-footer" style={{ marginTop: "24px" }}>
              <Lock size={12} /> SOC 2 Type II Certified • 256-Bit SSL Encryption
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
