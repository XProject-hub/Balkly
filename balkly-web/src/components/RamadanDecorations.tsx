"use client";

import { useEffect, useState } from "react";

const RAMADAN_END = new Date("2026-03-20T00:00:00");

// SVG crescent moon
function Crescent({ size = 32, opacity = 0.18, color = "#f59e0b" }: { size?: number; opacity?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      style={{ opacity }}
    >
      <path
        d="M16 2C9.373 2 4 7.373 4 14s5.373 12 12 12c1.48 0 2.9-.267 4.207-.754C17.87 27.056 14.5 28 11 28 5.477 28 1 23.523 1 18S5.477 8 11 8c1.18 0 2.313.208 3.364.587A11.962 11.962 0 0116 2z"
        fill={color}
      />
    </svg>
  );
}

// SVG 4-point star / sparkle
function Sparkle({ size = 12, opacity = 0.25, color = "#fbbf24" }: { size?: number; opacity?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      style={{ opacity }}
    >
      <path
        d="M8 0 L9.2 6.8 L16 8 L9.2 9.2 L8 16 L6.8 9.2 L0 8 L6.8 6.8 Z"
        fill={color}
      />
    </svg>
  );
}

// Lantern SVG (simplified)
function Lantern({ size = 28, opacity = 0.16, color = "#e05c72" }: { size?: number; opacity?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size * 1.4}
      viewBox="0 0 28 38"
      fill="none"
      style={{ opacity }}
    >
      {/* Chain top */}
      <rect x="12" y="0" width="4" height="5" rx="1" fill={color} />
      {/* Body */}
      <rect x="4" y="5" width="20" height="24" rx="5" fill={color} />
      {/* Center glow stripe */}
      <rect x="10" y="9" width="8" height="16" rx="2" fill="rgba(255,200,100,0.3)" />
      {/* Horizontal bands */}
      <rect x="4" y="11" width="20" height="2" rx="1" fill="rgba(0,0,0,0.2)" />
      <rect x="4" y="20" width="20" height="2" rx="1" fill="rgba(0,0,0,0.2)" />
      {/* Tassel */}
      <rect x="10" y="29" width="8" height="2" rx="1" fill={color} />
      <rect x="11" y="31" width="2" height="5" rx="1" fill={color} />
      <rect x="15" y="31" width="2" height="5" rx="1" fill={color} />
    </svg>
  );
}

// Each decoration: position, animation, what to render
const DECORATIONS = [
  // Corners and edges - crescents
  { id: 1, x: "2%",   y: "8vh",  type: "crescent", size: 40, opacity: 0.14, color: "#f59e0b", anim: "float-slow", delay: "0s" },
  { id: 2, x: "93%",  y: "12vh", type: "crescent", size: 32, opacity: 0.12, color: "#fbbf24", anim: "float-med",  delay: "1.5s" },
  { id: 3, x: "1%",   y: "55vh", type: "crescent", size: 28, opacity: 0.1,  color: "#f59e0b", anim: "float-slow", delay: "3s" },
  { id: 4, x: "95%",  y: "60vh", type: "crescent", size: 36, opacity: 0.12, color: "#fbbf24", anim: "float-med",  delay: "0.8s" },

  // Sparkle stars scattered
  { id: 5, x: "8%",   y: "25vh", type: "sparkle",  size: 10, opacity: 0.3,  color: "#fbbf24", anim: "twinkle",    delay: "0.2s" },
  { id: 6, x: "88%",  y: "30vh", type: "sparkle",  size: 8,  opacity: 0.25, color: "#fde68a", anim: "twinkle",    delay: "1.1s" },
  { id: 7, x: "5%",   y: "75vh", type: "sparkle",  size: 12, opacity: 0.28, color: "#fbbf24", anim: "twinkle",    delay: "2.4s" },
  { id: 8, x: "91%",  y: "45vh", type: "sparkle",  size: 9,  opacity: 0.22, color: "#fde68a", anim: "twinkle",    delay: "0.6s" },
  { id: 9, x: "3%",   y: "40vh", type: "sparkle",  size: 7,  opacity: 0.2,  color: "#fbbf24", anim: "twinkle",    delay: "1.8s" },
  { id: 10, x: "96%", y: "80vh", type: "sparkle",  size: 11, opacity: 0.26, color: "#fde68a", anim: "twinkle",    delay: "3.2s" },

  // Lanterns
  { id: 11, x: "1.5%", y: "15vh", type: "lantern",  size: 30, opacity: 0.14, color: "#e05c72", anim: "sway",       delay: "0.4s" },
  { id: 12, x: "94%",  y: "72vh", type: "lantern",  size: 24, opacity: 0.12, color: "#c0392b", anim: "sway",       delay: "2s"   },
];

export default function RamadanDecorations() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(new Date() < RAMADAN_END);
  }, []);

  if (!active) return null;

  return (
    <>
      {/* Keyframe animations */}
      <style>{`
        @keyframes ramadan-float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-14px) rotate(4deg); }
          66% { transform: translateY(-6px) rotate(-3deg); }
        }
        @keyframes ramadan-float-med {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(-5deg); }
        }
        @keyframes ramadan-twinkle {
          0%, 100% { opacity: 0.05; transform: scale(0.8) rotate(0deg); }
          25% { opacity: 0.35; transform: scale(1.15) rotate(15deg); }
          50% { opacity: 0.15; transform: scale(0.9) rotate(30deg); }
          75% { opacity: 0.3; transform: scale(1.1) rotate(20deg); }
        }
        @keyframes ramadan-sway {
          0%, 100% { transform: rotate(-6deg); }
          50% { transform: rotate(6deg); }
        }
      `}</style>

      {/* Fixed container - pointer-events none so it never blocks clicks */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        style={{ zIndex: 10 }}
        aria-hidden="true"
      >
        {DECORATIONS.map((d) => {
          const animName =
            d.anim === "float-slow" ? "ramadan-float-slow" :
            d.anim === "float-med"  ? "ramadan-float-med"  :
            d.anim === "twinkle"    ? "ramadan-twinkle"    :
            "ramadan-sway";

          const duration =
            d.anim === "float-slow" ? "7s" :
            d.anim === "float-med"  ? "5s" :
            d.anim === "twinkle"    ? "4s" :
            "6s";

          return (
            <div
              key={d.id}
              style={{
                position: "absolute",
                left: d.x,
                top: d.y,
                animation: `${animName} ${duration} ease-in-out infinite`,
                animationDelay: d.delay,
              }}
            >
              {d.type === "crescent" && (
                <Crescent size={d.size} opacity={d.opacity} color={d.color} />
              )}
              {d.type === "sparkle" && (
                <Sparkle size={d.size} opacity={d.opacity} color={d.color} />
              )}
              {d.type === "lantern" && (
                <Lantern size={d.size} opacity={d.opacity} color={d.color} />
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
