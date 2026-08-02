import React, { useState, useEffect, useRef } from "react";

/**
 * Custom Hook for Smooth Number Counting (0 -> Target)
 */
function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease-out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(animationFrameId);
  }, [target, duration]);

  return count;
}

/**
 * Circular Gauge Chart for Overall Compliance Score
 */
export const CircularGauge = ({ score = 92, label = "High Compliance" }) => {
  const animatedScore = useCountUp(score, 1500);
  const radius = 64;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div
      className="gauge-container"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "transform 0.3s ease, filter 0.3s ease",
      }}
    >
      <svg width={160} height={160} viewBox="0 0 160 160">
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f7cff" />
            <stop offset="100%" stopColor="#8b5cf7" />
          </linearGradient>
          <filter id="gaugeGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Continuous Rotating Ring (10s per rotation) */}
        <circle
          cx="80"
          cy="80"
          r={radius + 8}
          fill="none"
          stroke="rgba(139, 92, 246, 0.25)"
          strokeWidth="1.5"
          strokeDasharray="6 10"
          style={{
            transformOrigin: "80px 80px",
            animation: "rotateOuterRing 10s linear infinite",
          }}
        />

        {/* Background Base Circle */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
        />

        {/* Progress Circle (Draws Gradually) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 80 80)"
          filter="url(#gaugeGlowFilter)"
          style={{ transition: "stroke-dashoffset 0.1s linear" }}
        />
      </svg>

      <div style={{ position: "absolute", textAlign: "center" }}>
        <div
          style={{
            fontSize: "32px",
            fontWeight: "700",
            fontFamily: "var(--font-display, system-ui, sans-serif)",
            color: "#ffffff",
          }}
        >
          {animatedScore}%
        </div>
        <div style={{ fontSize: "11px", fontWeight: "600", color: "#a0aec0" }}>
          {label}
        </div>
      </div>
    </div>
  );
};

/**
 * Donut Ring Chart for Risk Distribution
 */
export const DonutChart = ({ total = 22, critical = 5, high = 8, medium = 9 }) => {
  const animatedTotal = useCountUp(total, 1400);
  const [hoveredSegment, setHoveredSegment] = useState(null);

  const radius = 54;
  const strokeWidth = 16;
  const circumference = 2 * Math.PI * radius;

  const criticalPct = critical / total;
  const highPct = high / total;
  const mediumPct = medium / total;

  const cOffset = 0;
  const hOffset = circumference * criticalPct;
  const mOffset = circumference * (criticalPct + highPct);

  return (
    <div
      className="donut-container"
      style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={160} height={160} viewBox="0 0 160 160">
        {/* Critical Segment (Red) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#f43f5e"
          strokeWidth={hoveredSegment === "critical" ? strokeWidth + 4 : strokeWidth}
          strokeDasharray={`${circumference * criticalPct - 2} ${circumference}`}
          strokeDashoffset={-cOffset}
          transform="rotate(-90 80 80)"
          style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
          onMouseEnter={() => setHoveredSegment("critical")}
          onMouseLeave={() => setHoveredSegment(null)}
        />
        {/* High Segment (Orange) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#f97316"
          strokeWidth={hoveredSegment === "high" ? strokeWidth + 4 : strokeWidth}
          strokeDasharray={`${circumference * highPct - 2} ${circumference}`}
          strokeDashoffset={-hOffset}
          transform="rotate(-90 80 80)"
          style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
          onMouseEnter={() => setHoveredSegment("high")}
          onMouseLeave={() => setHoveredSegment(null)}
        />
        {/* Medium Segment (Yellow/Amber) */}
        <circle
          cx="80"
          cy="80"
          r={radius}
          fill="none"
          stroke="#eab308"
          strokeWidth={hoveredSegment === "medium" ? strokeWidth + 4 : strokeWidth}
          strokeDasharray={`${circumference * mediumPct - 2} ${circumference}`}
          strokeDashoffset={-mOffset}
          transform="rotate(-90 80 80)"
          style={{ cursor: "pointer", transition: "stroke-width 0.2s ease" }}
          onMouseEnter={() => setHoveredSegment("medium")}
          onMouseLeave={() => setHoveredSegment(null)}
        />
      </svg>

      <div style={{ position: "absolute", textAlign: "center", pointerEvents: "none" }}>
        <div style={{ fontSize: "28px", fontWeight: "700", fontFamily: "var(--font-display)", color: "#ffffff" }}>
          {animatedTotal}
        </div>
        <div style={{ fontSize: "11px", color: "#94a3b8" }}>Total Findings</div>
      </div>

      {/* Segment Hover Tooltip */}
      {hoveredSegment && (
        <div
          style={{
            position: "absolute",
            bottom: "-32px",
            background: "#0f172a",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "6px",
            padding: "4px 10px",
            fontSize: "11px",
            color: "#ffffff",
            boxShadow: "0 4px 14px rgba(0,0,0,0.6)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {hoveredSegment === "critical" && `Critical: ${critical} (${Math.round(criticalPct * 100)}%)`}
          {hoveredSegment === "high" && `High: ${high} (${Math.round(highPct * 100)}%)`}
          {hoveredSegment === "medium" && `Medium: ${medium} (${Math.round(mediumPct * 100)}%)`}
        </div>
      )}
    </div>
  );
};

/**
 * Line / Area Trend Chart for Compliance Over Time (Curved SVG with Interactive Dots)
 */
export const TrendLineChart = ({ score = 92 }) => {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const baseScore = Math.max(30, score - 27);
  const m1 = baseScore;
  const m2 = Math.min(98, baseScore + 7);
  const m3 = Math.min(98, baseScore + 13);
  const m4 = Math.min(98, baseScore + 19);
  const m5 = Math.min(98, baseScore + 23);
  const m6 = score;

  const getY = (val) => Math.max(25, Math.min(135, 145 - (val * 1.15)));

  const monthsData = [
    { month: "Jan", score: m1, change: "+0%", x: 30, y: getY(m1) },
    { month: "Feb", score: m2, change: `+${m2 - m1}%`, x: 96, y: getY(m2) },
    { month: "Mar", score: m3, change: `+${m3 - m2}%`, x: 162, y: getY(m3) },
    { month: "Apr", score: m4, change: `+${m4 - m3}%`, x: 228, y: getY(m4) },
    { month: "May", score: m5, change: `+${m5 - m4}%`, x: 294, y: getY(m5) },
    { month: "Jun", score: m6, change: `+${m6 - m5}%`, x: 360, y: getY(m6) },
  ];

  const pathD = `M 30,${getY(m1)} C 70,${getY(m2)} 120,${getY(m3)} 162,${getY(m3)} C 210,${getY(m4)} 260,${getY(m5)} 360,${getY(m6)}`;
  const areaD = `${pathD} L 360,150 L 30,150 Z`;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <svg width="100%" height="160" viewBox="0 0 400 160" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradientCurved" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
          <filter id="pointGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid Lines */}
        <line x1="0" y1="35" x2="400" y2="35" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
        <line x1="0" y1="75" x2="400" y2="75" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />
        <line x1="0" y1="115" x2="400" y2="115" stroke="rgba(255,255,255,0.06)" strokeDasharray="4" />

        {/* Smooth Curved Area Fill */}
        <path d={areaD} fill="url(#areaGradientCurved)" />

        {/* Smooth Curved Trend Line (Bézier Curve) */}
        <path
          d={pathD}
          fill="none"
          stroke="#38bdf8"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Interactive Data Points for Each Month */}
        {monthsData.map((pt, idx) => {
          const isHovered = hoveredPoint === idx;
          const isLatest = idx === monthsData.length - 1;

          return (
            <g
              key={idx}
              onMouseEnter={() => setHoveredPoint(idx)}
              onMouseLeave={() => setHoveredPoint(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Pulse outer ring on latest point */}
              {isLatest && !isHovered && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="9"
                  fill="none"
                  stroke="#38bdf8"
                  strokeOpacity="0.5"
                  style={{ animation: "pulsePulseDot 2s infinite ease-in-out" }}
                />
              )}

              {/* Hover ring */}
              {isHovered && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="9"
                  fill="rgba(56, 189, 248, 0.25)"
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
              )}

              <circle
                cx={pt.x}
                cy={pt.y}
                r={isHovered ? "6" : "4.5"}
                fill="#38bdf8"
                stroke="#0b0f19"
                strokeWidth="2"
                filter={isLatest ? "url(#pointGlow)" : ""}
              />
            </g>
          );
        })}
      </svg>

      {/* Interactive Month Tooltip */}
      {hoveredPoint !== null && (
        <div
          style={{
            position: "absolute",
            top: `${monthsData[hoveredPoint].y - 45}px`,
            left: `${(monthsData[hoveredPoint].x / 400) * 100}%`,
            transform: "translateX(-50%)",
            background: "#0f172a",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            borderRadius: "6px",
            padding: "4px 10px",
            fontSize: "11px",
            color: "#ffffff",
            boxShadow: "0 6px 16px rgba(0, 0, 0, 0.8)",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 40,
          }}
        >
          <div style={{ fontWeight: "700", color: "#38bdf8" }}>{monthsData[hoveredPoint].month}</div>
          <div>Compliance: <strong>{monthsData[hoveredPoint].score}%</strong></div>
          <div style={{ color: "#34d399", fontSize: "10px" }}>Change: {monthsData[hoveredPoint].change}</div>
        </div>
      )}
    </div>
  );
};

/**
 * Premium Enterprise Radar / Spider Web Chart for Compliance by Category
 */
export const RadarChart = ({ score = 92, categories: customCategories }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all"); // "all" | "yourScore" | "required"

  const categories = customCategories || [
    { name: "Data Protection", score: Math.max(35, Math.min(100, score - 3)), required: 100, labelPos: { x: 180, y: 25, anchor: "middle" } },
    { name: "User Rights", score: Math.max(35, Math.min(100, score + 3)), required: 100, labelPos: { x: 295, y: 115, anchor: "start" } },
    { name: "Vendor Agreement", score: Math.max(35, Math.min(100, score - 7)), required: 100, labelPos: { x: 255, y: 265, anchor: "start" } },
    { name: "Governance", score: Math.max(35, Math.min(100, score)), required: 100, labelPos: { x: 105, y: 265, anchor: "end" } },
    { name: "Data Retention", score: Math.max(35, Math.min(100, score - 14)), required: 100, labelPos: { x: 65, y: 115, anchor: "end" } },
  ];

  const cx = 180;
  const cy = 150;
  const maxR = 95;

  const angles = [-90, -18, 54, 126, 198].map((deg) => (deg * Math.PI) / 180);

  const getPoint = (rRatio, angleIndex) => {
    const r = maxR * rRatio;
    const a = angles[angleIndex];
    return {
      x: cx + r * Math.cos(a),
      y: cy + r * Math.sin(a),
    };
  };

  const reqPoints = angles.map((_, i) => getPoint(1.0, i));
  const reqPointsStr = reqPoints.map((p) => `${p.x},${p.y}`).join(" ");
  const gridLevels = [0.25, 0.5, 0.75, 1.0];

  const scorePoints = categories.map((cat, i) => getPoint(cat.score / 100, i));
  const scorePointsStr = scorePoints.map((p) => `${p.x},${p.y}`).join(" ");

  const avgCategoryScore = Math.round(categories.reduce((acc, c) => acc + c.score, 0) / categories.length);

  return (
    <div className="enterprise-radar-wrapper" style={{ position: "relative", width: "100%", textAlign: "center" }}>
      <svg width="360" height="290" viewBox="0 0 360 290" style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id="blueRadarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity={activeFilter === "required" ? "0.1" : "0.55"} />
            <stop offset="100%" stopColor="#8b5cf7" stopOpacity={activeFilter === "required" ? "0.05" : "0.2"} />
          </linearGradient>
          <filter id="blueGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* 1. Subtle Concentric Pentagon Grid Lines */}
        {gridLevels.map((lvl, idx) => {
          const pts = angles.map((_, i) => getPoint(lvl, i)).map((p) => `${p.x},${p.y}`).join(" ");
          return (
            <polygon
              key={idx}
              points={pts}
              fill="none"
              stroke="rgba(255, 255, 255, 0.07)"
              strokeWidth="1"
            />
          );
        })}

        {/* 2. Axis Spokes */}
        {reqPoints.map((p, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={p.x}
            y2={p.y}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />
        ))}

        {/* 3. Thin Dashed Grey Polygon (Required Baseline) */}
        <polygon
          points={reqPointsStr}
          fill="none"
          stroke={activeFilter === "required" ? "#38bdf8" : "rgba(148, 163, 184, 0.5)"}
          strokeWidth={activeFilter === "required" ? "2.5" : "1.5"}
          strokeDasharray="4 4"
        />

        {/* 4. Solid Blue Filled Polygon (Your Score) */}
        <polygon
          points={scorePointsStr}
          fill="url(#blueRadarGradient)"
          stroke="#60a5fa"
          strokeWidth={activeFilter === "yourScore" ? "3.5" : "2.5"}
          style={{ transition: "all 0.3s ease" }}
        />

        {/* 5. Outer Category Labels & Percentages */}
        {categories.map((cat, i) => (
          <g
            key={i}
            transform={`translate(${cat.labelPos.x}, ${cat.labelPos.y})`}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ cursor: "pointer" }}
          >
            <text
              textAnchor={cat.labelPos.anchor}
              fill={hoveredIdx === i ? "#38bdf8" : "#f1f5f9"}
              fontSize="11.5"
              fontWeight="600"
              fontFamily="var(--font-body, system-ui, sans-serif)"
            >
              {cat.name}
            </text>
            <text
              textAnchor={cat.labelPos.anchor}
              y="14"
              fill={cat.score >= 80 ? "#34d399" : cat.score >= 60 ? "#fbbf24" : "#f87171"}
              fontSize="12"
              fontWeight="700"
              fontFamily="var(--font-display, system-ui, sans-serif)"
            >
              {cat.score}%
            </text>
          </g>
        ))}

        {/* 6. Glowing Points on Vertices */}
        {scorePoints.map((p, i) => {
          const isHovered = hoveredIdx === i;
          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              style={{ cursor: "pointer" }}
            >
              {isHovered && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="12"
                  fill="rgba(96, 165, 250, 0.3)"
                  stroke="#60a5fa"
                  strokeWidth="1.5"
                />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? "6" : "4.5"}
                fill={categories[i].score >= 80 ? "#34d399" : categories[i].score >= 60 ? "#fbbf24" : "#f87171"}
                stroke="#0f172a"
                strokeWidth="2"
                filter="url(#blueGlow)"
              />
            </g>
          );
        })}
      </svg>

      {/* Hover Tooltip Overlay */}
      {hoveredIdx !== null && (
        <div
          className="radar-tooltip-card"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(15, 23, 42, 0.95)",
            border: "1px solid rgba(96, 165, 250, 0.5)",
            borderRadius: "10px",
            padding: "10px 14px",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.85)",
            zIndex: 30,
            pointerEvents: "none",
            textAlign: "left",
            minWidth: "170px",
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: "700", color: "#f1f5f9", marginBottom: "4px" }}>
            {categories[hoveredIdx].name}
          </div>
          <div style={{ fontSize: "11px", color: "#60a5fa", fontWeight: "600" }}>
            Your Category Score: <strong>{categories[hoveredIdx].score}%</strong>
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>
            Required Target: <strong>{categories[hoveredIdx].required}%</strong>
          </div>
          <div style={{ fontSize: "11px", color: categories[hoveredIdx].score >= 80 ? "#34d399" : "#f87171", fontWeight: "600", marginTop: "2px" }}>
            Gap Delta: <strong>{categories[hoveredIdx].score - categories[hoveredIdx].required}%</strong>
          </div>
        </div>
      )}

      {/* Interactive Legend Row */}
      <div
        className="radar-legend-row"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          marginTop: "12px",
          paddingTop: "10px",
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <button
          type="button"
          onClick={() => setActiveFilter((prev) => (prev === "yourScore" ? "all" : "yourScore"))}
          title="Click to toggle Your Score filter"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: activeFilter === "yourScore" ? "rgba(96, 165, 250, 0.2)" : "rgba(255, 255, 255, 0.04)",
            border: activeFilter === "yourScore" ? "1px solid #60a5fa" : "1px solid rgba(255, 255, 255, 0.08)",
            padding: "4px 10px",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <span
            style={{
              width: "14px",
              height: "3px",
              background: "#60a5fa",
              borderRadius: "2px",
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: "12px", color: "#60a5fa", fontWeight: "700" }}>
            Your Score ({avgCategoryScore}%)
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter((prev) => (prev === "required" ? "all" : "required"))}
          title="Click to toggle Required Baseline"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: activeFilter === "required" ? "rgba(148, 163, 184, 0.2)" : "rgba(255, 255, 255, 0.04)",
            border: activeFilter === "required" ? "1px solid #94a3b8" : "1px solid rgba(255, 255, 255, 0.08)",
            padding: "4px 10px",
            borderRadius: "6px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <span
            style={{
              width: "14px",
              height: "2px",
              borderTop: "2px dashed #94a3b8",
              display: "inline-block",
            }}
          />
          <span style={{ fontSize: "12px", color: "#94a3b8", fontWeight: "600" }}>
            Required Target (100%)
          </span>
        </button>
      </div>
    </div>
  );
};

