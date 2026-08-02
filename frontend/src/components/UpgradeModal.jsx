import React, { useState } from "react";
import {
  Crown,
  CheckCircle2,
  X,
  Sparkles,
  Zap,
  ShieldCheck,
  CreditCard,
  QrCode,
  Smartphone,
  Check,
  ArrowRight,
  Lock,
} from "lucide-react";
import "./UpgradeModal.css";

const PAYMENT_METHODS = [
  {
    id: "paytm",
    name: "Paytm",
    type: "UPI / Wallet",
    icon: "🔵",
    color: "#00b9f1",
    placeholder: "Enter Paytm UPI ID (e.g. 9876543210@paytm)",
  },
  {
    id: "phonepe",
    name: "PhonePe",
    type: "UPI App",
    icon: "🟣",
    color: "#5f259f",
    placeholder: "Enter PhonePe UPI ID (e.g. username@ybl)",
  },
  {
    id: "gpay",
    name: "Google Pay",
    type: "GPay Instant",
    icon: "🟢",
    color: "#4285f4",
    placeholder: "Enter GPay VPA (e.g. username@okaxis)",
  },
  {
    id: "upi_qr",
    name: "BHIM / UPI QR",
    type: "Scan QR Code",
    icon: "⚡",
    color: "#ff9900",
    placeholder: "Enter Any UPI VPA or Scan QR Code",
  },
  {
    id: "card",
    name: "Credit / Debit Card",
    type: "Visa, Mastercard, RuPay",
    icon: "💳",
    color: "#8b5cf7",
    placeholder: "Card Number (16 digits)",
  },
];

export default function UpgradeModal({ isOpen, onClose }) {
  const [selectedMethod, setSelectedMethod] = useState("paytm");
  const [upiId, setUpiId] = useState("suryansh@paytm");
  const [cardNumber, setCardNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const currentMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

  const handleActivateTrial = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      alert(
        `🎉 14-Day Free Trial Activated via ${currentMethod.name}!\n\nWelcome Suryansh Pandey to ComplyAI Pro.\nNo payment charged today (₹0 / $0). Next billing starts in 14 days.`
      );
      onClose();
    }, 800);
  };

  return (
    <div className="upgrade-modal-overlay" onClick={onClose}>
      <div className="upgrade-modal-content" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="upgrade-modal-close" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="upgrade-modal-header">
          <div className="crown-glow-wrap">
            <Crown size={32} className="crown-glow-icon" />
          </div>
          <h2>Upgrade to ComplyAI Pro</h2>
          <p>Start your 14-day free trial with zero risk. Select your preferred payment option.</p>
        </div>

        {/* Plan Details Card */}
        <div className="pricing-badge-row">
          <div className="price-tag">
            <span className="price-num">₹3,999</span>
            <span className="price-period">/ month</span>
          </div>
          <div className="trial-badge-wrap">
            <span className="trial-badge">✨ 14-Day Free Trial</span>
            <span className="charge-today-tag">₹0 Charged Today</span>
          </div>
        </div>

        {/* Select Payment Method (Paytm, PhonePe, GPay, UPI QR, Card) */}
        <div className="payment-section">
          <label className="payment-label">Select Payment Method for Trial Verification:</label>
          <div className="payment-methods-grid">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = selectedMethod === method.id;
              return (
                <button
                  key={method.id}
                  type="button"
                  className={`pm-card ${isSelected ? "is-selected" : ""}`}
                  style={{
                    borderColor: isSelected ? method.color : "rgba(255, 255, 255, 0.08)",
                  }}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <span className="pm-icon">{method.icon}</span>
                  <div className="pm-info">
                    <span className="pm-name">{method.name}</span>
                    <span className="pm-type">{method.type}</span>
                  </div>
                  {isSelected && <Check size={16} className="pm-check" style={{ color: method.color }} />}
                </button>
              );
            })}
          </div>

          {/* Payment Method Inputs */}
          <div className="payment-input-box">
            {selectedMethod !== "card" ? (
              <div className="upi-input-group">
                <div className="upi-icon-badge">{currentMethod.icon}</div>
                <input
                  type="text"
                  className="upi-field"
                  placeholder={currentMethod.placeholder}
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <span className="upi-verified-badge">
                  <ShieldCheck size={14} /> Verified
                </span>
              </div>
            ) : (
              <div className="card-inputs-wrap">
                <input
                  type="text"
                  className="upi-field"
                  placeholder="Card Number (4532 •••• •••• 8921)"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
                <div className="card-sub-row">
                  <input type="text" className="upi-field-sm" placeholder="MM/YY" defaultValue="12/28" />
                  <input type="password" className="upi-field-sm" placeholder="CVV" defaultValue="•••" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Features Summary */}
        <div className="upgrade-features-list">
          <div className="up-feat-item">
            <CheckCircle2 size={15} className="check-purple" />
            <span>Unlimited Policy & Regulatory Document AI Audits</span>
          </div>
          <div className="up-feat-item">
            <CheckCircle2 size={15} className="check-purple" />
            <span>500+ Global Compliance Frameworks (GDPR, ISO 27001, SOC 2, CCPA)</span>
          </div>
          <div className="up-feat-item">
            <CheckCircle2 size={15} className="check-purple" />
            <span>Automated PDF Executive Audit Report Exporting</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="upgrade-modal-actions">
          <button
            type="button"
            className="btn-activate-pro"
            onClick={handleActivateTrial}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing Auto-Mandate..." : `Start 14-Day Free Trial via ${currentMethod.name} ✨`}
          </button>
          <div className="security-guarantee-row">
            <Lock size={12} />
            <span>100% Encrypted Payment • ₹0 Charged Today • Cancel Anytime</span>
          </div>
        </div>
      </div>
    </div>
  );
}
