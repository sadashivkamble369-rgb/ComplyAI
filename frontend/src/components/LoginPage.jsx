import React, { useState } from "react";
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userName.trim()) return;
    const finalEmail = email.trim() || "suryansh@gmail.com";
    if (onLogin) onLogin(userName.trim(), finalEmail);
  };

  const handleDemoClick = () => {
    const finalName = userName.trim() || "Suryansh Pandey";
    const finalEmail = email.trim() || "suryansh@gmail.com";
    if (onLogin) onLogin(finalName, finalEmail);
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

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label>User Name</label>
                <div className="input-wrap">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    required
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
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="suryansh@gmail.com"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="input-wrap" style={{ position: "relative" }}>
                  <Lock size={16} className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
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


              <button type="submit" className="btn-submit-login" disabled={isLoading}>
                {isLoading ? "Authenticating..." : "Sign In to ComplyAI"}
                {!isLoading && <ArrowRight size={16} />}
              </button>
            </form>

            <div className="login-card-footer" style={{ marginTop: "24px" }}>
              <Lock size={12} /> SOC 2 Type II Certified • 256-Bit SSL Encryption
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
