"use client";

import { memo } from "react";

interface WorldMapProps {
  visitors: { country: string; count: number }[];
}

const WorldMap = ({ visitors }: WorldMapProps) => {
  // Simple world map SVG
  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-8">
      <div className="absolute inset-0 flex items-center justify-center">
        {/* World Map Placeholder */}
        <div className="text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Visitor Locations</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {visitors.map((location, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                  <div className="text-3xl mb-2">🌍</div>
                  <p className="font-bold text-gray-900">{location.country}</p>
                  <p className="text-2xl font-bold text-balkly-blue">{location.count}</p>
                  <p className="text-xs text-gray-500">visitors</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Top Countries */}
          <div className="mt-8">
            <h4 className="font-bold text-gray-700 mb-4">Top Visitor Countries:</h4>
            <div className="flex gap-4 justify-center flex-wrap">
              {visitors.slice(0, 5).map((loc, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow">
                  <span className="text-2xl">
                    {loc.country === 'UAE' && '🇦🇪'}
                    {loc.country === 'Serbia' && '🇷🇸'}
                    {loc.country === 'Croatia' && '🇭🇷'}
                    {loc.country === 'Bosnia' && '🇧🇦'}
                    {!['UAE', 'Serbia', 'Croatia', 'Bosnia'].includes(loc.country) && '🌍'}
                  </span>
                  <span className="font-medium text-gray-900">{loc.country}</span>
                  <span className="font-bold text-balkly-blue">{loc.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(WorldMap);

