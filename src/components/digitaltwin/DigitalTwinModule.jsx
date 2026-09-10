import React, { useState } from 'react';
import { 
  Network, Zap, ArrowRight, CheckCircle2, AlertOctagon, 
  Activity, Play, RotateCcw, Clock, ShieldAlert, Cpu, 
  MapPin, Crosshair, Sliders, Layers
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import audio from '../../services/audioService';

export default function DigitalTwinModule({ 
  isCorridorActive = false,
  onActivateCorridor,
  onViewLiveLocation,
  onNavigate 
}) {
  const [isSimulatingEmergency, setIsSimulatingEmergency] = useState(isCorridorActive);
  const [twinMode, setTwinMode] = useState('after'); // 'before' | 'after'
  const [simTrafficDensity, setSimTrafficDensity] = useState(65);
  const [simRoadClosure, setSimRoadClosure] = useState(false);
  const [selectedNode, setSelectedNode] = useState('NODE-SIG-101');
  const [toastMessage, setToastMessage] = useState(null);

  const handleToggleEmergencySimulation = () => {
    const next = !isSimulatingEmergency;
    setIsSimulatingEmergency(next);
    if (next) {
      setTwinMode('after');
      audio.playSiren();
      onActivateCorridor?.();
      setToastMessage('EMERGENCY CORRIDOR ENGAGED: Signals SC-501 to SC-504 dynamically preempted green in Digital Twin.');
    } else {
      setTwinMode('before');
      audio.playAlertBeep();
      setToastMessage('Digital Twin reset to baseline congested traffic state.');
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleClosure = () => {
    const next = !simRoadClosure;
    setSimRoadClosure(next);
    audio.playAlertBeep();
    if (next) {
      setToastMessage('ROAD CLOSURE INJECTED: Civil Lines Underpass marked submerged. Network re-routing flow.');
    } else {
      setToastMessage('Road closure lifted in simulation.');
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0b1428] border border-cyan-800/50 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-cyan-950 border border-cyan-700 rounded-xl text-cyan-400">
              <Network className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  TRANSPORTATION NETWORK DIGITAL TWIN
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  PHYSICS ENGINE ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Physics-based Simulation of Roads, Vehicles, Signals, Sensors, Closures & Emergency Corridors
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleToggleEmergencySimulation}
          className={`flex items-center space-x-2 px-4 py-2 text-white font-black text-xs rounded-xl shadow-lg transition-all ${
            isSimulatingEmergency 
              ? 'bg-gradient-to-r from-emerald-600 to-cyan-600 shadow-emerald-950' 
              : 'bg-gradient-to-r from-rose-600 to-red-600 shadow-red-950'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-300" />
          <span>{isSimulatingEmergency ? 'EMERGENCY CORRIDOR ENGAGED (RESET)' : 'SIMULATE EMERGENCY CORRIDOR'}</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-cyan-950 border border-cyan-500 text-cyan-200 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Simulation Controls Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-[#091122] p-4 rounded-xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Traffic Density:</span>
            <span className="text-cyan-300 font-bold">{simTrafficDensity}%</span>
          </div>
          <input 
            type="range"
            min="10"
            max="100"
            step="5"
            value={simTrafficDensity}
            onChange={(e) => setSimTrafficDensity(parseInt(e.target.value))}
            className="w-full accent-cyan-500 cursor-pointer"
          />
        </div>

        <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Road Closures</span>
            <span className={`text-xs font-bold font-mono ${simRoadClosure ? 'text-rose-400' : 'text-emerald-400'}`}>
              {simRoadClosure ? '1 Active Closure' : 'All Roads Open'}
            </span>
          </div>
          <button
            onClick={handleToggleClosure}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              simRoadClosure ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            {simRoadClosure ? 'Lift Closure' : 'Simulate Closure'}
          </button>
        </div>

        <div className="flex items-center justify-between bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Twin Mode State</span>
            <span className="text-xs font-bold font-mono text-cyan-300">
              {twinMode === 'after' ? 'Priority Green Wave' : 'Congested Gridlock'}
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setTwinMode('before')}
              className={`px-2 py-1 rounded text-[11px] font-bold ${twinMode === 'before' ? 'bg-red-950 text-red-300 border border-red-700' : 'text-slate-400'}`}
            >
              Before
            </button>
            <button
              onClick={() => setTwinMode('after')}
              className={`px-2 py-1 rounded text-[11px] font-bold ${twinMode === 'after' ? 'bg-emerald-950 text-emerald-300 border border-emerald-700' : 'text-slate-400'}`}
            >
              After
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Simulation Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State A: BEFORE */}
        <div className={`rounded-2xl border p-5 shadow-2xl transition-all ${
          twinMode === 'before' 
            ? 'bg-[#120f1a] border-red-500/80 ring-2 ring-red-500/30' 
            : 'bg-[#0a101f] border-slate-800 opacity-75'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-red-400 uppercase tracking-wider block">STATE 1</span>
              <h3 className="text-sm font-bold text-white">BEFORE: Baseline Traffic Congestion</h3>
            </div>
            <StatusBadge status="GRIDLOCK RISK" size="xs" />
          </div>

          <div className="mt-4 relative h-64 bg-[#060b14] rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            <svg viewBox="0 0 400 240" className="w-full h-full">
              <line x1="30" y1="120" x2="370" y2="120" stroke="#7f1d1d" strokeWidth="12" />
              <line x1="200" y1="20" x2="200" y2="220" stroke="#7f1d1d" strokeWidth="10" />

              {[60, 90, 120, 150, 180, 220, 250, 280, 310].map((x, i) => (
                <circle key={i} cx={x} cy="120" r="5" fill="#ef4444" />
              ))}

              <rect x="50" y="112" width="22" height="16" rx="4" fill="#dc2626" stroke="#ffffff" strokeWidth="1" />
              <text x="61" y="124" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">AMB</text>

              <circle cx="140" cy="100" r="6" fill="#ef4444" className="animate-pulse" />
              <circle cx="200" cy="100" r="6" fill="#ef4444" className="animate-pulse" />
              <circle cx="280" cy="100" r="6" fill="#ef4444" className="animate-pulse" />

              <rect x="340" y="95" width="40" height="40" rx="6" fill="#831843" stroke="#f472b6" strokeWidth="1.5" />
              <text x="360" y="118" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">ICU</text>
            </svg>

            <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-rose-300">
              Avg Speed: 14 km/h • 4 Red Signal Stops
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
              <span className="text-[9px] text-slate-400 block">ESTIMATED ETA</span>
              <span className="text-rose-400 font-bold text-base">24 min</span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
              <span className="text-[9px] text-slate-400 block">SIGNAL DELAY</span>
              <span className="text-amber-400 font-bold text-base">+13 min</span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded border border-slate-800">
              <span className="text-[9px] text-slate-400 block">SURVIVAL CHANCE</span>
              <span className="text-slate-300 font-bold text-base">At Risk</span>
            </div>
          </div>
        </div>

        {/* State B: AFTER */}
        <div className={`rounded-2xl border p-5 shadow-2xl transition-all ${
          twinMode === 'after' 
            ? 'bg-[#091b24] border-emerald-400/80 ring-2 ring-emerald-500/30 glow-emerald' 
            : 'bg-[#0a101f] border-slate-800 opacity-75'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">STATE 2</span>
              <h3 className="text-sm font-bold text-white">AFTER: Coordinated Green Corridor Active</h3>
            </div>
            <StatusBadge status="CORRIDOR OPTIMIZED" size="xs" />
          </div>

          <div className="mt-4 relative h-64 bg-[#060b14] rounded-xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
            <svg viewBox="0 0 400 240" className="w-full h-full">
              <line x1="30" y1="120" x2="370" y2="120" stroke="#047857" strokeWidth="14" />
              <line x1="30" y1="120" x2="370" y2="120" stroke="#10b981" strokeWidth="4" strokeDasharray="8 6" />
              <line x1="200" y1="20" x2="200" y2="220" stroke="#1e293b" strokeWidth="8" />

              {[80, 130, 240, 290].map((x, i) => (
                <circle key={i} cx={x} cy="104" r="4" fill="#38bdf8" />
              ))}

              <rect x="180" y="112" width="26" height="16" rx="4" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" className="animate-pulse" />
              <text x="193" y="124" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">AMB</text>

              <circle cx="140" cy="100" r="6" fill="#10b981" className="animate-pulse" />
              <circle cx="200" cy="100" r="6" fill="#10b981" className="animate-pulse" />
              <circle cx="280" cy="100" r="6" fill="#10b981" className="animate-pulse" />

              <rect x="340" y="95" width="40" height="40" rx="6" fill="#831843" stroke="#f472b6" strokeWidth="2" />
              <text x="360" y="118" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">ICU</text>
            </svg>

            <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-1 rounded text-[10px] font-mono text-emerald-300">
              Avg Speed: 68 km/h • Zero-Stop Wave
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-slate-900/90 p-2 rounded border border-emerald-800">
              <span className="text-[9px] text-slate-400 block">PRIORITY ETA</span>
              <span className="text-cyan-300 font-bold text-base">11 min</span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded border border-emerald-800">
              <span className="text-[9px] text-slate-400 block">TIME SAVED</span>
              <span className="text-emerald-400 font-bold text-base">13 min (54%)</span>
            </div>
            <div className="bg-slate-900/90 p-2 rounded border border-emerald-800">
              <span className="text-[9px] text-slate-400 block">TRAUMA SURVIVAL</span>
              <span className="text-emerald-300 font-bold text-base">Secured</span>
            </div>
          </div>
        </div>
      </div>

      {/* Simulated Network Nodes Explorer with Live Locations */}
      <div className="bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Simulated Network Nodes & Telemetry Links
            </h3>
            <p className="text-xs text-slate-400">1,420 Active Spatial Nodes across Roads, Vehicles, Signals & Sensors</p>
          </div>
          <span className="text-xs font-mono text-emerald-400">12ms Sync Latency</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { id: 'NODE-AMB-104', type: 'Emergency Vehicle', name: 'Ambulance AMB-104', lat: '28.6139', lng: '77.2090', speed: '68 km/h', status: 'Priority Corridor' },
            { id: 'NODE-SIG-101', type: 'Traffic Signal', name: 'Sector 18 Junction (SC-501)', lat: '28.6145', lng: '77.2082', speed: '0 km/h', status: 'Preempted Green' },
            { id: 'NODE-PH-204', type: 'Road Sensor', name: 'Outer Ring Rd Accelerometer', lat: '28.6152', lng: '77.2075', speed: '0 km/h', status: 'IMU Spikes Logged' },
            { id: 'NODE-HOSP-01', type: 'Hospital Gateway', name: 'Trauma Emergency Access', lat: '28.6122', lng: '77.2104', speed: '0 km/h', status: 'ICU Bed 04-A Ready' }
          ].map(node => (
            <div key={node.id} className="p-3 bg-[#0c162b] rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-cyan-300 font-bold text-[10px]">{node.id}</span>
                <StatusBadge status={node.status} size="xs" />
              </div>
              <h4 className="font-bold text-white text-xs">{node.name}</h4>
              <p className="text-[10px] text-slate-400 font-mono">{node.lat}° N, {node.lng}° E</p>

              <button
                onClick={() => {
                  audio.playAlertBeep();
                  onViewLiveLocation?.({
                    id: node.id,
                    name: node.name,
                    title: `Digital Twin: ${node.name}`,
                    location: `${node.lat}° N, ${node.lng}° E`,
                    lat: node.lat,
                    lng: node.lng,
                    speedKmh: parseInt(node.speed) || 0,
                    heading: '90° E',
                    accuracy: '±1 cm (Simulated Twin)',
                    category: 'Digital Twin Node',
                    details: `Spatial simulation node in Sector 18 cross-arterial model. Status: ${node.status}.`
                  });
                }}
                className="w-full py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-[10px] font-bold rounded-lg flex items-center justify-center space-x-1"
              >
                <Crosshair className="w-3 h-3 text-cyan-400" />
                <span>Track Simulated Node</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
