import React, { useState } from 'react';
import { 
  MapPin, X, Navigation, Radio, Compass, Shield, Activity, 
  ExternalLink, Copy, Check, Sparkles, Volume2, Clock, Globe,
  Crosshair, Layers, Zap, AlertTriangle
} from 'lucide-react';
import audio from '../../services/audioService';

export default function LiveLocationModal({ 
  isOpen, 
  onClose, 
  entity, 
  onOpenFullMap,
  onTriggerAction 
}) {
  const [copied, setCopied] = useState(false);
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);

  if (!isOpen || !entity) return null;

  const lat = entity.lat || (entity.coordinates?.y ? (28.6000 + entity.coordinates.y * 0.0005).toFixed(4) : '28.6139');
  const lng = entity.lng || (entity.coordinates?.x ? (77.2000 + entity.coordinates.x * 0.0005).toFixed(4) : '77.2090');
  const speed = entity.speedKmh || entity.speed || (entity.category === 'Road Hazard' ? 0 : 48);
  const heading = entity.heading || '42° NE';
  const accuracy = entity.accuracy || '±14 cm (RTK Locked)';
  const locationName = entity.location || entity.name || entity.title || 'Central Urban Transit Corridor';
  const entityType = entity.category || entity.vehicleType || entity.type || 'Connected Asset';

  const handleCopyCoords = () => {
    navigator.clipboard?.writeText(`${lat}, ${lng}`);
    setCopied(true);
    audio.playSuccessChime();
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePing = () => {
    setIsPinging(true);
    audio.playAlertBeep();
    setTimeout(() => {
      setIsPinging(false);
      setPingSuccess(true);
      setTimeout(() => setPingSuccess(false), 2500);
    }, 600);
  };

  const handleOpenMap = () => {
    onClose();
    if (onOpenFullMap) {
      onOpenFullMap(entity);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-[#091224] border border-cyan-500/50 rounded-2xl shadow-2xl shadow-cyan-950/80 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-gradient-to-r from-[#0d1c38] via-[#102449] to-[#0d1c38] p-4 sm:p-5 border-b border-cyan-800/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-cyan-950 border border-cyan-600 rounded-xl text-cyan-400 relative">
              <Crosshair className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700 uppercase">
                  LIVE TELEMETRY & GPS TRACKER
                </span>
                <span className="flex items-center space-x-1 text-[11px] font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>TRANSMITTING</span>
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white mt-0.5 tracking-wide flex items-center gap-2">
                <span>{entity.title || entity.name || entity.id}</span>
                <span className="text-xs font-normal text-slate-400 font-mono">({entity.id})</span>
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Spatial Radar Simulation Display */}
          <div className="relative w-full h-56 bg-[#040813] rounded-xl border border-cyan-900/60 overflow-hidden flex items-center justify-center">
            {/* Grid & Concentric Radar Rings */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e3a8a_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            
            {/* Circular Radar Range Rings */}
            <div className="absolute w-44 h-44 rounded-full border border-cyan-500/20" />
            <div className="absolute w-32 h-32 rounded-full border border-cyan-500/30" />
            <div className="absolute w-20 h-20 rounded-full border border-cyan-500/40" />

            {/* Radar Sweep Needle */}
            <div className="absolute w-44 h-44 rounded-full overflow-hidden pointer-events-none animate-spin" style={{ animationDuration: '4s' }}>
              <div className="w-1/2 h-1/2 bg-gradient-to-br from-cyan-400/30 to-transparent origin-bottom-right" />
            </div>

            {/* Center Live Target Pin */}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative">
                <div className="w-5 h-5 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/80 animate-ping absolute inset-0" />
                <div className="w-5 h-5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 border-2 border-white shadow-xl flex items-center justify-center relative">
                  <div className="w-2 h-2 rounded-full bg-black" />
                </div>
              </div>
              <div className="mt-2 px-2.5 py-1 rounded-md bg-black/90 border border-cyan-500 text-[11px] font-mono font-bold text-cyan-200 shadow-xl flex items-center space-x-1.5 whitespace-nowrap">
                <MapPin className="w-3 h-3 text-cyan-400" />
                <span>{entity.id || 'TARGET'}</span>
                <span className="text-slate-400">•</span>
                <span className="text-emerald-300">{speed} km/h</span>
              </div>
            </div>

            {/* Nearby Simulated Reference Nodes */}
            <div className="absolute top-6 left-12 flex items-center space-x-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-mono text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              <span>Hosp Gateway (620m)</span>
            </div>
            <div className="absolute bottom-6 right-10 flex items-center space-x-1 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800 text-[10px] font-mono text-slate-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>SIG-101 Green (450m)</span>
            </div>

            {/* North Indicator */}
            <div className="absolute top-2 right-3 flex items-center space-x-1 text-[10px] font-mono text-slate-400 bg-black/60 px-2 py-0.5 rounded border border-slate-800">
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>N 000°</span>
            </div>

            {/* Coordinates Overlay */}
            <div className="absolute bottom-2 left-3 text-[11px] font-mono text-cyan-300 bg-black/80 px-2.5 py-1 rounded border border-cyan-900">
              <span>LAT: {lat}° N</span> | <span>LNG: {lng}° E</span>
            </div>
          </div>

          {/* Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-[#0c162b] p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Location / Address</span>
              <span className="font-bold text-white truncate block mt-0.5" title={locationName}>
                {locationName}
              </span>
            </div>
            <div className="bg-[#0c162b] p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">GPS Accuracy</span>
              <span className="font-mono font-bold text-emerald-400 block mt-0.5">
                {accuracy}
              </span>
            </div>
            <div className="bg-[#0c162b] p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Velocity & Heading</span>
              <span className="font-mono font-bold text-cyan-300 block mt-0.5">
                {speed} km/h • {heading}
              </span>
            </div>
            <div className="bg-[#0c162b] p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block font-semibold">Comms Channel</span>
              <span className="font-mono font-bold text-amber-300 block mt-0.5">
                {entity.protocol || 'V2X PC5 / 5G SA'}
              </span>
            </div>
          </div>

          {/* Additional Asset Details if available */}
          <div className="p-3.5 bg-[#0b1428] rounded-xl border border-cyan-900/40 text-xs space-y-2">
            <div className="flex items-center justify-between text-slate-300">
              <span className="text-slate-400 font-semibold">Asset Category:</span>
              <span className="font-mono font-bold text-cyan-300">{entityType}</span>
            </div>
            {entity.driver && (
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400 font-semibold">Assigned Operator:</span>
                <span className="font-bold text-white">{entity.driver}</span>
              </div>
            )}
            {entity.details && (
              <div className="pt-2 border-t border-slate-800 text-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-0.5">Telemetry Note:</span>
                <p className="text-slate-200">{entity.details}</p>
              </div>
            )}
            {entity.actionTaken && (
              <div className="pt-1 text-slate-300">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold mb-0.5">Command Action:</span>
                <p className="text-emerald-300 font-mono text-[11px]">{entity.actionTaken}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-[#070d1a] px-5 py-4 border-t border-cyan-900/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopyCoords}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED GPS' : 'COPY COORDS'}</span>
            </button>
            <button
              onClick={handlePing}
              disabled={isPinging}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-3 py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold text-xs rounded-xl transition-all"
            >
              <Radio className={`w-3.5 h-3.5 ${isPinging ? 'animate-spin text-cyan-400' : ''}`} />
              <span>{pingSuccess ? 'PING OK (12ms)' : isPinging ? 'PINGING...' : 'PING NODE'}</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleOpenMap}
              className="w-full sm:w-auto flex items-center justify-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-cyan-950 transition-all active:scale-95"
            >
              <Layers className="w-4 h-4 text-cyan-200" />
              <span>TRACK ON FULL 24-LAYER MAP</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
