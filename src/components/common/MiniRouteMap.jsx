import React, { useState } from 'react';
import { 
  Navigation, MapPin, AlertTriangle, Siren, Shield, 
  CheckCircle2, ZoomIn, ZoomOut, RotateCcw, Radio, Sparkles
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import audio from '../../services/audioService';

export default function MiniRouteMap({
  title = "Operational Corridor Route Map",
  subtitle = "Real-time telemetry and spatial route progression",
  pathCoordinates = [
    { x: 100, y: 150 },
    { x: 220, y: 120 },
    { x: 380, y: 110 },
    { x: 520, y: 130 },
    { x: 680, y: 90 }
  ],
  startLabel = "Origin Terminal",
  endLabel = "Destination Point",
  vehicle = null,
  signals = [],
  hazards = [],
  facilities = [],
  corridorActive = false,
  height = "h-72",
  showControls = true,
  onActionClick = null,
  actionButtonText = null
}) {
  const [zoom, setZoom] = useState(1);
  const [activePin, setActivePin] = useState(null);

  // Generate SVG path string from coordinates
  const pathD = pathCoordinates.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, '');

  const startPt = pathCoordinates[0] || { x: 100, y: 150 };
  const endPt = pathCoordinates[pathCoordinates.length - 1] || { x: 680, y: 90 };

  return (
    <div className={`relative w-full ${height} bg-[#060b17] rounded-xl border border-cyan-900/60 overflow-hidden shadow-xl flex flex-col`}>
      {/* Map Header */}
      <div className="absolute top-2.5 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        <div className="bg-[#091224]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-cyan-800/60 pointer-events-auto">
          <div className="flex items-center space-x-2">
            <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h4>
            {corridorActive && (
              <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-[9px] font-mono text-emerald-300 border border-emerald-700 animate-pulse">
                CORRIDOR ACTIVE
              </span>
            )}
          </div>
          {subtitle && <p className="text-[10px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Action Button & Zoom */}
        <div className="flex items-center space-x-1.5 pointer-events-auto">
          {actionButtonText && (
            <button
              onClick={() => {
                onActionClick?.();
                audio.playAlertBeep();
              }}
              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-[11px] rounded-lg shadow-md transition-all flex items-center space-x-1"
            >
              <Sparkles className="w-3 h-3 text-amber-200" />
              <span>{actionButtonText}</span>
            </button>
          )}

          {showControls && (
            <div className="flex items-center bg-[#091224]/90 rounded-lg border border-cyan-900/60 p-0.5 backdrop-blur-md">
              <button 
                onClick={() => setZoom(prev => Math.min(prev + 0.15, 1.6))} 
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Zoom In"
              >
                <ZoomIn className="w-3 h-3" />
              </button>
              <button 
                onClick={() => setZoom(prev => Math.max(prev - 0.15, 0.85))} 
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Zoom Out"
              >
                <ZoomOut className="w-3 h-3" />
              </button>
              <button 
                onClick={() => setZoom(1)} 
                className="p-1 text-slate-400 hover:text-white rounded"
                title="Reset"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <svg 
          viewBox="0 0 800 240" 
          className="w-full h-full select-none"
          style={{ transform: `scale(${zoom})`, transformOrigin: 'center center', transition: 'transform 0.2s ease-out' }}
        >
          <defs>
            <pattern id="miniGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(14, 116, 144, 0.08)" strokeWidth="1" />
            </pattern>

            <linearGradient id="activeRouteGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="800" height="240" fill="#070d1a" />
          <rect width="800" height="240" fill="url(#miniGrid)" />

          {/* Secondary Arterials */}
          <path d="M 40,60 L 760,60" stroke="#131e36" strokeWidth="6" fill="none" />
          <path d="M 40,180 L 760,180" stroke="#131e36" strokeWidth="6" fill="none" />
          <path d="M 240,10 L 240,230" stroke="#131e36" strokeWidth="6" fill="none" />
          <path d="M 520,10 L 520,230" stroke="#131e36" strokeWidth="6" fill="none" />

          {/* Main Primary Highway Bed */}
          <path d={pathD} stroke="#1e293b" strokeWidth="16" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d={pathD} stroke="#334155" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Active Flow / Corridor Line */}
          <path 
            d={pathD} 
            stroke={corridorActive ? "url(#activeRouteGlow)" : "#0284c7"} 
            strokeWidth={corridorActive ? "6" : "3"} 
            strokeDasharray={corridorActive ? "8 6" : "none"}
            className={corridorActive ? "animate-corridor" : ""}
            strokeLinecap="round" 
            strokeLinejoin="round" 
            fill="none" 
          />

          {/* Signals along route */}
          {signals.map((sig, i) => {
            const isGreen = sig.state === 'GREEN' || (corridorActive && sig.isPriorityActive);
            const pt = pathCoordinates[i + 1] || { x: 220 + i * 140, y: 120 };
            return (
              <g 
                key={sig.id || i} 
                className="cursor-pointer"
                onClick={() => {
                  setActivePin({ type: 'SIGNAL', data: sig });
                  audio.playAlertBeep();
                }}
              >
                <circle cx={pt.x} cy={pt.y} r="8" fill="#0f172a" stroke={isGreen ? "#10b981" : "#ef4444"} strokeWidth="2" />
                <circle cx={pt.x} cy={pt.y} r="3" fill={isGreen ? "#10b981" : "#ef4444"} className={isGreen ? "animate-ping" : ""} />
                <text x={pt.x} y={pt.y + 16} fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">
                  {sig.id}
                </text>
              </g>
            );
          })}

          {/* Hazards along route */}
          {hazards.map((haz, i) => {
            const hx = haz.x || (300 + i * 120);
            const hy = haz.y || 115;
            return (
              <g 
                key={haz.id || i}
                className="cursor-pointer"
                onClick={() => {
                  setActivePin({ type: 'HAZARD', data: haz });
                  audio.playAlertBeep();
                }}
              >
                <circle cx={hx} cy={hy} r="10" fill="rgba(239, 68, 68, 0.3)" className="animate-ping" />
                <rect x={hx - 8} y={hy - 8} width="16" height="16" rx="4" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
                <text x={hx} y={hy + 4} fontSize="9" textAnchor="middle">⚠️</text>
              </g>
            );
          })}

          {/* Facilities along route */}
          {facilities.slice(0, 4).map((fac, i) => {
            const fx = 180 + i * 160;
            const fy = 80 + (i % 2 === 0 ? -30 : 60);
            return (
              <g 
                key={fac.id || i}
                className="cursor-pointer opacity-85 hover:opacity-100"
                onClick={() => {
                  setActivePin({ type: 'FACILITY', data: fac });
                  audio.playAlertBeep();
                }}
              >
                <circle cx={fx} cy={fy} r="9" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.2" />
                <text x={fx} y={fy + 3} fontSize="8" textAnchor="middle">📍</text>
                <text x={fx} y={fy + 16} fill="#94a3b8" fontSize="7" textAnchor="middle">{fac.name.split(' ')[0]}</text>
              </g>
            );
          })}

          {/* Start Point Marker */}
          <g>
            <circle cx={startPt.x} cy={startPt.y} r="10" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
            <circle cx={startPt.x} cy={startPt.y} r="3" fill="#ffffff" />
            <text x={startPt.x} y={startPt.y - 14} fill="#38bdf8" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">
              {startLabel}
            </text>
          </g>

          {/* End Point Marker */}
          <g>
            <circle cx={endPt.x} cy={endPt.y} r="10" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            <circle cx={endPt.x} cy={endPt.y} r="3" fill="#ffffff" />
            <text x={endPt.x} y={endPt.y - 14} fill="#f87171" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">
              {endLabel}
            </text>
          </g>

          {/* Vehicle Position on Route */}
          {vehicle && (
            <g>
              <circle cx={vehicle.x || 380} cy={vehicle.y || 110} r="16" fill="rgba(6, 182, 212, 0.3)" className="animate-ping" />
              <rect x={(vehicle.x || 380) - 14} y={(vehicle.y || 110) - 10} width="28" height="20" rx="6" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
              <text x={vehicle.x || 380} y={(vehicle.y || 110) + 4} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">
                {vehicle.id || 'UNIT'}
              </text>
              <text x={vehicle.x || 380} y={(vehicle.y || 110) + 24} fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">
                {vehicle.speed || '62'} km/h
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Interactive Pin Drawer */}
      {activePin && (
        <div className="absolute bottom-2 left-2 right-2 z-20 bg-[#091224]/95 border border-cyan-600 rounded-lg p-2.5 backdrop-blur-md flex items-center justify-between text-xs animate-in slide-in-from-bottom-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-cyan-300">
              {activePin.type}: {activePin.data.name || activePin.data.title || activePin.data.id}
            </span>
            <StatusBadge status={activePin.data.status || activePin.data.state || 'ACTIVE'} size="xs" />
          </div>
          <button 
            onClick={() => setActivePin(null)} 
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded text-[10px] bg-slate-800"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}
