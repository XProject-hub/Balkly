"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Star } from "lucide-react";

const RAMADAN_END = new Date("2026-03-20T00:00:00");

function isRamadanActive() {
  return new Date() < RAMADAN_END;
}

export default function RamadanBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isRamadanActive()) return;
    const dismissed = sessionStorage.getItem("ramadan_banner_dismissed");
    if (!dismissed) setVisible(true);
  }, []);

  const dismiss = () => {
    setVisible(false);
    sessionStorage.setItem("ramadan_banner_dismissed", "1");
  };

  if (!visible) return null;

  return (
    <div
      className="relative z-50 w-full overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #0f172a 0%, #1a0a10 30%, #8b1c2d 50%, #1a0a10 70%, #0f172a 100%)",
        borderBottom: "1px solid rgba(139,28,45,0.4)",
      }}
    >
      {/* Subtle star sparkles in background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[
          { left: "5%",  top: "20%", delay: "0s",    size: 8 },
          { left: "12%", top: "65%", delay: "0.6s",  size: 6 },
          { left: "22%", top: "30%", delay: "1.2s",  size: 5 },
          { left: "38%", top: "70%", delay: "0.3s",  size: 7 },
          { left: "55%", top: "25%", delay: "0.9s",  size: 6 },
          { left: "68%", top: "60%", delay: "0.4s",  size: 8 },
          { left: "80%", top: "35%", delay: "1.5s",  size: 5 },
          { left: "90%", top: "70%", delay: "0.7s",  size: 6 },
          { left: "96%", top: "20%", delay: "0.1s",  size: 7 },
        ].map((star, i) => (
          <span
            key={i}
            className="absolute text-yellow-400 animate-pulse"
            style={{
              left: star.left,
              top: star.top,
              fontSize: star.size,
              animationDelay: star.delay,
              opacity: 0.6,
            }}
          >
            ✦
          </span>
        ))}
      </div>

      {/* Banner content */}
      <div className="relative flex items-center justify-center gap-2 sm:gap-3 px-10 py-2 text-sm text-center">
        {/* Left crescent */}
        <span className="text-yellow-400 text-base hidden sm:inline select-none">🌙</span>

        <span className="text-gray-200 font-medium tracking-wide">
          Ramazan Mubarek 1447
        </span>

        <span className="text-[#e05c72] hidden xs:inline">·</span>

        <Link
          href="/ramadan/confirm"
          className="inline-flex items-center gap-1 font-semibold text-yellow-400 hover:text-yellow-300 transition-colors underline-offset-2 hover:underline whitespace-nowrap"
        >
          <Star className="h-3 w-3 fill-yellow-400" />
          Preuzmi besplatni poklon
          <Star className="h-3 w-3 fill-yellow-400" />
        </Link>

        {/* Right crescent */}
        <span className="text-yellow-400 text-base hidden sm:inline select-none">🌙</span>

        {/* Close */}
        <button
          onClick={dismiss}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors p-1 rounded"
          aria-label="Zatvori"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
