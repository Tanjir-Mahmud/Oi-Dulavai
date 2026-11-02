'use client';

import React, { useState, useEffect } from 'react';
import { Truck, Navigation, Gauge, Clock } from 'lucide-react';

interface MapProps {
  chauffeurName: string;
  vehicle: string;
  eta: string;
  status: string;
}

export default function TrackingInteractiveMap({
  chauffeurName,
  vehicle,
  eta,
  status,
}: MapProps) {
  // Simulate animated vehicle movement along the trajectory
  const [progress, setProgress] = useState(65); // percentage along the route

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 95 ? 60 : prev + 0.5));
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Compute vehicle coordinate on the path from (80, 260) -> (240, 160) -> (420, 80)
  // Approximate linear interpolation across 0 - 100%
  const t = progress / 100;
  const currentX = 80 + t * 340;
  const currentY = 260 - t * 180;

  return (
    <div className="relative w-full aspect-[16/9] bg-[#0E1520] overflow-hidden select-none">
      {/* SVG Vector Map Canvas */}
      <svg
        className="w-full h-full"
        viewBox="0 0 500 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle Background Vector Grid */}
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1C2638" strokeWidth="0.8" />
          </pattern>
        </defs>
        <rect width="500" height="300" fill="url(#grid)" />

        {/* Abstract Hatirjheel Water Basin Curve */}
        <path
          d="M 50 300 Q 150 200 280 270 T 500 250 L 500 300 Z"
          fill="#0B1C2D"
          opacity="0.7"
        />
        <text x="210" y="270" fill="#2A4365" fontSize="9" fontFamily="monospace" letterSpacing="2">
          HATIRJHEEL BASIN
        </text>

        {/* Arterial Roads (Gulshan / Banani / Mohakhali Grid) */}
        <line x1="0" y1="160" x2="500" y2="160" stroke="#1F2E45" strokeWidth="1.5" strokeDasharray="4 4" />
        <line x1="240" y1="0" x2="240" y2="300" stroke="#1F2E45" strokeWidth="1.5" strokeDasharray="4 4" />

        {/* Active Dispatch Route Track (Tejgaon -> Mohakhali -> Banani) */}
        <path
          id="route-path"
          d="M 80 260 L 240 160 L 420 80"
          stroke="#4A5568"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Completed Glow Path */}
        <path
          d={`M 80 260 L ${currentX} ${currentY}`}
          stroke="#D8B467"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.9"
        />

        {/* Node 1: Origin Tejgaon Central Atelier */}
        <g transform="translate(80, 260)">
          <circle r="6" fill="#161412" stroke="#DDD5C7" strokeWidth="2" />
          <circle r="3" fill="#D8B467" />
          <text x="12" y="4" fill="#E2E8F0" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            Tejgaon Atelier
          </text>
        </g>

        {/* Node 2: Mohakhali Junction Checkpoint */}
        <g transform="translate(240, 160)">
          <circle r="4" fill="#3182CE" />
          <text x="-40" y="-10" fill="#90CDF4" fontSize="9" fontFamily="monospace">
            Mohakhali Flyover
          </text>
        </g>

        {/* Node 3: Patron Destination (Banani Road 11) */}
        <g transform="translate(420, 80)">
          <circle r="9" fill="#133327" stroke="#38A169" strokeWidth="2" />
          <circle r="4" fill="#48BB78" />
          <text x="-70" y="-12" fill="#48BB78" fontSize="10" fontFamily="sans-serif" fontWeight="bold">
            Banani Road 11 Haven
          </text>
        </g>

        {/* Moving Chauffeur Vehicle Marker */}
        <g transform={`translate(${currentX}, ${currentY})`}>
          <circle r="14" fill="#D8B467" opacity="0.3" className="animate-ping" />
          <circle r="9" fill="#070C14" stroke="#D8B467" strokeWidth="2" />
          <circle r="4" fill="#D8B467" />
        </g>
      </svg>

      {/* Floating Telemetry Panel */}
      <div className="absolute bottom-3 left-3 bg-[#0B1320]/90 backdrop-blur-md border border-[#1C2638] p-3 text-white font-spec-code text-xs space-y-1.5 shadow-2xl max-w-xs">
        <div className="flex items-center justify-between gap-4 border-b border-[#1C2638] pb-1">
          <span className="text-[#D8B467] font-bold uppercase flex items-center gap-1">
            <Navigation className="w-3.5 h-3.5" />
            Active Vector
          </span>
          <span className="text-gray-400 text-[10px]">Speed: 28 km/h</span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div>
            <span className="text-gray-400 block text-[9px] uppercase">Distance Remaining</span>
            <span className="font-bold text-white">2.8 km to Haven</span>
          </div>
          <div>
            <span className="text-gray-400 block text-[9px] uppercase">Arrival ETA</span>
            <span className="font-bold text-[#D8B467]">{eta}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
