"use client";

import { useEffect, useState } from "react";

const RAMADAN_END = new Date("2026-03-20T00:00:00");

// ── SVGs ────────────────────────────────────────────────────────────────────

function CrescentMoon({ size = 40, color = "#f59e0b", opacity = 0.22 }: { size?: number; color?: string; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 50 50" fill="none" style={{ opacity }}>
      <path
        d="M25 5 C14 5 5 14 5 25 S14 45 25 45 C31 45 36 42 40 37 C36 38 31 38 27 36 C18 33 12 24 14 15 C16 8 20 5 25 5Z"
        fill={color}
      />
    </svg>
  );
}

function StarFour({ size = 14, color = "#fbbf24", opacity = 0.5 }: { size?: number; color?: string; opacity?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" style={{ opacity }}>
      <path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill={color} />
    </svg>
  );
}

function Lantern({ size = 36, color = "#c0392b", opacity = 0.22 }: { size?: number; color?: string; opacity?: number }) {
  const glow = color === "#c0392b" ? "#f97316" : "#fbbf24";
  return (
    <svg width={size} height={Math.round(size * 1.6)} viewBox="0 0 36 58" fill="none" style={{ opacity }}>
      {/* Chain */}
      <rect x="16" y="0" width="4" height="7" rx="2" fill={color} />
      {/* Top cap */}
      <rect x="8" y="6" width="20" height="5" rx="2" fill={color} />
      {/* Body */}
      <rect x="6" y="11" width="24" height="30" rx="6" fill={color} />
      {/* Inner glow */}
      <rect x="10" y="15" width="16" height="22" rx="4" fill={glow} opacity="0.35" />
      {/* Ribs */}
      <line x1="6" y1="20" x2="30" y2="20" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      <line x1="6" y1="28" x2="30" y2="28" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      <line x1="6" y1="36" x2="30" y2="36" stroke="rgba(0,0,0,0.2)" strokeWidth="1.5" />
      {/* Bottom cap */}
      <rect x="8" y="41" width="20" height="5" rx="2" fill={color} />
      {/* Tassel */}
      <rect x="15" y="46" width="6" height="3" rx="1" fill={color} />
      <line x1="16" y1="49" x2="16" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="49" x2="20" y2="56" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="57" r="1.5" fill={color} />
      <circle cx="20" cy="57" r="1.5" fill={color} />
    </svg>
  );
}

function Mosque({ size = 48, color = "#8b1c2d", opacity = 0.12 }: { size?: number; color?: string; opacity?: number }) {
  return (
    <svg width={size} height={Math.round(size * 0.9)} viewBox="0 0 80 72" fill="none" style={{ opacity }}>
      {/* Main dome */}
      <path d="M40 4 C22 4 10 16 10 30 L10 42 L70 42 L70 30 C70 16 58 4 40 4Z" fill={color} />
      {/* Crescent on top */}
      <path d="M40 2 C36 2 33 5 33 9 S36 16 40 16 C43 16 45 14 46 12 C44 13 42 13 40 12 C37 11 35 9 35 7 C35 5 37 2 40 2Z" fill="#f59e0b" opacity="2" />
      {/* Body */}
      <rect x="10" y="42" width="60" height="28" rx="2" fill={color} />
      {/* Door arch */}
      <path d="M32 70 L32 52 Q40 44 48 52 L48 70 Z" fill="rgba(0,0,0,0.3)" />
      {/* Windows */}
      <path d="M15 50 Q20 44 25 50 L25 60 L15 60 Z" fill="rgba(0,0,0,0.25)" />
      <path d="M55 50 Q60 44 65 50 L65 60 L55 60 Z" fill="rgba(0,0,0,0.25)" />
      {/* Minarets */}
      <rect x="2" y="28" width="8" height="42" rx="2" fill={color} />
      <path d="M6 28 C3 22 9 22 6 28Z" fill={color} />
      <rect x="70" y="28" width="8" height="42" rx="2" fill={color} />
      <path d="M74 28 C71 22 77 22 74 28Z" fill={color} />
    </svg>
  );
}

// ── Decoration definitions ───────────────────────────────────────────────────

const ITEMS = [
  // Left side
  { id: 1,  x: "0.5%",  y: "10vh", type: "lantern",  size: 42, color: "#c0392b", opacity: 0.28, anim: "sway",       dur: "5s",  delay: "0s"   },
  { id: 2,  x: "1%",    y: "38vh", type: "crescent", size: 44, color: "#f59e0b", opacity: 0.22, anim: "floatSlow",  dur: "8s",  delay: "1s"   },
  { id: 3,  x: "0%",    y: "63vh", type: "lantern",  size: 32, color: "#8b1c2d", opacity: 0.22, anim: "sway",       dur: "6s",  delay: "2.5s" },
  { id: 4,  x: "2%",    y: "82vh", type: "crescent", size: 30, color: "#fbbf24", opacity: 0.18, anim: "floatMed",   dur: "7s",  delay: "0.5s" },
  { id: 5,  x: "1.5%",  y: "88vh", type: "mosque",   size: 52, color: "#8b1c2d", opacity: 0.13, anim: "floatSlow",  dur: "10s", delay: "3s"   },

  // Right side
  { id: 6,  x: "94%",   y: "8vh",  type: "crescent", size: 50, color: "#f59e0b", opacity: 0.24, anim: "floatSlow",  dur: "9s",  delay: "0.8s" },
  { id: 7,  x: "95.5%", y: "28vh", type: "lantern",  size: 40, color: "#e05c72", opacity: 0.26, anim: "sway",       dur: "5.5s",delay: "1.8s" },
  { id: 8,  x: "94%",   y: "55vh", type: "crescent", size: 36, color: "#fde68a", opacity: 0.2,  anim: "floatMed",   dur: "7s",  delay: "2s"   },
  { id: 9,  x: "96%",   y: "75vh", type: "lantern",  size: 28, color: "#c0392b", opacity: 0.2,  anim: "sway",       dur: "6.5s",delay: "0.3s" },
  { id: 10, x: "93.5%", y: "88vh", type: "mosque",   size: 56, color: "#8b1c2d", opacity: 0.12, anim: "floatSlow",  dur: "11s", delay: "4s"   },

  // Scattered sparkle stars
  { id: 11, x: "6%",    y: "18vh", type: "star",     size: 12, color: "#fbbf24", opacity: 0.55, anim: "twinkle",    dur: "3s",  delay: "0.1s" },
  { id: 12, x: "8%",    y: "50vh", type: "star",     size: 9,  color: "#fde68a", opacity: 0.45, anim: "twinkle",    dur: "4s",  delay: "1.2s" },
  { id: 13, x: "5%",    y: "72vh", type: "star",     size: 11, color: "#fbbf24", opacity: 0.5,  anim: "twinkle",    dur: "3.5s",delay: "2.3s" },
  { id: 14, x: "88%",   y: "20vh", type: "star",     size: 10, color: "#fde68a", opacity: 0.5,  anim: "twinkle",    dur: "3.8s",delay: "0.6s" },
  { id: 15, x: "90%",   y: "46vh", type: "star",     size: 13, color: "#fbbf24", opacity: 0.55, anim: "twinkle",    dur: "2.8s",delay: "1.7s" },
  { id: 16, x: "87%",   y: "68vh", type: "star",     size: 8,  color: "#fde68a", opacity: 0.4,  anim: "twinkle",    dur: "4.2s",delay: "3.1s" },
];

const ANIM_MAP: Record<string, string> = {
  sway:      "ramadan-sway",
  floatSlow: "ramadan-float-slow",
  floatMed:  "ramadan-float-med",
  twinkle:   "ramadan-twinkle",
};

export default function RamadanDecorations() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(new Date() < RAMADAN_END);
  }, []);

  if (!active) return null;

  return (
    <>
      <style>{`
        @keyframes ramadan-float-slow {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          33%      { transform: translateY(-16px) rotate(5deg); }
          66%      { transform: translateY(-7px) rotate(-3deg); }
        }
        @keyframes ramadan-float-med {
          0%,100% { transform: translateY(0px) rotate(0deg); }
          50%      { transform: translateY(-12px) rotate(-6deg); }
        }
        @keyframes ramadan-twinkle {
          0%,100% { opacity: 0.08; transform: scale(0.7) rotate(0deg); }
          20%      { opacity: 0.6;  transform: scale(1.2) rotate(20deg); }
          50%      { opacity: 0.2;  transform: scale(0.85) rotate(45deg); }
          75%      { opacity: 0.5;  transform: scale(1.1) rotate(30deg); }
        }
        @keyframes ramadan-sway {
          0%,100% { transform: rotate(-8deg) translateX(0px); }
          50%      { transform: rotate(8deg)  translateX(2px); }
        }
        .ramadan-glow-left {
          position: fixed;
          left: -60px;
          top: 30vh;
          width: 180px;
          height: 40vh;
          background: radial-gradient(ellipse, rgba(139,28,45,0.12) 0%, transparent 70%);
          pointer-events: none;
          z-index: 9;
        }
        .ramadan-glow-right {
          position: fixed;
          right: -60px;
          top: 20vh;
          width: 180px;
          height: 40vh;
          background: radial-gradient(ellipse, rgba(245,158,11,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 9;
        }
      `}</style>

      {/* Soft ambient glows on sides */}
      <div className="ramadan-glow-left" aria-hidden="true" />
      <div className="ramadan-glow-right" aria-hidden="true" />

      {/* Decorative elements */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 10 }}
        aria-hidden="true"
      >
        {ITEMS.map((d) => (
          <div
            key={d.id}
            style={{
              position: "absolute",
              left: d.x,
              top: d.y,
              animation: `${ANIM_MAP[d.anim]} ${d.dur} ease-in-out infinite`,
              animationDelay: d.delay,
              filter: d.type === "lantern"
                ? `drop-shadow(0 0 6px ${d.color}60)`
                : d.type === "crescent"
                ? `drop-shadow(0 0 8px ${d.color}50)`
                : "none",
            }}
          >
            {d.type === "crescent" && <CrescentMoon size={d.size} color={d.color} opacity={d.opacity} />}
            {d.type === "star"     && <StarFour     size={d.size} color={d.color} opacity={d.opacity} />}
            {d.type === "lantern"  && <Lantern      size={d.size} color={d.color} opacity={d.opacity} />}
            {d.type === "mosque"   && <Mosque       size={d.size} color={d.color} opacity={d.opacity} />}
          </div>
        ))}
      </div>
    </>
  );
}
