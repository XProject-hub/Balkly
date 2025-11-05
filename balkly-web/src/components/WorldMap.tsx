"use client";

import { memo } from "react";

interface WorldMapProps {
  visitors: { country: string; count: number; lat: number; lng: number }[];
}

const WorldMap = ({ visitors }: WorldMapProps) => {
  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-lg overflow-hidden">
      {/* World Map SVG Background */}
      <svg viewBox="0 0 1000 500" className="w-full h-full opacity-20">
        <path d="M0 250 Q 250 200, 500 250 T 1000 250" stroke="#06B6D4" strokeWidth="2" fill="none" />
        <circle cx="200" cy="200" r="100" fill="#1E63FF" opacity="0.1" />
        <circle cx="500" cy="250" r="120" fill="#7C3AED" opacity="0.1" />
        <circle cx="800" cy="220" r="90" fill="#06B6D4" opacity="0.1" />
      </svg>

      {/* Glowing Dots for Visitor Locations */}
      <div className="absolute inset-0">
        {/* UAE - Main location */}
        <div className="absolute" style={{ left: '65%', top: '45%' }}>
          <div className="relative">
            {/* Pulsing glow effect */}
            <div className="absolute w-16 h-16 bg-balkly-blue rounded-full animate-ping opacity-30" />
            <div className="absolute w-12 h-12 bg-balkly-blue rounded-full blur-xl opacity-60" />
            <div className="relative w-6 h-6 bg-white rounded-full border-4 border-balkly-blue shadow-lg" />
            {/* Label */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
              <p className="text-xs font-bold text-balkly-blue">UAE</p>
              <p className="text-xs text-gray-600">{visitors.find(v => v.country === 'UAE')?.count || 0} users</p>
            </div>
          </div>
        </div>

        {/* Serbia */}
        <div className="absolute" style={{ left: '52%', top: '30%' }}>
          <div className="relative">
            <div className="absolute w-8 h-8 bg-teal-glow rounded-full animate-ping opacity-30" />
            <div className="w-4 h-4 bg-white rounded-full border-3 border-teal-glow shadow-lg" />
          </div>
        </div>

        {/* Croatia */}
        <div className="absolute" style={{ left: '50%', top: '32%' }}>
          <div className="relative">
            <div className="absolute w-6 h-6 bg-iris-purple rounded-full animate-ping opacity-30" />
            <div className="w-3 h-3 bg-white rounded-full border-2 border-iris-purple shadow-lg" />
          </div>
        </div>

        {/* Bosnia */}
        <div className="absolute" style={{ left: '51%', top: '33%' }}>
          <div className="relative">
            <div className="absolute w-6 h-6 bg-green-500 rounded-full animate-ping opacity-30" />
            <div className="w-3 h-3 bg-white rounded-full border-2 border-green-500 shadow-lg" />
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h3 className="font-bold text-gray-900">Visitor Locations:</h3>
          <div className="flex gap-6 flex-wrap">
            {visitors.slice(0, 4).map((loc, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{
                  background: idx === 0 ? '#1E63FF' : idx === 1 ? '#06B6D4' : idx === 2 ? '#7C3AED' : '#22C55E'
                }} />
                <span className="text-sm font-medium text-gray-700">{loc.country}: {loc.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(WorldMap);

