import React, { useState, useEffect } from 'react';
import { 
  Siren, Zap, Building2, Flame, ShieldAlert, CheckCircle2, 
  ArrowRight, Radio, HeartPulse, Clock, Navigation, AlertOctagon, 
  Check, Play, RotateCcw, Droplets, MapPin, Gauge, Crosshair, Shield
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import audio from '../../services/audioService';

export default function EmergencyModule({ 
  emergencies = [], 
  signals = [], 
  hospitals = [],
  isCorridorActive = true,
  onActivateCorridor,
  onNotifyHospital,
  hospitalNotified = true,
  onViewLiveLocation,
  onNavigate
}) {
  const [selectedEmergencyId, setSelectedEmergencyId] = useState('EMG-901');
  const [simulationStep, setSimulationStep] = useState(1); // 1 = at start, 2 = past sig 1, 3 = past sig 2, 4 = at hospital
  const [corridorActive, setCorridorActive] = useState(isCorridorActive);
  const [hospitalAlertSent, setHospitalAlertSent] = useState(hospitalNotified);
  const [notificationToast, setNotificationToast] = useState(null);
  const [activeTab, setActiveTab] = useState('ambulance'); // 'ambulance' | 'fire' | 'hospital'

  const currentEmergency = emergencies.find(e => e.id === selectedEmergencyId) || emergencies[0];
  const targetHospital = hospitals[0];

  // Dynamic signals based on simulation step & corridor active state
  const computedSignals = signals.map((sig, idx) => {
    let state = sig.state;
    let priorityStatus = sig.priorityStatus;

    if (corridorActive) {
      if (simulationStep >= idx + 1) {
        state = 'GREEN';
        priorityStatus = 'Preempted (GREEN) - Passage Cleared';
      } else if (simulationStep === idx) {
        state = 'PRIORITY (GREEN)';
        priorityStatus = 'Priority Activated';
      } else {
        state = 'YELLOW';
        priorityStatus = 'Preparing Preemption';
      }
    } else {
      state = sig.normalState;
      priorityStatus = 'Normal Standard Timing';
    }

    return {
      ...sig,
      state,
      priorityStatus,
      isGreen: (state || '').includes('GREEN')
    };
  });

  const handleActivateCorridorClick = () => {
    setCorridorActive(true);
    onActivateCorridor?.();
    audio.playSiren();
    setNotificationToast({
      title: 'DYNAMIC GREEN CORRIDOR ACTIVATED!',
      message: 'V2I Preemption signal broadcasted to Signals 01-04. Traffic lights switched to emergency green override.',
      type: 'success'
    });
    setTimeout(() => setNotificationToast(null), 5000);
  };

  const handleNotifyHospitalClick = () => {
    setHospitalAlertSent(true);
    onNotifyHospital?.();
    audio.playSuccessChime();
    setNotificationToast({
      title: 'HOSPITAL EMERGENCY DEPARTMENT NOTIFIED!',
      message: `Direct dispatch packet received at ${targetHospital.name}. Trauma Team Alpha alerted. ICU Bed 04-A reserved.`,
      type: 'hospital'
    });
    setTimeout(() => setNotificationToast(null), 5000);
  };

  const handleAdvanceSimulation = () => {
    setSimulationStep(prev => {
      const next = prev < 4 ? prev + 1 : 1;
      if (next === 4) {
        audio.playSuccessChime();
      } else {
        audio.playAlertBeep();
      }
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Title & Hero Header */}
      <div className="bg-gradient-to-r from-red-950/70 via-[#101b33] to-[#0d162b] border border-red-500/30 rounded-2xl p-4 sm:p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 bg-red-600/20 border border-red-500/50 rounded-xl text-red-400">
                <Siren className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white">
                    EMERGENCY RESPONSE & GREEN CORRIDOR
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950 text-red-300 border border-red-800">
                    HERO DEMO
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Autonomous V2X Traffic Signal Preemption, Dynamic Priority Routing & Hospital Trauma Coordination
                </p>
              </div>
            </div>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('ambulance')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ambulance' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Siren className="w-4 h-4" />
              <span>Ambulance AMB-104</span>
            </button>
            <button
              onClick={() => setActiveTab('hospital')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'hospital' ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Hospital Control</span>
            </button>
            <button
              onClick={() => setActiveTab('fire')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'fire' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Flame className="w-4 h-4" />
              <span>Fire & Rescue</span>
            </button>
            <button
              onClick={() => setActiveTab('police')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'police' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Police Patrol</span>
            </button>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notificationToast && (
        <div className={`p-4 rounded-xl border flex items-start space-x-3 shadow-2xl animate-in slide-in-from-top-4 ${
          notificationToast.type === 'hospital' 
            ? 'bg-pink-950/90 border-pink-500/70 text-pink-100' 
            : 'bg-emerald-950/90 border-emerald-500/70 text-emerald-100'
        }`}>
          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-current" />
          <div className="flex-1">
            <h4 className="text-xs font-bold uppercase tracking-wider">{notificationToast.title}</h4>
            <p className="text-xs text-slate-200 mt-0.5">{notificationToast.message}</p>
          </div>
        </div>
      )}

      {/* ================= TAB 1: AMBULANCE & DYNAMIC GREEN CORRIDOR ================= */}
      {activeTab === 'ambulance' && (
        <div className="space-y-6">
          {/* Priority Route Metric Showcase (Section 7) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Normal ETA */}
            <div className="bg-[#0e172a] border border-slate-800 rounded-xl p-4 shadow-lg">
              <p className="text-[11px] font-bold uppercase text-slate-400">Normal Highway ETA</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-2xl font-black font-mono text-slate-300">
                  {currentEmergency.normalEtaMinutes} min
                </span>
                <span className="text-xs text-rose-400 font-mono">Heavy Traffic Delay</span>
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Standard civilian flow with 4 red signal stops</p>
            </div>

            {/* Priority ETA */}
            <div className="bg-[#0b1c2b] border border-cyan-700/60 rounded-xl p-4 shadow-lg glow-cyan">
              <p className="text-[11px] font-bold uppercase text-cyan-400">Emergency Priority ETA</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-black font-mono text-cyan-300">
                  {currentEmergency.priorityEtaMinutes} min
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">54% Faster</span>
              </div>
              <p className="text-[10px] text-cyan-300/80 mt-2">Zero-stop preemption corridor active</p>
            </div>

            {/* Time Saved Hero Metric */}
            <div className="bg-gradient-to-br from-emerald-950 to-[#0c1f24] border border-emerald-500/60 rounded-xl p-4 shadow-lg glow-emerald">
              <p className="text-[11px] font-bold uppercase text-emerald-300">Life-Critical Time Saved</p>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-3xl font-black font-mono text-emerald-400">
                  {currentEmergency.timeSavedMinutes} min
                </span>
                <span className="text-xs text-emerald-200 font-mono">Golden Hour Saved</span>
              </div>
              <p className="text-[10px] text-emerald-300/80 mt-2">Trauma patient golden window secured</p>
            </div>

            {/* Corridor Activation Controller */}
            <div className="bg-[#141226] border border-red-600/50 rounded-xl p-4 flex flex-col justify-between shadow-lg">
              <div>
                <p className="text-[11px] font-bold uppercase text-red-300">Corridor Status</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${corridorActive ? 'bg-emerald-400 animate-ping' : 'bg-red-500'}`} />
                  <span className="text-sm font-bold font-mono text-white">
                    {corridorActive ? 'GREEN CORRIDOR ACTIVE' : 'CORRIDOR STANDBY'}
                  </span>
                </div>
              </div>
              <div className="mt-3 flex items-center space-x-2">
                <button
                  onClick={handleActivateCorridorClick}
                  className="flex-1 py-2 px-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs rounded-lg uppercase tracking-wider shadow-lg shadow-red-900/50 border border-red-400/50 transition-all flex items-center justify-center space-x-2"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>ACTIVATE CORRIDOR</span>
                </button>
                <button
                  onClick={() => {
                    audio.playAlertBeep();
                    onViewLiveLocation?.({
                      id: 'AMB-104',
                      name: 'Advanced Life Support Ambulance AMB-104',
                      title: 'ALS Ambulance AMB-104',
                      location: 'Dwarka Expressway Km 14 → City Trauma Center',
                      lat: '28.6139',
                      lng: '77.2090',
                      speedKmh: 68,
                      heading: '045° NE',
                      accuracy: '±8 cm (RTK GNSS + V2I OBU)',
                      category: 'Emergency Ambulance Response',
                      driver: 'Dr. Anita Roy (EMT Chief) & Pilot Rajesh',
                      details: 'Patient: Code Red cardiac arrest risk. Active Green Corridor Preemption engaged.',
                      actionTaken: 'Signals 101-104 held green. Hospital trauma bay reserved with ICU Bed 04-A.'
                    });
                  }}
                  className="py-2 px-2.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white rounded-lg text-xs font-bold border border-slate-700 flex items-center space-x-1"
                  title="Track Live GPS Location"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>Track</span>
                </button>
              </div>
            </div>
          </div>

          {/* SECTION 8: DYNAMIC GREEN CORRIDOR VISUAL SIMULATION */}
          <div className="bg-[#0a1224] border border-cyan-800/60 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-cyan-900/50">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-wide">
                    DYNAMIC GREEN CORRIDOR SEQUENCE SIMULATION
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                    V2I PREEMPTION
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Real-time progression: As the ambulance approaches each intersection, signals transition: RED → PRIORITY → GREEN
                </p>
              </div>

              {/* Simulation Stepper Button */}
              <div className="flex items-center space-x-2 shrink-0">
                <button
                  onClick={handleAdvanceSimulation}
                  className="flex items-center space-x-2 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs rounded-lg shadow-lg shadow-cyan-950 transition-all"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Advance Ambulance (Step {simulationStep}/4)</span>
                </button>
                <button
                  onClick={() => { setSimulationStep(1); audio.playAlertBeep(); }}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                  title="Reset Corridor"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Visual Corridor Node Sequence */}
            <div className="relative">
              {/* Progress Connector Track */}
              <div className="hidden lg:block absolute top-1/2 left-10 right-10 h-1 bg-slate-800 -translate-y-1/2 z-0">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 via-emerald-400 to-cyan-400 transition-all duration-500" 
                  style={{ width: `${(simulationStep / 4) * 100}%` }}
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-6 gap-4 relative z-10">
                {/* Node 0: Ambulance Origin */}
                <div className={`p-4 rounded-xl border transition-all ${
                  simulationStep === 1 ? 'bg-red-950/80 border-red-500 glow-red ring-2 ring-red-500/50' : 'bg-[#0f1a30] border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-red-400 font-bold">START POINT</span>
                    <Siren className="w-4 h-4 text-red-400 animate-pulse" />
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">Ambulance AMB-104</h4>
                  <p className="text-[10px] text-slate-400">Dwarka Sec 10</p>
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-cyan-300">
                    Speed: 68 km/h
                  </div>
                </div>

                {/* Nodes 1 to 4: Signals SIG-101 to SIG-104 */}
                {computedSignals.map((sig, idx) => {
                  const isCurrentTarget = simulationStep === idx + 1;
                  const isPassed = simulationStep > idx + 1;

                  return (
                    <div 
                      key={sig.id} 
                      className={`p-4 rounded-xl border transition-all ${
                        isCurrentTarget
                          ? 'bg-[#0f243a] border-emerald-400 glow-emerald ring-2 ring-emerald-500/50' 
                          : isPassed
                            ? 'bg-[#0b1c2b] border-cyan-800/80 opacity-90'
                            : 'bg-[#0c162c] border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{sig.id}</span>
                        {/* Traffic light icon indicator */}
                        <div className="flex space-x-1 p-1 bg-black/60 rounded border border-slate-800">
                          <span className={`w-2 h-2 rounded-full ${sig.state === 'RED' ? 'bg-red-500 shadow-red-500 shadow' : 'bg-red-950'}`} />
                          <span className={`w-2 h-2 rounded-full ${sig.state === 'YELLOW' ? 'bg-yellow-400 shadow-yellow-400 shadow' : 'bg-yellow-950'}`} />
                          <span className={`w-2 h-2 rounded-full ${sig.isGreen ? 'bg-emerald-400 shadow-emerald-400 shadow animate-pulse' : 'bg-emerald-950'}`} />
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-white mt-2 truncate" title={sig.name}>
                        {sig.name}
                      </h4>
                      <p className="text-[11px] font-mono font-semibold text-cyan-300 mt-0.5">
                        {sig.distanceMeters} m
                      </p>

                      <div className="mt-3 pt-2 border-t border-slate-800 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">State:</span>
                          <span className={`font-mono font-bold ${
                            sig.isGreen ? 'text-emerald-400' : sig.state === 'YELLOW' ? 'text-yellow-400' : 'text-rose-400'
                          }`}>
                            {sig.state}
                          </span>
                        </div>
                        <p className="text-[9px] text-slate-400 truncate" title={sig.priorityStatus}>
                          {sig.priorityStatus}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* Node 5: Destination Hospital */}
                <div className={`p-4 rounded-xl border transition-all ${
                  simulationStep === 4 ? 'bg-pink-950/80 border-pink-500 glow-red ring-2 ring-pink-500/50' : 'bg-[#0f1a30] border-slate-800'
                }`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-pink-400 font-bold">DESTINATION</span>
                    <Building2 className="w-4 h-4 text-pink-400" />
                  </div>
                  <h4 className="text-xs font-bold text-white mt-1">City Trauma Center</h4>
                  <p className="text-[10px] text-slate-400">Emergency Bay 01</p>
                  <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono text-emerald-300">
                    {simulationStep === 4 ? 'AMBULANCE ARRIVED' : 'ICU Bed 04-A Reserved'}
                  </div>
                </div>
              </div>
            </div>

            {/* Live Vehicle Telemetry & Health Panel */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-cyan-900/40">
              <div className="bg-[#0b1426] p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold mb-2">
                  <Gauge className="w-4 h-4 text-cyan-400" />
                  <span>VEHICLE TELEMETRY</span>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-slate-400">Vehicle ID:</span><span className="text-white font-bold">{currentEmergency.vehicleId}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Driver & EMT:</span><span className="text-slate-200">{currentEmergency.driver}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Speed:</span><span className="text-cyan-300">{currentEmergency.speedKmh} km/h</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Distance Remaining:</span><span className="text-emerald-300">{currentEmergency.distanceRemainingKm} km</span></div>
                </div>
              </div>

              <div className="bg-[#0b1426] p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold mb-2">
                  <Radio className="w-4 h-4 text-emerald-400" />
                  <span>COMMUNICATIONS & V2X</span>
                </div>
                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between"><span className="text-slate-400">GPS Status:</span><span className="text-emerald-300">{currentEmergency.gpsStatus}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Network Mesh:</span><span className="text-cyan-300">{currentEmergency.commStatus}</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Hospital Link:</span><span className="text-emerald-300">CONNECTED</span></div>
                  <div className="flex justify-between"><span className="text-slate-400">Preemption Protocol:</span><span className="text-amber-300">IEEE 1609.2 / V2I</span></div>
                </div>
              </div>

              <div className="bg-[#0b1426] p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2 text-slate-400 text-xs font-semibold mb-2">
                  <HeartPulse className="w-4 h-4 text-rose-400 animate-pulse" />
                  <span>PATIENT VITALS TELEMETRY</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center mt-2">
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">HEART RATE</span>
                    <span className="font-mono text-rose-400 font-black text-sm">{currentEmergency.vitals.hr} bpm</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">BLOOD PRESS</span>
                    <span className="font-mono text-cyan-300 font-black text-sm">{currentEmergency.vitals.bp}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">SpO2</span>
                    <span className="font-mono text-emerald-400 font-black text-sm">{currentEmergency.vitals.spo2}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: HOSPITAL EMERGENCY CONTROL (SECTION 9) ================= */}
      {activeTab === 'hospital' && (
        <div className="space-y-6">
          <div className="bg-[#0a1324] border border-pink-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-pink-900/40">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-pink-950 border border-pink-700 rounded-xl text-pink-400">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{targetHospital.name}</h3>
                  <p className="text-xs text-slate-400">Hospital Emergency Department & Trauma Resuscitation Command</p>
                </div>
              </div>

              <button
                onClick={handleNotifyHospitalClick}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-pink-950 transition-all"
              >
                <Radio className="w-4 h-4" />
                <span>NOTIFY HOSPITAL (BROADCAST INBOUND)</span>
              </button>
            </div>

            {/* Inbound Ambulance Status Cards */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Incoming Ambulance</p>
                <h4 className="text-xl font-bold font-mono text-cyan-300 mt-1">AMB-104</h4>
                <p className="text-xs text-slate-300 mt-1">Cardiac Emergency (Dr. Anita EMT Lead)</p>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Ambulance ETA</p>
                <h4 className="text-2xl font-bold font-mono text-emerald-400 mt-1">06 min</h4>
                <p className="text-xs text-emerald-300/80 mt-1">Direct Priority Route Active</p>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Emergency Priority</p>
                <h4 className="text-xl font-bold font-mono text-rose-400 mt-1">CODE RED / CRITICAL</h4>
                <p className="text-xs text-slate-300 mt-1">Cardiac Arrest Risk</p>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Hospital Notified Status</p>
                <div className="flex items-center space-x-2 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-sm font-bold font-mono text-emerald-300">
                    {hospitalAlertSent ? 'NOTIFIED & CONFIRMED' : 'PENDING NOTIFICATION'}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Trauma resuscitation bay 01 prepped</p>
              </div>
            </div>

            {/* Hospital Readiness & Resources */}
            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#0b1428] p-4 rounded-xl border border-slate-800">
                <h5 className="text-xs font-bold text-pink-300 uppercase">Emergency Department Readiness</h5>
                <p className="text-2xl font-mono font-bold text-white mt-1">100% READY</p>
                <p className="text-xs text-slate-400 mt-1">Trauma Surgeon, Cardiologist & Resuscitation Nurse on standby at Bay 1</p>
              </div>

              <div className="bg-[#0b1428] p-4 rounded-xl border border-slate-800">
                <h5 className="text-xs font-bold text-cyan-300 uppercase">Available ICU Beds</h5>
                <p className="text-2xl font-mono font-bold text-cyan-300 mt-1">
                  {targetHospital.availableIcuBeds} <span className="text-xs text-slate-400">/ {targetHospital.totalIcuBeds} Total</span>
                </p>
                <p className="text-xs text-slate-400 mt-1">Reserved Bed 04-A equipped with ventilator</p>
              </div>

              <div className="bg-[#0b1428] p-4 rounded-xl border border-slate-800">
                <h5 className="text-xs font-bold text-emerald-300 uppercase">Blood Bank Reserves</h5>
                <p className="text-sm font-mono font-bold text-emerald-300 mt-1">{targetHospital.bloodBankStock}</p>
                <p className="text-xs text-slate-400 mt-1">Cross-matched units ready for instant transfusion</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: FIRE & RESCUE (SECTION 10) ================= */}
      {activeTab === 'fire' && (
        <div className="space-y-6">
          <div className="bg-[#120f24] border border-orange-700/50 rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-orange-900/40">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-orange-950 border border-orange-700 rounded-xl text-orange-400">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Fire & Heavy Rescue Command</h3>
                  <p className="text-xs text-slate-400">Water Tender Tracking, Hydrant Proximity & Hazmat Rapid Response</p>
                </div>
              </div>
              <StatusBadge status="ACTIVE INCIDENT" />
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Fire Tender Unit</p>
                <h4 className="text-xl font-bold font-mono text-orange-300 mt-1">FIRE-22</h4>
                <p className="text-xs text-slate-300 mt-1">10,000L Foam & Water Tender (Cmdr. M. Singh)</p>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Target Incident</p>
                <h4 className="text-sm font-bold text-white mt-1">Commercial Warehouse Blaze</h4>
                <p className="text-xs text-amber-300 mt-1">Industrial Sector 62 Yard (Class B Fire)</p>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Fire Response Priority Route</p>
                <h4 className="text-xl font-bold font-mono text-emerald-400 mt-1">16 min ETA</h4>
                <p className="text-xs text-slate-400 mt-1">Normal ETA: 32 min (Saved 16 mins)</p>
              </div>
            </div>

            {/* Nearby Water Sources */}
            <div className="mt-6 p-4 rounded-xl bg-[#0a1226] border border-slate-800">
              <h5 className="text-xs font-bold text-cyan-300 uppercase flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-cyan-400" />
                <span>Nearby Water Sources & Fire Hydrants along Incident Perimeter</span>
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">Municipal Fire Hydrant H-104</p>
                    <p className="text-[10px] text-slate-400">120m from warehouse gate • Pressure: 4.8 Bar</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800">
                    OPERATIONAL
                  </span>
                </div>
                <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-white">Yamuna Canal Siphon Intake #3</p>
                    <p className="text-[10px] text-slate-400">450m East • High Volume Open Suction</p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">
                    UNLIMITED WATER
                  </span>
                </div>
              </div>

              {/* Track Fire Tender Button */}
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => {
                    audio.playAlertBeep();
                    onViewLiveLocation?.({
                      id: 'FIRE-22',
                      name: 'Heavy Water Tender & Rescue FIRE-22',
                      title: 'Fire Tender FIRE-22',
                      location: 'Industrial Sector 62 Yard',
                      lat: '28.6172',
                      lng: '77.2045',
                      speedKmh: 54,
                      heading: '135° SE',
                      accuracy: '±12 cm (TETRA Radio)',
                      category: 'Emergency Fire & Rescue',
                      driver: 'Station Commander M. Singh',
                      details: '10,000L Foam & Water Tender responding to Commercial Warehouse Blaze.',
                      actionTaken: 'Corridor preemption active. Hydrant H-104 pressure reserved.'
                    });
                  }}
                  className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1.5"
                >
                  <Crosshair className="w-4 h-4" />
                  <span>Track Fire Tender Live Location</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: POLICE PATROL & ESCORT ================= */}
      {activeTab === 'police' && (
        <div className="space-y-6">
          <div className="bg-[#0e1628] border border-blue-700/50 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-900/40">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-blue-950 border border-blue-700 rounded-xl text-blue-400">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Highway Police Patrol & Corridor Escort</h3>
                  <p className="text-xs text-slate-400">High-Speed Interceptor POL-18, Highway Multi-Vehicle Pileup Triage & Traffic Clearance</p>
                </div>
              </div>
              <button
                onClick={() => {
                  audio.playAlertBeep();
                  onViewLiveLocation?.({
                    id: 'POL-18',
                    name: 'Highway Patrol Interceptor POL-18',
                    title: 'Highway Patrol Interceptor POL-18',
                    location: 'North Expressway Control Post (Km 24 Merge)',
                    lat: '28.6165',
                    lng: '77.2062',
                    speedKmh: 82,
                    heading: '270° W',
                    accuracy: '±10 cm (POLNET V2X)',
                    category: 'Police Emergency Response',
                    driver: 'Inspector Vikram Rathore',
                    details: 'High-speed interceptor clearing lane obstructions for incoming ALS Ambulance AMB-104.',
                    actionTaken: 'Variable Message Signs set to "EMERGENCY VEHICLE PASSING - MOVE LEFT".'
                  });
                }}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1.5"
              >
                <Crosshair className="w-4 h-4" />
                <span>Track Police Interceptor</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Patrol Interceptor</p>
                <h4 className="text-xl font-bold font-mono text-blue-300 mt-1">POL-18</h4>
                <p className="text-xs text-slate-300 mt-1">Lead: Inspector Vikram Rathore • Speed: 82 km/h</p>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Active Police Operation</p>
                <h4 className="text-sm font-bold text-white mt-1">Corridor Clearance & Accident Triage</h4>
                <p className="text-xs text-cyan-300 mt-1">Clearing Eastern Bypass Toll Lane 2</p>
              </div>

              <div className="bg-slate-900/70 p-4 rounded-xl border border-slate-800">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Priority Transit ETA</p>
                <h4 className="text-xl font-bold font-mono text-emerald-400 mt-1">9 min ETA</h4>
                <p className="text-xs text-slate-400 mt-1">Normal: 18 min (Saved 9 mins via V2I)</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#0a1428] border border-slate-800 space-y-2 text-xs font-mono">
              <div className="flex justify-between"><span className="text-slate-400">POLNET Comms Link:</span><span className="text-emerald-400">ENCRYPTED TETRA + 5G SA</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Corridor Escort Wave:</span><span className="text-cyan-300">ACTIVE - 400m Pre-Warning Ahead of AMB-104</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Civilian Give-Way Warning:</span><span className="text-emerald-400">BROADCASTED (98% COMPLIANCE)</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
