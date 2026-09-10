import React, { useState } from 'react';
import { 
  TrafficCone, Zap, Activity, Clock, Sliders, ShieldAlert, 
  CheckCircle2, AlertTriangle, Play, RefreshCw, BarChart2, Radio,
  MapPin, Eye, Car, Camera, ArrowRight, Crosshair, Siren, Layers
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import audio from '../../services/audioService';

export const EXTENDED_SIGNALS = [
  { id: 'SIG-101', name: 'Sector 18 / Ring Road Junction', state: 'GREEN', mode: 'Adaptive AI', queue: '6 veh', flow: '820 veh/h', waitTime: '12s', controller: 'SC-501', v2xConnected: true, lat: '28.6145', lng: '77.2082' },
  { id: 'SIG-102', name: 'Metro Station Crossway', state: 'YELLOW', mode: 'Adaptive AI', queue: '18 veh', flow: '1150 veh/h', waitTime: '34s', controller: 'SC-502', v2xConnected: true, lat: '28.6138', lng: '77.2089' },
  { id: 'SIG-103', name: 'Hospital Boulevard North', state: 'GREEN', mode: 'Corridor Preemption', queue: '3 veh', flow: '640 veh/h', waitTime: '8s', controller: 'SC-503', v2xConnected: true, lat: '28.6130', lng: '77.2096' },
  { id: 'SIG-104', name: 'Central Trauma Access Gate', state: 'GREEN', mode: 'Corridor Preemption', queue: '2 veh', flow: '430 veh/h', waitTime: '6s', controller: 'SC-504', v2xConnected: true, lat: '28.6122', lng: '77.2104' },
  { id: 'SIG-105', name: 'Tech Park Expressway Toll Ramp', state: 'RED', mode: 'Fixed Cycle', queue: '28 veh', flow: '1420 veh/h', waitTime: '55s', controller: 'SC-505', v2xConnected: true, lat: '28.6162', lng: '77.2058' },
  { id: 'SIG-106', name: 'Commercial Hub West Avenue', state: 'RED', mode: 'Adaptive AI', queue: '32 veh', flow: '1280 veh/h', waitTime: '62s', controller: 'SC-506', v2xConnected: true, lat: '28.6155', lng: '77.2065' },
  { id: 'SIG-107', name: 'Railway Station South Portal', state: 'GREEN', mode: 'Adaptive AI', queue: '11 veh', flow: '950 veh/h', waitTime: '22s', controller: 'SC-507', v2xConnected: true, lat: '28.6110', lng: '77.2118' },
  { id: 'SIG-108', name: 'Industrial Sector 62 Feeder', state: 'YELLOW', mode: 'Heavy Vehicle Priority', queue: '14 veh', flow: '710 veh/h', waitTime: '28s', controller: 'SC-508', v2xConnected: true, lat: '28.6178', lng: '77.2038' }
];

export const ILLEGAL_PARKING_INCIDENTS = [
  { id: 'PARK-01', vehicle: 'DL-3C-AZ-4412 (White SUV)', location: 'Sector 18 Ring Road Bus Rapid Lane', duration: '18 mins', impact: 'Blocking bus ingress; causes 80m queue', status: 'VIOLATION DETECTED', lat: '28.6144', lng: '77.2081' },
  { id: 'PARK-02', vehicle: 'HR-26-BK-9021 (Delivery Van)', location: 'Hospital Boulevard Emergency Splay', duration: '12 mins', impact: 'Impacting ambulance cornering arc', status: 'TOW DISPATCHED', lat: '28.6131', lng: '77.2095' }
];

export default function TrafficSignalsModule({
  signals = EXTENDED_SIGNALS,
  onUpdateSignals,
  isCorridorActive = false,
  onActivateCorridor,
  onViewLiveLocation,
  onNavigate
}) {
  const [signalsList, setSignalsList] = useState(signals && signals.length >= 8 ? signals : EXTENDED_SIGNALS);
  const [selectedSignal, setSelectedSignal] = useState(signalsList[0]);
  const [activeTab, setActiveTab] = useState('signals'); // 'signals' | 'congestion' | 'prediction' | 'blockage' | 'illegal_parking'
  const [overrideToast, setOverrideToast] = useState(null);
  const [parkingIncidents, setParkingIncidents] = useState(ILLEGAL_PARKING_INCIDENTS);
  const [corridorEngaged, setCorridorEngaged] = useState(isCorridorActive);

  // Proactive timing adjustment simulation state
  const [predictiveAdjusted, setPredictiveAdjusted] = useState(false);

  const handleForceSignal = (sigId, newState) => {
    const updated = signalsList.map(s => s.id === sigId ? { ...s, state: newState, mode: 'Manual Override' } : s);
    setSignalsList(updated);
    setSelectedSignal(prev => prev.id === sigId ? { ...prev, state: newState, mode: 'Manual Override' } : prev);
    onUpdateSignals?.(updated);
    audio.playAlertBeep();
    setOverrideToast(`Signal ${sigId} forced to ${newState} via Manual Command Override.`);
    setTimeout(() => setOverrideToast(null), 4000);
  };

  const handleResetToAI = (sigId) => {
    const updated = signalsList.map(s => s.id === sigId ? { ...s, mode: 'Adaptive AI', state: 'GREEN' } : s);
    setSignalsList(updated);
    setSelectedSignal(prev => prev.id === sigId ? { ...prev, mode: 'Adaptive AI', state: 'GREEN' } : prev);
    onUpdateSignals?.(updated);
    audio.playSuccessChime();
    setOverrideToast(`Signal ${sigId} returned to Adaptive AI Traffic Optimization.`);
    setTimeout(() => setOverrideToast(null), 4000);
  };

  const handleMasterGreenCorridor = () => {
    setCorridorEngaged(true);
    const updated = signalsList.map(s => ({
      ...s,
      state: 'GREEN',
      mode: 'Corridor Preemption',
      priorityStatus: 'Coordinated Green Preemption'
    }));
    setSignalsList(updated);
    if (selectedSignal) {
      setSelectedSignal(prev => ({ ...prev, state: 'GREEN', mode: 'Corridor Preemption' }));
    }
    onUpdateSignals?.(updated);
    onActivateCorridor?.();
    audio.playSiren();
    setOverrideToast('DYNAMIC GREEN CORRIDOR ENGAGED: Signals 101-104 overridden to GREEN preemption wave!');
    setTimeout(() => setOverrideToast(null), 5000);
  };

  const handleApplyPredictiveSplits = () => {
    setPredictiveAdjusted(true);
    audio.playSuccessChime();
    setOverrideToast('AI Predictive Timing Applied: Sector 18 green split extended by +18s to preempt sports stadium wave.');
    setTimeout(() => setOverrideToast(null), 4000);
  };

  const handleClearParkingViolation = (id) => {
    audio.playSuccessChime();
    setParkingIncidents(prev => prev.map(p => p.id === id ? { ...p, status: 'E-CHALLAN ISSUED & TOWED', duration: 'RESOLVED' } : p));
    setOverrideToast(`E-Challan ₹2,000 issued & Tow Truck dispatched for ${id}. Lane cleared!`);
    setTimeout(() => setOverrideToast(null), 4500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0b1428] border border-cyan-800/50 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-cyan-950 border border-cyan-700 rounded-xl text-cyan-400">
              <TrafficCone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  TRAFFIC & SIGNALS INTELLIGENCE
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  SIH26222 ACTIVE CORE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                V2X Preemption, AI Congestion Forecasts, Queue Balancing, Detours & Computer Vision Illegal Parking
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleMasterGreenCorridor}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-950 transition-all active:scale-95"
          >
            <Zap className="w-4 h-4 text-amber-200" />
            <span>ENGAGE DYNAMIC GREEN CORRIDOR</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs covering all user requirements */}
      <div className="flex flex-wrap items-center gap-2 bg-[#091122] p-2 rounded-xl border border-slate-800">
        {[
          { id: 'signals', label: 'Signal Monitoring & Priority', icon: TrafficCone },
          { id: 'congestion', label: 'Traffic & Congestion Monitoring', icon: Activity },
          { id: 'prediction', label: 'AI Traffic Prediction', icon: BarChart2 },
          { id: 'blockage', label: 'Road Blockage & Detours', icon: AlertTriangle },
          { id: 'illegal_parking', label: 'CV Illegal Parking Detection', icon: Camera }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                audio.playAlertBeep();
              }}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                isActive
                  ? 'bg-cyan-950 text-cyan-200 border border-cyan-500 shadow-lg shadow-cyan-950/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Toast Alert */}
      {overrideToast && (
        <div className="p-3 bg-cyan-950 border border-cyan-500 text-cyan-200 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{overrideToast}</span>
        </div>
      )}

      {/* ================= TAB 1: SIGNAL MONITORING & PRIORITY ================= */}
      {activeTab === 'signals' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Signal Inventory Grid */}
          <div className="lg:col-span-2 bg-[#091122] border border-cyan-900/50 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Connected Signal Array ({signalsList.length} Intersections)
              </h3>
              <span className="text-xs text-emerald-400 font-mono">V2X IEEE 802.11p Sync (10 Hz)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {signalsList.map((sig) => {
                const isSelected = selectedSignal.id === sig.id;
                return (
                  <div
                    key={sig.id}
                    onClick={() => setSelectedSignal(sig)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected 
                        ? 'bg-[#0f1f3d] border-cyan-400 glow-cyan' 
                        : 'bg-[#0c162b] border-slate-800 hover:border-cyan-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-cyan-300">{sig.id}</span>
                          <StatusBadge status={sig.mode} size="xs" />
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1 truncate" title={sig.name}>
                          {sig.name}
                        </h4>
                      </div>

                      {/* Light state orb */}
                      <div className="flex items-center space-x-1 bg-black/70 p-1.5 rounded-lg border border-slate-800">
                        <span className={`w-3 h-3 rounded-full ${sig.state === 'RED' ? 'bg-red-500 shadow-red-500 shadow' : 'bg-red-950'}`} />
                        <span className={`w-3 h-3 rounded-full ${sig.state === 'YELLOW' ? 'bg-yellow-400 shadow-yellow-400 shadow' : 'bg-yellow-950'}`} />
                        <span className={`w-3 h-3 rounded-full ${sig.state === 'GREEN' ? 'bg-emerald-400 shadow-emerald-400 shadow animate-pulse' : 'bg-emerald-950'}`} />
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800/80 grid grid-cols-3 gap-1 text-[10px] font-mono">
                      <div>
                        <span className="text-slate-400 block">Queue</span>
                        <span className="text-slate-200 font-semibold">{sig.queue}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Flow</span>
                        <span className="text-cyan-300 font-semibold">{sig.flow}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Wait</span>
                        <span className="text-emerald-400 font-semibold">{sig.waitTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Signal Inspector & Manual Override */}
          <div className="bg-[#091122] border border-cyan-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Controller Telemetry
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {selectedSignal.controller}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Intersection</p>
                  <h4 className="text-sm font-bold text-white">{selectedSignal.name}</h4>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-[#0e1932] p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Current Light</span>
                    <span className={`font-mono font-bold text-sm ${
                      selectedSignal.state === 'GREEN' ? 'text-emerald-400' : selectedSignal.state === 'YELLOW' ? 'text-yellow-400' : 'text-rose-400'
                    }`}>
                      {selectedSignal.state}
                    </span>
                  </div>
                  <div className="bg-[#0e1932] p-2.5 rounded-lg border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Active Mode</span>
                    <span className="font-semibold text-cyan-300 truncate block">{selectedSignal.mode}</span>
                  </div>
                </div>

                {/* Live Location pill */}
                <div className="p-3 bg-[#0a1428] rounded-xl border border-cyan-900/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">GPS Coordinates</span>
                      <span className="text-xs font-mono text-cyan-200">{selectedSignal.lat || '28.6145'}° N, {selectedSignal.lng || '77.2082'}° E</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      audio.playAlertBeep();
                      onViewLiveLocation?.({
                        id: selectedSignal.id,
                        name: selectedSignal.name,
                        title: `${selectedSignal.name} (${selectedSignal.controller})`,
                        location: selectedSignal.name,
                        lat: selectedSignal.lat || '28.6145',
                        lng: selectedSignal.lng || '77.2082',
                        speedKmh: 0,
                        heading: '0° N',
                        category: 'Traffic Signal Node',
                        details: `Connected V2X Signal Controller. Active mode: ${selectedSignal.mode}. Light: ${selectedSignal.state}.`
                      });
                    }}
                    className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold text-[11px] rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>Track Live</span>
                  </button>
                </div>

                <div className="p-3 bg-[#0d162b] rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-slate-400">V2X DSRC Status:</span><span className="text-emerald-300">LINKED (10 Hz)</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Hardware SoC:</span><span className="text-slate-200">STM32H7 Dual-Core</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Emergency Preempts:</span><span className="text-cyan-300">18 today</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Pedestrian Phase:</span><span className="text-slate-200">Clear / Auto-Hold</span></div>
                </div>
              </div>
            </div>

            {/* Override Action Controls */}
            <div className="pt-4 border-t border-slate-800 space-y-2">
              <p className="text-[11px] font-bold text-slate-300 uppercase">Signal Priority & Override</p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleForceSignal(selectedSignal.id, 'GREEN')}
                  className="py-2 px-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Force GREEN
                </button>
                <button
                  onClick={() => handleForceSignal(selectedSignal.id, 'YELLOW')}
                  className="py-2 px-2 bg-yellow-600 hover:bg-yellow-500 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Force YELLOW
                </button>
                <button
                  onClick={() => handleForceSignal(selectedSignal.id, 'RED')}
                  className="py-2 px-2 bg-red-700 hover:bg-red-600 text-white font-bold text-xs rounded-lg transition-colors"
                >
                  Force RED
                </button>
              </div>
              <button
                onClick={() => handleResetToAI(selectedSignal.id)}
                className="w-full py-2 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold text-xs rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Resume Adaptive AI Optimization</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: TRAFFIC & CONGESTION MONITORING ================= */}
      {activeTab === 'congestion' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#091122] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">City Congestion Index</span>
              <h3 className="text-2xl font-black font-mono text-amber-400 mt-1">32%</h3>
              <p className="text-xs text-slate-400 mt-1">Reduced from 58% peak (-26% AI Balanced)</p>
            </div>
            <div className="bg-[#091122] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Arterial Flow Rate</span>
              <h3 className="text-2xl font-black font-mono text-cyan-300 mt-1">1,120 veh/hr</h3>
              <p className="text-xs text-slate-400 mt-1">Optimal continuous velocity maintained</p>
            </div>
            <div className="bg-[#091122] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Average Wait Time</span>
              <h3 className="text-2xl font-black font-mono text-emerald-400 mt-1">24.2 sec</h3>
              <p className="text-xs text-slate-400 mt-1">Down from 54 sec under static cycles</p>
            </div>
            <div className="bg-[#091122] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Corridor Preemption Wave</span>
              <h3 className="text-2xl font-black font-mono text-emerald-300 mt-1">READY</h3>
              <p className="text-xs text-slate-400 mt-1">Green preemption active for emergency routes</p>
            </div>
          </div>

          {/* Major Arterial Congestion Table */}
          <div className="bg-[#091122] border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Arterial Congestion Heat & Density Ratings
            </h3>
            <div className="space-y-3">
              {[
                { name: 'Outer Ring Road (Sector 18 to Expressway)', density: 28, flow: '1,420 v/h', speed: '52 km/h', status: 'OPTIMAL FLOW' },
                { name: 'Metro Station Central Flyover Approach', density: 42, flow: '1,150 v/h', speed: '38 km/h', status: 'MODERATE DENSITY' },
                { name: 'Hospital Boulevard North Corridor', density: 16, flow: '640 v/h', speed: '64 km/h', status: 'CLEARED CORRIDOR' },
                { name: 'Industrial Sector 62 Freight Feeder', density: 64, flow: '890 v/h', speed: '24 km/h', status: 'HEAVY VEHICLE SURGE' }
              ].map((art, idx) => (
                <div key={idx} className="p-3 bg-[#0c162b] rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="font-bold text-white text-sm">{art.name}</span>
                    <div className="flex items-center space-x-3 text-slate-400 font-mono text-[11px]">
                      <span>Flow: <strong className="text-cyan-300">{art.flow}</strong></span>
                      <span>Speed: <strong className="text-emerald-400">{art.speed}</strong></span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${art.density > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${art.density}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-slate-200 min-w-[36px]">{art.density}%</span>
                    <StatusBadge status={art.status} size="xs" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: AI TRAFFIC PREDICTION ================= */}
      {activeTab === 'prediction' && (
        <div className="bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                AI Diurnal Traffic Forecasting & Queue Surge Warning
              </h3>
              <p className="text-xs text-slate-400">Machine learning model trained on 18 months of historical urban movement + weather + events</p>
            </div>
            <button
              onClick={handleApplyPredictiveSplits}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
            >
              {predictiveAdjusted ? 'PREDICTIVE TIMINGS APPLIED ✓' : 'APPLY PREDICTIVE SPLITS (+18s)'}
            </button>
          </div>

          <div className="p-4 bg-amber-950/40 border border-amber-500/50 rounded-xl text-amber-200 text-xs flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold uppercase tracking-wider">Predictive Queue Surge Alert: Sector 18 (T+25 min)</h4>
              <p className="mt-0.5 text-slate-300">
                Football stadium match concludes at 18:30. AI forecasts +45% outbound traffic surge at Junction SIG-101.
              </p>
              <p className="text-[11px] font-mono text-cyan-300 mt-1">
                Recommended Action: Preemptively lengthen North-South green phase by +18 seconds to avoid queue spillover onto Ring Road.
              </p>
            </div>
          </div>

          {/* Diurnal Congestion Bar Visualizer */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase font-mono">24-Hour Diurnal Congestion Forecast vs Observed Flow</span>
            <div className="h-40 flex items-end justify-between pt-4 px-2 gap-2 border-b border-slate-800">
              {[
                { time: '08:00', density: 68, label: 'Morning Peak' },
                { time: '10:00', density: 78, label: 'Business Rush' },
                { time: '12:00', density: 44, label: 'Midday' },
                { time: '14:00', density: 48, label: 'School Run' },
                { time: '16:00', density: 62, label: 'Early Egress' },
                { time: '18:00', density: 84, label: 'Evening Peak' },
                { time: '20:00', density: 55, label: 'Post-Rush' },
                { time: '22:00', density: 28, label: 'Night Freight' }
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                  <div 
                    className="w-full bg-gradient-to-t from-cyan-900 to-cyan-400 hover:to-cyan-200 rounded-t transition-all relative"
                    style={{ height: `${bar.density}%` }}
                  >
                    <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-black/90 px-1.5 py-0.5 rounded text-[9px] font-mono text-cyan-300 border border-cyan-800 transition-opacity whitespace-nowrap">
                      {bar.density}%
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400">{bar.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: ROAD BLOCKAGE & DETOURS ================= */}
      {activeTab === 'blockage' && (
        <div className="bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Active Road Blockage & Dynamic Signal Detours
              </h3>
              <p className="text-xs text-slate-400">Automated phase reduction on blocked approaches with reroute signals</p>
            </div>
            <StatusBadge status="ACTIVE DETOUR ROUTING" size="xs" />
          </div>

          <div className="p-4 bg-[#0c162b] rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-mono text-xs font-bold text-rose-400">BLOCKAGE-08: CIVIL LINES SUBWAY</span>
                <h4 className="text-sm font-bold text-white mt-1">Waterlogging 52cm - Underpass Barrier Lowered</h4>
                <p className="text-xs text-slate-300 mt-1">Civil Lines Subway closed due to submerged pump failure. Traffic diverted via Flyover Link 2.</p>
              </div>
              <span className="px-2 py-1 rounded bg-rose-950 text-rose-300 text-xs font-mono font-bold border border-rose-800">
                ROAD CLOSED
              </span>
            </div>

            <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800 text-xs font-mono space-y-1">
              <div className="text-cyan-300 font-bold">Coordinated Signal Adjustments:</div>
              <div className="text-slate-300">• Signal SIG-102 (Metro Crossway) diverted left-turn phase extended to 45s</div>
              <div className="text-slate-300">• Variable message sign VMS-04 displaying "Subway Closed - Use Flyover"</div>
              <div className="text-emerald-400 font-bold">• Zero vehicle trapping inside underpass achieved</div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: CV ILLEGAL PARKING DETECTION ================= */}
      {activeTab === 'illegal_parking' && (
        <div className="bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Computer Vision Illegal Parking Detection (AI CCTV)
              </h3>
              <p className="text-xs text-slate-400">Automated lane obstruction detection in active transit & emergency corridors</p>
            </div>
            <span className="text-xs font-mono text-rose-400">Automated E-Challan & Tow Dispatch</span>
          </div>

          <div className="space-y-3">
            {parkingIncidents.map((p) => (
              <div key={p.id} className="p-4 bg-[#0c162b] rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-amber-400">{p.id}</span>
                    <span className="text-xs font-black text-white">{p.vehicle}</span>
                    <StatusBadge status={p.status} size="xs" />
                  </div>
                  <p className="text-xs text-slate-300">{p.location}</p>
                  <p className="text-[11px] font-mono text-rose-300">Parked: {p.duration} • {p.impact}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      audio.playAlertBeep();
                      onViewLiveLocation?.({
                        id: p.id,
                        name: p.vehicle,
                        title: `Illegal Parking: ${p.vehicle}`,
                        location: p.location,
                        lat: p.lat,
                        lng: p.lng,
                        speedKmh: 0,
                        heading: '0° N',
                        category: 'Parking Violation',
                        details: `${p.impact}. Parked duration: ${p.duration}.`
                      });
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center space-x-1"
                  >
                    <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Track Location</span>
                  </button>

                  <button
                    onClick={() => handleClearParkingViolation(p.id)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition-all"
                  >
                    Issue E-Challan & Tow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
