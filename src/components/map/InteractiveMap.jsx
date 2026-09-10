import React, { useState } from 'react';
import { 
  Layers, ZoomIn, ZoomOut, RotateCcw, AlertTriangle, Shield, 
  Siren, Flame, Truck, Bus, Building2, Fuel, Zap, Coffee, 
  Navigation, Eye, EyeOff, Radio, Check, X, Info, Volume2
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import audio from '../../services/audioService';

export const LAYER_DEFINITIONS = [
  { id: 'traffic', name: 'Traffic Flow', category: 'Infrastructure', count: '32% Congestion' },
  { id: 'emergency', name: 'Emergency Vehicles', category: 'Vehicles', count: '4 Active' },
  { id: 'police', name: 'Police Vehicles', category: 'Vehicles', count: '3 Units' },
  { id: 'fire', name: 'Fire & Rescue', category: 'Vehicles', count: '2 Tenders' },
  { id: 'logistics', name: 'Logistics Vehicles', category: 'Vehicles', count: '5 Trucks' },
  { id: 'buses', name: 'Public & School Buses', category: 'Vehicles', count: '14 Active' },
  { id: 'hospitals', name: 'Hospitals & Trauma', category: 'Emergency Hubs', count: '3 Hubs' },
  { id: 'police_stations', name: 'Police Stations', category: 'Emergency Hubs', count: '6 Posts' },
  { id: 'fire_stations', name: 'Fire Stations', category: 'Emergency Hubs', count: '4 Depots' },
  { id: 'fuel_stations', name: 'Fuel Stations', category: 'Facilities', count: '8 Stations' },
  { id: 'ev_charging', name: 'EV Charging Hubs', category: 'Facilities', count: '6 Hubs' },
  { id: 'restrooms', name: 'Public Restrooms', category: 'Facilities', count: '12 Locations' },
  { id: 'food', name: 'Food & Dining', category: 'Facilities', count: '15 Spots' },
  { id: 'rest_areas', name: 'Rest Areas & Shelters', category: 'Facilities', count: '5 Areas' },
  { id: 'parking', name: 'Smart Parking', category: 'Facilities', count: '7 MLCPs' },
  { id: 'potholes', name: 'Pothole Detections', category: 'Road Hazards', count: '9 Detected' },
  { id: 'flooded_roads', name: 'Flooded Roads / Underpass', category: 'Road Hazards', count: '2 Submerged' },
  { id: 'accidents', name: 'Active Accidents', category: 'Road Hazards', count: '1 Incident' },
  { id: 'railway_crossings', name: 'Railway Crossings', category: 'Road Hazards', count: '2 Crossings' },
  { id: 'road_closures', name: 'Road Closures', category: 'Road Hazards', count: '1 Closed' },
  { id: 'signals', name: 'Smart Traffic Signals', category: 'Infrastructure', count: '18 Online' },
  { id: 'iot_sensors', name: 'Connected IoT Sensors', category: 'Hardware', count: '248 Nodes' },
  { id: 'delivery_zones', name: 'Smart Delivery Zones', category: 'Logistics', count: '11 Bays' }
];

export default function InteractiveMap({ 
  signals = [], 
  emergencies = [], 
  fleet = [], 
  hazards = [], 
  hospitals = [], 
  facilities = [], 
  iotDevices = [],
  isCorridorActive = true,
  onActivateCorridor,
  onNotifyHospital
}) {
  // Layer toggles state
  const [activeLayers, setActiveLayers] = useState({
    traffic: true,
    emergency: true,
    police: true,
    fire: true,
    logistics: true,
    buses: true,
    hospitals: true,
    police_stations: true,
    fire_stations: true,
    fuel_stations: true,
    ev_charging: true,
    restrooms: true,
    food: true,
    rest_areas: true,
    parking: true,
    potholes: true,
    flooded_roads: true,
    accidents: true,
    railway_crossings: true,
    road_closures: true,
    signals: true,
    iot_sensors: true,
    delivery_zones: true
  });

  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [radarScanner, setRadarScanner] = useState(true);

  const toggleLayer = (layerId) => {
    setActiveLayers(prev => ({ ...prev, [layerId]: !prev[layerId] }));
  };

  const applyPreset = (preset) => {
    const updated = {};
    Object.keys(activeLayers).forEach(k => { updated[k] = false; });

    if (preset === 'all') {
      Object.keys(activeLayers).forEach(k => { updated[k] = true; });
    } else if (preset === 'emergency') {
      updated.emergency = true;
      updated.signals = true;
      updated.hospitals = true;
      updated.traffic = true;
      updated.fire = true;
      updated.police = true;
    } else if (preset === 'logistics') {
      updated.logistics = true;
      updated.fuel_stations = true;
      updated.ev_charging = true;
      updated.parking = true;
      updated.delivery_zones = true;
      updated.rest_areas = true;
    } else if (preset === 'traveller') {
      updated.fuel_stations = true;
      updated.ev_charging = true;
      updated.restrooms = true;
      updated.food = true;
      updated.rest_areas = true;
      updated.traffic = true;
      updated.potholes = true;
    } else if (preset === 'hazards') {
      updated.potholes = true;
      updated.flooded_roads = true;
      updated.accidents = true;
      updated.railway_crossings = true;
      updated.road_closures = true;
    }
    setActiveLayers(updated);
  };

  const handleMarkerClick = (marker) => {
    audio.playAlertBeep();
    setSelectedMarker(marker);
  };

  return (
    <div className="relative w-full h-[650px] lg:h-[750px] bg-[#060c19] rounded-2xl border border-cyan-900/50 overflow-hidden shadow-2xl flex flex-col">
      {/* Top Map Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Layer Presets & Layer Drawer Toggle */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-[#0d172e]/90 hover:bg-[#152347] border border-cyan-700/60 text-xs font-bold text-cyan-300 shadow-xl backdrop-blur-md transition-all"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
            <span>Map Layers</span>
            <span className="px-1.5 py-0.2 rounded bg-cyan-900/80 text-[10px] text-cyan-200 font-mono">
              {Object.values(activeLayers).filter(Boolean).length}/24
            </span>
          </button>

          {/* Preset Buttons */}
          <div className="hidden sm:flex items-center space-x-1.5 bg-[#091224]/80 p-1 rounded-lg border border-slate-800 backdrop-blur-md text-[11px]">
            <button
              onClick={() => applyPreset('all')}
              className="px-2 py-0.5 rounded hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 transition-colors"
            >
              All Layers
            </button>
            <button
              onClick={() => applyPreset('emergency')}
              className="px-2 py-0.5 rounded hover:bg-rose-950 text-rose-300 transition-colors font-medium"
            >
              Emergency Corridor
            </button>
            <button
              onClick={() => applyPreset('logistics')}
              className="px-2 py-0.5 rounded hover:bg-amber-950 text-amber-300 transition-colors"
            >
              Logistics Fleet
            </button>
            <button
              onClick={() => applyPreset('traveller')}
              className="px-2 py-0.5 rounded hover:bg-sky-950 text-sky-300 transition-colors"
            >
              Traveller Facilities
            </button>
            <button
              onClick={() => applyPreset('hazards')}
              className="px-2 py-0.5 rounded hover:bg-red-950 text-red-400 transition-colors"
            >
              Road Hazards
            </button>
          </div>
        </div>

        {/* Right: Map View Controls & Radar Toggle */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => setRadarScanner(!radarScanner)}
            className={`p-1.5 rounded-lg border text-xs backdrop-blur-md transition-all ${
              radarScanner ? 'bg-cyan-950/80 border-cyan-600 text-cyan-300' : 'bg-slate-900/80 border-slate-800 text-slate-500'
            }`}
            title="Toggle Radar Sweep Scan"
          >
            <Radio className="w-4 h-4" />
          </button>
          <div className="flex items-center bg-[#091224]/90 rounded-lg border border-cyan-900/50 p-0.5 backdrop-blur-md">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-cyan-950 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-cyan-950 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button 
              onClick={() => { setZoomLevel(1); setPan({ x: 0, y: 0 }); }}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-cyan-950 rounded transition-colors"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Layer Drawer Modal / Sidebar */}
      {showLayerPanel && (
        <div className="absolute top-16 left-4 z-30 w-80 max-h-[540px] bg-[#0c162c]/95 border border-cyan-700/70 rounded-xl shadow-2xl p-4 overflow-y-auto backdrop-blur-xl animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between pb-3 border-b border-cyan-900/60">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">Map Layer Filters</h3>
              <p className="text-[10px] text-slate-400">Toggle individual transportation feeds</p>
            </div>
            <button 
              onClick={() => setShowLayerPanel(false)}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-1.5">
            {LAYER_DEFINITIONS.map((layer) => {
              const active = activeLayers[layer.id];
              return (
                <div
                  key={layer.id}
                  onClick={() => toggleLayer(layer.id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all text-xs ${
                    active ? 'bg-cyan-950/70 text-cyan-200 border border-cyan-800/60' : 'bg-slate-900/40 text-slate-500 border border-transparent hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`w-3.5 h-3.5 rounded flex items-center justify-center border ${
                      active ? 'bg-cyan-500 border-cyan-400 text-black' : 'border-slate-700'
                    }`}>
                      {active && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <div>
                      <p className={`font-semibold ${active ? 'text-slate-100' : 'text-slate-500'}`}>{layer.name}</p>
                      <p className="text-[9px] text-slate-400 font-mono">{layer.category}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400/80 bg-cyan-950 px-1.5 py-0.5 rounded border border-cyan-900">
                    {layer.count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main SVG Tactical Transportation Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden cursor-crosshair">
        <svg 
          viewBox="0 0 1000 700" 
          className="w-full h-full select-none"
          style={{
            transform: `scale(${zoomLevel}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out'
          }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(14, 116, 144, 0.12)" strokeWidth="1" />
            </pattern>

            {/* Glowing Gradient for Dynamic Green Corridor */}
            <linearGradient id="corridorGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
            </linearGradient>

            <linearGradient id="corridorInactive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.7" />
            </linearGradient>

            {/* Radar gradient */}
            <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(6, 182, 212, 0.2)" />
              <stop offset="70%" stopColor="rgba(6, 182, 212, 0.05)" />
              <stop offset="100%" stopColor="rgba(6, 182, 212, 0)" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width="1000" height="700" fill="#070d1a" />
          <rect width="1000" height="700" fill="url(#grid)" />

          {/* City Geographic Features: River / Canal */}
          <path 
            d="M -20,280 C 220,320 380,240 580,290 C 780,340 890,300 1020,320" 
            fill="none" 
            stroke="#0e3352" 
            strokeWidth="32" 
            opacity="0.6"
          />
          <path 
            d="M -20,280 C 220,320 380,240 580,290 C 780,340 890,300 1020,320" 
            fill="none" 
            stroke="#0284c7" 
            strokeWidth="8" 
            opacity="0.35"
          />
          <text x="140" y="295" fill="#0284c7" fontSize="10" opacity="0.6" fontFamily="JetBrains Mono">YAMUNA CANAL FEEDER</text>

          {/* Railway Tracks & Crossing LC-14 */}
          <path 
            d="M 680, -20 L 680, 720" 
            fill="none" 
            stroke="#475569" 
            strokeWidth="8" 
            strokeDasharray="4 6"
          />
          <text x="690" y="80" fill="#64748b" fontSize="9" fontFamily="JetBrains Mono">NORTHERN RAILWAY TRUNK LINE</text>

          {/* Major Expressways & City Arterials (Road Layer) */}
          {/* Ring Road Main Expressway NH-48 */}
          <path 
            d="M 80,580 L 320,520 L 380,460 L 480,400 L 600,340 L 740,260 L 920,200" 
            fill="none" 
            stroke="#1e293b" 
            strokeWidth="24" 
            strokeLinecap="round"
          />
          <path 
            d="M 80,580 L 320,520 L 380,460 L 480,400 L 600,340 L 740,260 L 920,200" 
            fill="none" 
            stroke="#334155" 
            strokeWidth="18" 
            strokeLinecap="round"
          />

          {/* City Secondary Arterials */}
          <path d="M 380,80 L 380,640" stroke="#1e293b" strokeWidth="12" fill="none" />
          <path d="M 120,400 L 880,400" stroke="#1e293b" strokeWidth="14" fill="none" />
          <path d="M 600,80 L 600,640" stroke="#1e293b" strokeWidth="12" fill="none" />
          <path d="M 200,200 L 850,200" stroke="#1e293b" strokeWidth="10" fill="none" />
          <path d="M 200,560 L 850,560" stroke="#1e293b" strokeWidth="10" fill="none" />

          {/* Traffic Flow Overlay (Green, Yellow, Red Heat lines) */}
          {activeLayers.traffic && (
            <g opacity="0.85">
              {/* Free-flowing Green Arterials */}
              <path d="M 200,200 L 600,200" stroke="#10b981" strokeWidth="3" strokeDasharray="6 4" fill="none" />
              <path d="M 380,100 L 380,340" stroke="#10b981" strokeWidth="3" strokeDasharray="6 4" fill="none" />
              
              {/* Moderate Traffic Amber */}
              <path d="M 480,400 L 880,400" stroke="#f59e0b" strokeWidth="4" strokeDasharray="4 4" fill="none" />
              <path d="M 600,340 L 600,560" stroke="#f59e0b" strokeWidth="4" strokeDasharray="4 4" fill="none" />

              {/* Congested Bottleneck Red (near market & underpass) */}
              <path d="M 480,560 L 640,560" stroke="#ef4444" strokeWidth="5" fill="none" />
              <text x="500" y="550" fill="#ef4444" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">CONGESTION: 84%</text>
            </g>
          )}

          {/* HERO FEATURE: DYNAMIC EMERGENCY GREEN CORRIDOR */}
          {activeLayers.emergency && (
            <g>
              {/* Glow corridor path */}
              <path 
                d="M 320,520 L 380,460 L 480,400 L 600,340 L 740,260" 
                fill="none" 
                stroke={isCorridorActive ? "url(#corridorGlow)" : "url(#corridorInactive)"}
                strokeWidth="10" 
                strokeLinecap="round"
                className={isCorridorActive ? "animate-corridor" : ""}
                filter="drop-shadow(0 0 8px rgba(16, 185, 129, 0.8))"
              />

              {/* Corridor Signal Nodes Wave */}
              {isCorridorActive && (
                <circle cx="380" cy="460" r="22" fill="none" stroke="#10b981" strokeWidth="1.5" className="animate-ping" />
              )}
            </g>
          )}

          {/* Radar Sweep Effect */}
          {radarScanner && (
            <g className="pointer-events-none">
              <circle cx="500" cy="350" r="320" fill="url(#radarGlow)" />
              <circle cx="500" cy="350" r="200" fill="none" stroke="rgba(6, 182, 212, 0.15)" strokeWidth="1" />
              <circle cx="500" cy="350" r="320" fill="none" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1" />
              <g className="animate-radar">
                <line x1="500" y1="350" x2="820" y2="350" stroke="rgba(6, 182, 212, 0.5)" strokeWidth="2" />
                <path d="M 500,350 L 820,350 A 320,320 0 0,0 726,124 Z" fill="rgba(6, 182, 212, 0.08)" />
              </g>
            </g>
          )}

          {/* ================= MAP MARKERS ================= */}

          {/* Traffic Signals (SIG-101 to SIG-104) */}
          {activeLayers.signals && signals.map((sig) => {
            const isRed = sig.state === 'RED';
            const isYellow = sig.state === 'YELLOW';
            const isGreen = sig.state === 'GREEN' || (isCorridorActive && sig.isPriorityActive);
            const cx = sig.coordinates.x * 10;
            const cy = sig.coordinates.y * 7;

            return (
              <g 
                key={sig.id} 
                className="cursor-pointer group" 
                onClick={() => handleMarkerClick({ type: 'SIGNAL', data: sig })}
              >
                {/* Traffic Light Housing */}
                <rect x={cx - 14} y={cy - 22} width="28" height="44" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
                {/* Red Light */}
                <circle cx={cx} cy={cy - 12} r="4" fill={isRed ? "#ef4444" : "#450a0a"} />
                {/* Yellow Light */}
                <circle cx={cx} cy={cy - 1} r="4" fill={isYellow ? "#eab308" : "#422006"} />
                {/* Green Light */}
                <circle cx={cx} cy={cy + 10} r="4" fill={isGreen ? "#10b981" : "#022c22"} className={isGreen ? "animate-pulse" : ""} />
                
                {/* Signal Tag */}
                <rect x={cx - 24} y={cy + 26} width="48" height="14" rx="3" fill="#091124" stroke="#0ea5e9" strokeWidth="0.8" />
                <text x={cx} y={cy + 36} fill="#38bdf8" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">
                  {sig.id}
                </text>
              </g>
            );
          })}

          {/* Hospitals */}
          {activeLayers.hospitals && hospitals.map((hosp) => {
            const cx = hosp.coordinates.x * 10;
            const cy = hosp.coordinates.y * 7;
            return (
              <g 
                key={hosp.id} 
                className="cursor-pointer group" 
                onClick={() => handleMarkerClick({ type: 'HOSPITAL', data: hosp })}
              >
                <circle cx={cx} cy={cy} r="20" fill="rgba(236, 72, 153, 0.2)" className="animate-ping-slow" />
                <rect x={cx - 16} y={cy - 16} width="32" height="32" rx="8" fill="#831843" stroke="#f472b6" strokeWidth="2" />
                {/* Hospital Cross */}
                <path d={`M ${cx - 3},${cy - 8} h 6 v 5 h 5 v 6 h -5 v 5 h -6 v -5 h -5 v -6 h 5 z`} fill="#ffffff" />
                <rect x={cx - 50} y={cy + 20} width="100" height="14" rx="3" fill="#111827" stroke="#f472b6" strokeWidth="0.8" />
                <text x={cx} y={cy + 30} fill="#fbcfe8" fontSize="7.5" fontWeight="bold" textAnchor="middle">
                  {hosp.name.split(' ')[0]} TRAUMA
                </text>
              </g>
            );
          })}

          {/* Emergency Vehicles (Ambulance AMB-104, FIRE-22, POL-18) */}
          {activeLayers.emergency && emergencies.map((emg) => {
            const cx = emg.coordinates.x * 10;
            const cy = emg.coordinates.y * 7;
            const isHero = emg.vehicleId === 'AMB-104';

            return (
              <g 
                key={emg.id} 
                className="cursor-pointer group" 
                onClick={() => handleMarkerClick({ type: 'EMERGENCY', data: emg })}
              >
                {/* Pulse ring */}
                <circle cx={cx} cy={cy} r="24" fill={isHero ? "rgba(239, 68, 68, 0.3)" : "rgba(59, 130, 246, 0.3)"} className="animate-ping" />
                
                {/* Vehicle Badge */}
                <rect 
                  x={cx - 18} 
                  y={cy - 18} 
                  width="36" 
                  height="36" 
                  rx="10" 
                  fill={isHero ? "#dc2626" : "#2563eb"} 
                  stroke="#ffffff" 
                  strokeWidth="2" 
                />
                
                {/* Vehicle Icon Symbol */}
                <text x={cx} y={cy + 5} fill="#ffffff" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">
                  {isHero ? "AMB" : emg.vehicleId.slice(0, 3)}
                </text>

                {/* Status Tag */}
                <rect x={cx - 30} y={cy + 22} width="60" height="14" rx="3" fill="#0f172a" stroke={isHero ? "#ef4444" : "#3b82f6"} strokeWidth="0.8" />
                <text x={cx} y={cy + 32} fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">
                  {emg.vehicleId} • {emg.speedKmh} km/h
                </text>
              </g>
            );
          })}

          {/* Fleet Logistics Trucks (TRUCK-204, TRUCK-312 Hazmat, VAN-55) */}
          {activeLayers.logistics && fleet.map((truck) => {
            if (!truck?.coordinates) return null;
            const cx = truck.coordinates.x * 10;
            const cy = truck.coordinates.y * 7;
            const isHazmat = (truck.cargoType || '').includes('LPG');

            return (
              <g 
                key={truck.id} 
                className="cursor-pointer group" 
                onClick={() => handleMarkerClick({ type: 'FLEET', data: truck })}
              >
                <rect 
                  x={cx - 15} 
                  y={cy - 15} 
                  width="30" 
                  height="30" 
                  rx="6" 
                  fill={isHazmat ? "#b45309" : "#1e3a8a"} 
                  stroke={isHazmat ? "#f59e0b" : "#60a5fa"} 
                  strokeWidth="1.5" 
                />
                <text x={cx} y={cy + 4} fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                  🚚
                </text>
                <text x={cx} y={cy + 25} fill="#93c5fd" fontSize="7.5" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">
                  {truck.id}
                </text>
              </g>
            );
          })}

          {/* Road Hazards: Potholes, Floods, Railway crossing */}
          {hazards.map((haz) => {
            if (!haz?.coordinates) return null;
            const cx = haz.coordinates.x * 10;
            const cy = haz.coordinates.y * 7;
            let showThis = false;
            let hazardIcon = '⚠️';
            let hazardColor = '#f59e0b';
            const cat = haz.category || '';

            if (cat === 'Pothole' && activeLayers.potholes) {
              showThis = true;
              hazardIcon = '🕳️';
              hazardColor = '#eab308';
            } else if (cat.includes('Flood') && activeLayers.flooded_roads) {
              showThis = true;
              hazardIcon = '🌊';
              hazardColor = '#06b6d4';
            } else if (cat.includes('Railway') && activeLayers.railway_crossings) {
              showThis = true;
              hazardIcon = '🚆';
              hazardColor = '#ef4444';
            } else if (cat === 'Accident' && activeLayers.accidents) {
              showThis = true;
              hazardIcon = '💥';
              hazardColor = '#dc2626';
            } else if (activeLayers.road_closures) {
              showThis = true;
            }

            if (!showThis) return null;

            return (
              <g 
                key={haz.id} 
                className="cursor-pointer group" 
                onClick={() => handleMarkerClick({ type: 'HAZARD', data: haz })}
              >
                <circle cx={cx} cy={cy} r="16" fill={`${hazardColor}33`} className="animate-ping" />
                <rect x={cx - 12} y={cy - 12} width="24" height="24" rx="6" fill="#18181b" stroke={hazardColor} strokeWidth="1.5" />
                <text x={cx} y={cy + 4} fontSize="11" textAnchor="middle">
                  {hazardIcon}
                </text>
                <text x={cx} y={cy + 22} fill={hazardColor} fontSize="7" fontWeight="bold" textAnchor="middle" fontFamily="JetBrains Mono">
                  {haz.category}
                </text>
              </g>
            );
          })}

          {/* Traveller Facilities along route */}
          {facilities.slice(0, 8).map((fac) => {
            let showFac = false;
            let iconText = '📍';
            let color = '#38bdf8';

            if (fac.category === 'Fuel Stations' && activeLayers.fuel_stations) { showFac = true; iconText = '⛽'; color = '#38bdf8'; }
            if (fac.category === 'EV Charging' && activeLayers.ev_charging) { showFac = true; iconText = '⚡'; color = '#10b981'; }
            if (fac.category === 'Restrooms' && activeLayers.restrooms) { showFac = true; iconText = '🚻'; color = '#a855f7'; }
            if (fac.category === 'Food' && activeLayers.food) { showFac = true; iconText = '🍲'; color = '#f97316'; }
            if (fac.category === 'Rest Areas' && activeLayers.rest_areas) { showFac = true; iconText = '🛏️'; color = '#06b6d4'; }
            if (fac.category === 'Vehicle Repair' && activeLayers.parking) { showFac = true; iconText = '🔧'; color = '#facc15'; }

            if (!showFac) return null;
            const cx = fac.coordinates.x * 10;
            const cy = fac.coordinates.y * 7;

            return (
              <g 
                key={fac.id} 
                className="cursor-pointer group opacity-90 hover:opacity-100" 
                onClick={() => handleMarkerClick({ type: 'FACILITY', data: fac })}
              >
                <circle cx={cx} cy={cy} r="10" fill="#0f172a" stroke={color} strokeWidth="1.2" />
                <text x={cx} y={cy + 3.5} fontSize="9" textAnchor="middle">
                  {iconText}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Bottom Floating Telemetry Inspector / Drawer */}
      {selectedMarker && (
        <div className="absolute bottom-4 left-4 right-4 z-30 max-w-2xl mx-auto bg-[#0a1426]/95 border border-cyan-500/60 rounded-xl shadow-2xl p-4 backdrop-blur-xl animate-in slide-in-from-bottom-5">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300">
                {selectedMarker.type === 'EMERGENCY' && <Siren className="w-5 h-5 text-rose-400" />}
                {selectedMarker.type === 'SIGNAL' && <TrafficCone className="w-5 h-5 text-cyan-400" />}
                {selectedMarker.type === 'HAZARD' && <AlertTriangle className="w-5 h-5 text-amber-400" />}
                {selectedMarker.type === 'FLEET' && <Truck className="w-5 h-5 text-blue-400" />}
                {selectedMarker.type === 'HOSPITAL' && <Building2 className="w-5 h-5 text-pink-400" />}
                {selectedMarker.type === 'FACILITY' && <Navigation className="w-5 h-5 text-emerald-400" />}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-white">
                    {selectedMarker.data.name || selectedMarker.data.title || selectedMarker.data.vehicleId || selectedMarker.data.id}
                  </h4>
                  <StatusBadge status={selectedMarker.data.status || selectedMarker.data.priority || selectedMarker.data.state} />
                </div>
                <p className="text-xs text-slate-400">
                  {selectedMarker.data.location || selectedMarker.data.route || selectedMarker.data.destinationHospital || selectedMarker.data.category}
                </p>
              </div>
            </div>

            <button 
              onClick={() => setSelectedMarker(null)}
              className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Context Details */}
          <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
            {selectedMarker.type === 'EMERGENCY' && (
              <>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Speed</p>
                  <p className="font-mono font-bold text-cyan-300">{selectedMarker.data.speedKmh} km/h</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Time Saved</p>
                  <p className="font-mono font-bold text-emerald-300">+{selectedMarker.data.timeSavedMinutes} min</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Destination</p>
                  <p className="font-semibold text-slate-200 truncate">{selectedMarker.data.destinationHospital}</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded flex items-center justify-center">
                  <button 
                    onClick={() => {
                      onActivateCorridor?.();
                      audio.playSiren();
                    }}
                    className="w-full h-full bg-rose-600 hover:bg-rose-500 text-white font-bold rounded text-[11px] transition-colors"
                  >
                    Activate Corridor
                  </button>
                </div>
              </>
            )}

            {selectedMarker.type === 'SIGNAL' && (
              <>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Signal State</p>
                  <p className="font-mono font-bold text-emerald-300">{selectedMarker.data.state}</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Distance to Ambulance</p>
                  <p className="font-mono font-bold text-cyan-300">{selectedMarker.data.distanceMeters} m</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Traffic Flow</p>
                  <p className="font-mono font-bold text-slate-200">{selectedMarker.data.trafficFlow}</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Preemption Mode</p>
                  <p className="font-semibold text-amber-300 truncate">{selectedMarker.data.priorityStatus}</p>
                </div>
              </>
            )}

            {selectedMarker.type === 'HAZARD' && (
              <>
                <div className="bg-slate-900/60 p-2 rounded col-span-2">
                  <p className="text-[10px] text-slate-400">Action Taken</p>
                  <p className="text-slate-300 truncate">{selectedMarker.data.actionTaken || selectedMarker.data.details}</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Detected Source</p>
                  <p className="font-mono text-cyan-300 truncate">{selectedMarker.data.source}</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Severity</p>
                  <p className="font-bold text-rose-400">{selectedMarker.data.severity}</p>
                </div>
              </>
            )}

            {selectedMarker.type === 'FLEET' && (
              <>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Cargo Type</p>
                  <p className="text-slate-200 truncate">{selectedMarker.data.cargoType}</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Fuel / Battery</p>
                  <p className="font-mono font-bold text-emerald-300">{selectedMarker.data.fuelPercent}%</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Weight Status</p>
                  <p className="font-mono font-bold text-amber-300">{selectedMarker.data.loadStatus}</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Driver Alertness</p>
                  <p className="font-semibold text-cyan-300">{selectedMarker.data.driverStatus}</p>
                </div>
              </>
            )}

            {selectedMarker.type === 'HOSPITAL' && (
              <>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Available ICU Beds</p>
                  <p className="font-mono font-bold text-emerald-300">{selectedMarker.data.availableIcuBeds} / {selectedMarker.data.totalIcuBeds}</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Trauma Team</p>
                  <p className="font-semibold text-pink-300">STANDBY READY</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Emergency Phone</p>
                  <p className="font-mono text-cyan-300">{selectedMarker.data.contactNumber}</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded flex items-center justify-center">
                  <button 
                    onClick={() => {
                      onNotifyHospital?.();
                      audio.playSuccessChime();
                    }}
                    className="w-full h-full bg-pink-600 hover:bg-pink-500 text-white font-bold rounded text-[11px] transition-colors"
                  >
                    Notify Hospital
                  </button>
                </div>
              </>
            )}

            {selectedMarker.type === 'FACILITY' && (
              <>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">Distance</p>
                  <p className="font-mono font-bold text-cyan-300">{selectedMarker.data.distanceKm} km</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded">
                  <p className="text-[10px] text-slate-400">User Rating</p>
                  <p className="font-mono font-bold text-amber-300">★ {selectedMarker.data.rating}</p>
                </div>
                <div className="bg-slate-900/60 p-2 rounded col-span-2">
                  <p className="text-[10px] text-slate-400">Amenities Available</p>
                  <p className="text-slate-300 truncate">{selectedMarker.data.amenities?.join(', ')}</p>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
