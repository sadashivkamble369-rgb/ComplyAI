import React, { useState, useRef, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Sparkles,
  MessageSquare,
  X,
  Send,
  Bot,
  User,
  Shield,
  HelpCircle,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Minimize2,
  Maximize2,
  RotateCcw,
  Crown,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Search,
  Scale,
  TrendingUp,
  Briefcase,
  BookOpen,
  ArrowRight,
  Loader2,
} from "lucide-react";
import "./AIAssistant.css";

// 8 Premium Executive Suggestion Cards
const EXECUTIVE_SUGGESTIONS = [
  {
    id: "explain_score",
    icon: TrendingUp,
    label: "Explain my compliance score",
    prompt: "Explain my current compliance score, key penalties, and how it was calculated.",
  },
  {
    id: "summarize_report",
    icon: FileText,
    label: "Summarize my report",
    prompt: "Give me an executive 1-minute summary of the entire compliance audit report.",
  },
  {
    id: "critical_findings",
    icon: AlertTriangle,
    label: "Show critical findings",
    prompt: "Highlight all critical regulatory non-compliance findings requiring immediate action.",
  },
  {
    id: "generate_clauses",
    icon: Sparkles,
    label: "Generate missing clauses",
    prompt: "Synthesize compliant legal wording and missing policy clauses for GDPR Article 33 & 37.",
  },
  {
    id: "compare_frameworks",
    icon: Scale,
    label: "Compare GDPR and DPDP",
    prompt: "Compare GDPR and India DPDP 2023 requirements for data breach notification & DPA mandates.",
  },
  {
    id: "improve_score",
    icon: CheckCircle2,
    label: "Improve my compliance score",
    prompt: "Provide a step-by-step roadmap to raise my compliance score from 92% to 100%.",
  },
  {
    id: "board_summary",
    icon: Briefcase,
    label: "Generate board summary",
    prompt: "Draft an executive slide-ready summary for the Board of Directors & CISO.",
  },
  {
    id: "beginner_explanation",
    icon: BookOpen,
    label: "Explain like I'm a beginner",
    prompt: "Explain this compliance audit report in plain, non-legal language for general stakeholders.",
  },
];

// Live reasoning steps for realistic micro-interactions
const REASONING_STEPS = [
  "Reading uploaded policy document...",
  "Searching GDPR Article 33 & 37 mandates...",
  "Evaluating compliance score & risk matrix...",
  "Generating compliant legal addendums...",
  "Preparing executive consultant briefing...",
];

export default function AIAssistant({ analysisResult, orgData, onOpenUpgradeModal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [aiState, setAiState] = useState("idle"); // idle | listening | thinking | reading_docs | searching_regs | comparing_clauses | generating | speaking
  const [reasoningStep, setReasoningStep] = useState("");
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [streamingText, setStreamingText] = useState("");

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  // Time-based executive greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const userName = "Suryansh";

  // Auto-scroll to bottom of chat
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [isOpen, messages, streamingText, scrollToBottom]);

  // Web Speech Synthesis (Text to Speech)
  const speakText = useCallback(
    (text) => {
      if (isMuted || !("speechSynthesis" in window)) return;
      window.speechSynthesis.cancel(); // Stop existing speech

      const cleanText = text.replace(/[*#_`]/g, "").slice(0, 300); // Speak first summary part
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setAiState("speaking");
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        setAiState("idle");
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
        setAiState("idle");
      };

      window.speechSynthesis.speak(utterance);
    },
    [isMuted]
  );

  const stopSpeaking = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    if (aiState === "speaking") setAiState("idle");
  };

  // Web Speech Recognition (Voice Input)
  const toggleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isVoiceActive) {
      recognitionRef.current?.stop();
      setIsVoiceActive(false);
      setAiState("idle");
    } else {
      stopSpeaking();
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsVoiceActive(true);
        setAiState("listening");
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputValue(transcript);
      };

      recognition.onerror = (err) => {
        console.warn("Speech recognition error:", err);
        setIsVoiceActive(false);
        setAiState("idle");
      };

      recognition.onend = () => {
        setIsVoiceActive(false);
        if (aiState === "listening") setAiState("idle");
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  // Senior Compliance Consultant Structured Response Synthesizer
  const generateConsultantResponse = useCallback(
    (query) => {
      const q = query.toLowerCase();
      const company = orgData?.companyName || "Acme Global Enterprise";
      const score = analysisResult?.compliance_score || 92;

      let summary = "";
      let reason = "";
      let reg = "";
      let risk = "";
      let action = "";
      let priority = "High";
      let fixTime = "24-48 Hours";
      let scoreImp = "+6% Score Boost";

      if (q.includes("score") || q.includes("explain my compliance")) {
        summary = `${company} currently holds an Executive Compliance Score of ${score}%. The organization is rated as Low Overall Risk, but minor gaps exist in data breach SLAs.`;
        reason = "The score reflects high coverage across data minimization and encryption standards, with a pending gap in statutory 72-hour breach notification timelines.";
        reg = "GDPR Article 33 (1) & Article 37 (1)(a)";
        risk = "Potential regulatory fines up to €20M or 4% of global annual turnover under GDPR non-compliance.";
        action = "Incorporate an explicit 72-Hour Data Breach Incident Notification SLA into Section 4.2 of your Data Protection Policy.";
        priority = "Critical";
        fixTime = "24 Hours";
        scoreImp = "+8% (Reaches 100%)";
      } else if (q.includes("summarize") || q.includes("report")) {
        summary = `Audit Briefing for ${company}: The 2026 Compliance Assessment analyzed your internal policy against GDPR, ISO 27001, and SOC 2 Type II frameworks.`;
        reason = "Core technical security controls (AES-256 encryption, TLS 1.3) are verified. However, vendor subprocessor DPA terms require immediate updates.";
        reg = "GDPR Article 28 & ISO 27001 Control A.15";
        risk = "Operational exposure when sharing customer personal data with third-party cloud subprocessors without binding DPAs.";
        action = "Execute standard contractual clauses (SCCs) and mandatory DPA addendums for all third-party vendors.";
        priority = "High";
        fixTime = "3 Days";
        scoreImp = "+5% Coverage";
      } else if (q.includes("critical") || q.includes("finding") || q.includes("gap")) {
        summary = "Identified 3 Critical Audit Findings: 1) Vague breach notification timeline ('reasonable time'), 2) Missing statutory DPO contact details, 3) Undefined data retention schedule.";
        reason = "Regulatory authorities require exact quantitative hours and explicit DPO designation rather than vague policy terminology.";
        reg = "GDPR Article 33 & Article 37";
        risk = "Audit failure during external ISO/SOC 2 certification and regulatory enforcement actions.";
        action = "Adopt AI-synthesized Clause 4.2 (Breach SLA) and Clause 9.1 (DPO Mandate) provided in the Recommendations tab.";
        priority = "Critical";
        fixTime = "12 Hours";
        scoreImp = "+8% Score Boost";
      } else if (q.includes("clause") || q.includes("generate")) {
        summary = `Generated Compliant Legal Addendum:\n\n"Section 4.2 Data Breach Notification SLA:\nIn the event of a confirmed or suspected Personal Data Breach, ${company} shall notify the Supervisory Authority without undue delay and, where feasible, not later than 72 hours after becoming aware of it. The notification shall detail the nature of the breach, affected data categories, DPO contact details, and immediate mitigation measures."`;
        reason = "Synthesized strictly according to GDPR Article 33 guidelines.";
        reg = "GDPR Article 33 — Notification of Personal Data Breach";
        risk = "Non-compliant policy language leads to delayed incident response and statutory non-compliance.";
        action = "Replace existing Section 4.2 in your policy PDF with this synthesized text and re-run audit verification.";
        priority = "High";
        fixTime = "1 Hour";
        scoreImp = "+4% Score Boost";
      } else if (q.includes("board") || q.includes("executive")) {
        summary = `Board Executive Briefing: ${company} exhibits strong enterprise security posture with a 92% Compliance Rating across active operational frameworks.`;
        reason = "Top management oversight is recommended to formalize the Data Protection Officer mandate and finalize subprocessor risk reviews.";
        reg = "GDPR & Board Governance Mandates";
        risk = "Minimal financial risk post-remediation; full audit readiness expected within 48 hours.";
        action = "Present the Executive Compliance Audit PDF to the Board of Directors during Q3 risk review.";
        priority = "Medium";
        fixTime = "1 Day";
        scoreImp = "+8% Enterprise Readiness";
      } else {
        summary = `Consultant Analysis: ${company}'s policy framework has been cross-referenced with your selected regulatory guidelines.`;
        reason = `Your prompt "${query}" was evaluated against statutory requirements and industry benchmarks.`;
        reg = "GDPR, ISO 27001 & SOC 2 Type II Standards";
        risk = "Unaddressed policy gaps may weaken defense posture during regulatory inquiries.";
        action = "Implement recommendations provided in the dedicated Analysis and Recommendations tabs.";
        priority = "Medium";
        fixTime = "2 Days";
        scoreImp = "+4% Score Boost";
      }

      return {
        summary,
        reason,
        reg,
        risk,
        action,
        priority,
        fixTime,
        scoreImp,
      };
    },
    [analysisResult, orgData]
  );

  // Send Message with Micro-Interactions & Word-by-Word Streaming
  const handleSendMessage = useCallback(
    async (textToSend) => {
      const text = (textToSend || inputValue).trim();
      if (!text || aiState !== "idle") return;

      stopSpeaking();

      // User Message
      const userMsg = {
        id: `user-${Date.now()}`,
        sender: "user",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        text,
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputValue("");

      // Micro-Interactions Live Reasoning Simulation
      setAiState("thinking");
      for (let i = 0; i < REASONING_STEPS.length; i++) {
        setReasoningStep(REASONING_STEPS[i]);
        await new Promise((res) => setTimeout(res, 350));
      }

      // Generate Structured Response
      const responseData = generateConsultantResponse(text);

      setAiState("generating");
      setReasoningStep("");

      // Word-by-Word Text Streaming
      const fullText = responseData.summary;
      const words = fullText.split(" ");
      let currentStream = "";

      for (let i = 0; i < words.length; i++) {
        currentStream += (i === 0 ? "" : " ") + words[i];
        setStreamingText(currentStream);
        await new Promise((res) => setTimeout(res, 25));
      }

      // Add Final AI Message to List
      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        structured: responseData,
      };

      setMessages((prev) => [...prev, aiMsg]);
      setStreamingText("");
      setAiState("idle");

      // Auto-narrate response
      speakText(responseData.summary);
    },
    [inputValue, aiState, generateConsultantResponse, speakText]
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleResetChat = () => {
    stopSpeaking();
    setMessages([]);
    setAiState("idle");
    setReasoningStep("");
  };

  return (
    <>
      {/* Floating Action Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          className="ai-copilot-launcher"
          onClick={() => setIsOpen(true)}
          aria-label="Open AI Compliance Assistant"
        >
          <span className="copilot-glow" aria-hidden="true" />
          <div className="copilot-icon-wrap">
            <Sparkles size={20} className="copilot-sparkle" />
          </div>
          <span className="copilot-label">AI Copilot</span>
          <span className="copilot-badge">Senior Officer</span>
        </button>
      )}

      {/* Glassmorphic AI Copilot Drawer */}
      {isOpen && (
        <aside
          className={`ai-chat-panel ${isMaximized ? "is-maximized" : ""}`}
          aria-label="AI Compliance Officer Drawer"
        >
          {/* Header Bar */}
          <header className="chat-header">
            <div className="chat-header-brand">
              <span className="chat-bot-avatar">
                <Bot size={20} />
              </span>
              <div>
                <div className="chat-title-row">
                  <h3>ComplyAI Copilot</h3>
                  <span className="chat-online-badge">
                    <span className="dot" /> Enterprise AI Officer
                  </span>
                </div>
                <p className="chat-subtitle">Senior Regulatory Consultant</p>
              </div>
            </div>

            <div className="chat-header-actions">
              <button
                type="button"
                className="btn-icon"
                onClick={() => onOpenUpgradeModal && onOpenUpgradeModal()}
                title="Upgrade to Pro"
                style={{
                  color: "#fbbf24",
                  background: "rgba(251, 191, 36, 0.15)",
                  border: "1px solid rgba(251, 191, 36, 0.3)",
                }}
              >
                <Crown size={15} />
              </button>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsMuted((prev) => !prev)}
                title={isMuted ? "Unmute Voice" : "Mute Voice"}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
              </button>
              <button
                type="button"
                className="btn-icon"
                onClick={handleResetChat}
                title="Reset conversation"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setIsMaximized((prev) => !prev)}
                title={isMaximized ? "Restore size" : "Maximize panel"}
              >
                {isMaximized ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
              <button
                type="button"
                className="btn-icon btn-close"
                onClick={() => {
                  stopSpeaking();
                  setIsOpen(false);
                }}
                title="Close assistant"
              >
                <X size={16} />
              </button>
            </div>
          </header>

          {/* Voice Waveform Equalizer Bar */}
          {(isVoiceActive || isSpeaking) && (
            <div className="voice-waveform-bar">
              <span className="wave-bar bar-1" />
              <span className="wave-bar bar-2" />
              <span className="wave-bar bar-3" />
              <span className="wave-bar bar-4" />
              <span className="wave-bar bar-5" />
              <span className="wave-label">
                {isVoiceActive ? "Listening to your query..." : "AI Officer Speaking..."}
              </span>
            </div>
          )}

          {/* Chat Messages Body with Smooth Independent Scroll */}
          <div className="chat-body-scrollable">
            {/* FIRST IMPRESSION: Premium Welcome Experience if messages empty */}
            {messages.length === 0 && !streamingText && (
              <div className="copilot-welcome-card">
                <div className="welcome-avatar-glow">
                  <Bot size={36} />
                </div>
                <h2>{getGreeting()}, {userName}.</h2>
                <p className="welcome-lead">
                  I've finished analyzing your compliance report for{" "}
                  <strong>{orgData?.companyName || "Acme Global Enterprise"}</strong>.
                </p>
                <div className="welcome-audit-pills">
                  <span className="audit-pill pill-score">
                    🎯 {analysisResult?.compliance_score || 92}% Compliance Score
                  </span>
                  <span className="audit-pill pill-risk">
                    ⚠️ 3 Critical Findings
                  </span>
                  <span className="audit-pill pill-recs">
                    ⚡ 8 AI Recommendations
                  </span>
                </div>
                <p className="welcome-ask">What would you like to inspect next?</p>

                {/* 8 Premium Executive Suggestion Cards */}
                <div className="suggestions-grid">
                  {EXECUTIVE_SUGGESTIONS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className="suggestion-btn"
                        onClick={() => handleSendMessage(item.prompt)}
                      >
                        <Icon size={16} className="sug-icon" />
                        <span>{item.label}</span>
                        <ArrowRight size={14} className="sug-arrow" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Conversation History */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-msg-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}
              >
                {msg.sender === "user" ? (
                  <div className="msg-bubble user-bubble">
                    <p>{msg.text}</p>
                    <span className="msg-time">{msg.timestamp}</span>
                  </div>
                ) : (
                  <div className="msg-bubble ai-bubble">
                    {msg.structured ? (
                      <div className="consultant-response-card">
                        {/* Executive Summary */}
                        <div className="resp-section resp-summary">
                          <div className="resp-badge-row">
                            <span className="consultant-title">🏛️ Senior Compliance Consultant</span>
                            <span className={`priority-badge ${msg.structured.priority.toLowerCase()}`}>
                              {msg.structured.priority} Priority
                            </span>
                          </div>
                          <p className="summary-text">{msg.structured.summary}</p>
                        </div>

                        {/* Structured Grid */}
                        <div className="resp-grid">
                          <div className="grid-cell">
                            <span className="cell-label">🎯 Legal Basis & Reason</span>
                            <p className="cell-val">{msg.structured.reason}</p>
                          </div>
                          <div className="grid-cell">
                            <span className="cell-label">📜 Applicable Regulation</span>
                            <p className="cell-val text-purple">{msg.structured.reg}</p>
                          </div>
                          <div className="grid-cell">
                            <span className="cell-label">⚠️ Business & Operational Risk</span>
                            <p className="cell-val text-amber">{msg.structured.risk}</p>
                          </div>
                          <div className="grid-cell">
                            <span className="cell-label">🛡️ Recommended Action</span>
                            <p className="cell-val text-green">{msg.structured.action}</p>
                          </div>
                        </div>

                        {/* Footer Metrics */}
                        <div className="resp-footer-metrics">
                          <span className="metric-tag">⏱️ Est. Fix Time: {msg.structured.fixTime}</span>
                          <span className="metric-tag tag-score">📈 Impact: {msg.structured.scoreImp}</span>
                        </div>
                      </div>
                    ) : (
                      <p>{msg.text}</p>
                    )}
                    <span className="msg-time">{msg.timestamp}</span>
                  </div>
                )}
              </div>
            ))}

            {/* Live Reasoning Animation */}
            {aiState === "thinking" && (
              <div className="reasoning-indicator-card">
                <Loader2 size={16} className="spin-purple" />
                <span>{reasoningStep || "Analyzing compliance context..."}</span>
              </div>
            )}

            {/* Live Word-by-Word Streaming Box */}
            {streamingText && (
              <div className="chat-msg-row ai-row">
                <div className="msg-bubble ai-bubble streaming-bubble">
                  <p>{streamingText}</p>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <footer className="chat-footer">
            <div className="input-wrap">
              <button
                type="button"
                className={`btn-mic-icon ${isVoiceActive ? "is-active-mic" : ""}`}
                onClick={toggleVoiceInput}
                title={isVoiceActive ? "Stop Voice Input" : "Start Voice Assistant"}
              >
                {isVoiceActive ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <textarea
                ref={inputRef}
                rows={1}
                className="chat-input"
                placeholder="Ask your AI Compliance Officer..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                type="button"
                className="btn-send-msg"
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || aiState !== "idle"}
              >
                <Send size={16} />
              </button>
            </div>
            <div className="copilot-footer-note">
              <span>Powered by Gemini 2.5 • Context-Aware Enterprise Copilot</span>
            </div>
          </footer>
        </aside>
      )}
    </>
  );
}
