import React, { useState } from 'react';
import { 
  ShieldCheck, AlertTriangle, Eye, Users, AlertOctagon, 
  Volume2, VolumeX, CheckCircle2, Clock, MapPin, Radio, 
  Activity, ShieldAlert, Sparkles, Navigation
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import MiniRouteMap from '../common/MiniRouteMap';
import audio from '../../services/audioService';

export default function VehicleSafetyModule({ 
  onTriggerSafetyAlert,
  onViewLiveLocation,
  onNavigate 
}) {
  // Blind-spot state
  const [activeZone, setActiveZone] = useState('RIGHT'); // 'NONE' | 'LEFT' | 'RIGHT' | 'REAR'
  const [detectedEntity, setDetectedEntity] = useState('Two-Wheeler Motorcycle (2.1m)');

  // Driver fatigue DMS state
  const [drivingHours, setDrivingHours] = useState('3h 12m');
  const [drowsinessState, setDrowsinessState] = useState('MODERATE FATIGUE');
  const [eyeClosureDurationMs, setEyeClosureDurationMs] = useState(420);
  const [yawnCount, setYawnCount] = useState(7);

  // School bus safety state (SCH-09)
  const [engineState, setEngineState] = useState('OFF');
  const [childPresence, setChildPresence] = useState(true);
  const [hazardAlarmActive, setHazardAlarmActive] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const handleToggleZone = (zone, entity = 'Vehicle') => {
    setActiveZone(zone);
    setDetectedEntity(entity);
    if (zone !== 'NONE') {
      audio.playBlindSpotWarning();
    }
  };

  const handleToggleChildPresence = () => {
    const next = !childPresence;
    setChildPresence(next);
    setHazardAlarmActive(next);
    if (next) {
      audio.playAlertBeep();
      setToastMessage('EMERGENCY ALERT: Child presence detected in parked school bus after engine shutdown!');
      onTriggerSafetyAlert?.({
        type: 'CHILD PRESENCE IN PARKED BUS',
        vehicle: 'SCH-09',
        desc: '60GHz mmWave cabin radar detected breathing occupant at Seat 14 with engine OFF.'
      });
    } else {
      audio.playSuccessChime();
      setToastMessage('Cabin verified clear. Student safety protocol satisfied.');
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
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  VEHICLE SAFETY & OPERATOR SURROUNDINGS
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  SIH26222 ACTIVE CORE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                77GHz mmWave Blind-Spot Radar, DMS Infrared Eye-Tracking & School Bus Child Presence Radar
              </p>
            </div>
          </div>
        </div>

        {/* Quick Safety Health Badge */}
        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">RADAR BEACONS</span>
            <span className="text-cyan-300 font-bold text-base">77GHz Active</span>
          </div>
          <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">SAFETY ALERTS</span>
            <span className={childPresence ? 'text-rose-400 font-bold text-base animate-pulse' : 'text-emerald-400 font-bold text-base'}>
              {childPresence ? '01 CRITICAL' : '0 ACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-rose-950 border border-rose-500 text-rose-200 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
          <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Embedded Safety Transit Route Map */}
      <MiniRouteMap
        title="Active Heavy Vehicle Safety Monitoring Corridor"
        subtitle="Tracking School Bus SCH-09 (Morning Route) & Heavy Hauler TRUCK-204"
        startLabel="St. Xavier High School Depot"
        endLabel="Outer Express Route Bypass"
        pathCoordinates={[
          { x: 80, y: 140 },
          { x: 260, y: 110 },
          { x: 440, y: 130 },
          { x: 620, y: 95 },
          { x: 740, y: 120 }
        ]}
        vehicle={{ id: 'SCH-09', speed: '0', x: 260, y: 110 }}
        hazards={[{ id: 'H1', x: 440, y: 130 }]}
        actionButtonText="Test mmWave Radar Scan"
        onActionClick={() => handleToggleChildPresence()}
        height="h-64"
      />

      {/* 3 Core Pillars: Blind Spot, Driver Fatigue, School Bus Safety */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* PILLAR 1: BLIND-SPOT MONITORING */}
        <div className="bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">77GHz Blind-Spot Radar</h3>
            </div>
            <StatusBadge status={activeZone !== 'NONE' ? 'HAZARD DETECTED' : 'CLEAR'} size="xs" />
          </div>

          {/* Interactive Heavy Vehicle Surroundings Radar Visualizer */}
          <div className="relative h-44 bg-[#050b14] rounded-xl border border-slate-800 flex items-center justify-center p-4">
            {/* Center Heavy Hauler */}
            <div className="w-14 h-24 bg-blue-700 rounded-lg border-2 border-blue-400 flex flex-col items-center justify-center text-white shadow-xl z-10">
              <span className="text-[10px] font-black font-mono">TRUCK</span>
              <span className="text-[8px] font-mono text-blue-200">2823R</span>
            </div>

            {/* Left Blind Spot */}
            <div 
              onClick={() => handleToggleZone(activeZone === 'LEFT' ? 'NONE' : 'LEFT', 'Pedestrian at Shoulder (1.8m)')}
              className={`absolute left-6 top-8 bottom-8 w-20 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                activeZone === 'LEFT' 
                  ? 'bg-rose-600/50 border-red-400 animate-pulse shadow-lg shadow-red-950' 
                  : 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <span className="text-[10px] font-bold font-mono text-white">LEFT</span>
              <span className="text-[8px] text-slate-300">BLIND SPOT</span>
            </div>

            {/* Right Blind Spot */}
            <div 
              onClick={() => handleToggleZone(activeZone === 'RIGHT' ? 'NONE' : 'RIGHT', 'Motorcycle in Blind Flank (2.1m)')}
              className={`absolute right-6 top-8 bottom-8 w-20 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all ${
                activeZone === 'RIGHT' 
                  ? 'bg-rose-600/50 border-red-400 animate-pulse shadow-lg shadow-red-950' 
                  : 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <span className="text-[10px] font-bold font-mono text-white">RIGHT</span>
              <span className="text-[8px] text-slate-300">BLIND SPOT</span>
            </div>

            {/* Rear Zone */}
            <div 
              onClick={() => handleToggleZone(activeZone === 'REAR' ? 'NONE' : 'REAR', 'Small Hatchback Tailgating (3.2m)')}
              className={`absolute bottom-1 w-32 h-7 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                activeZone === 'REAR' 
                  ? 'bg-rose-600/50 border-red-400 animate-pulse shadow-lg shadow-red-950' 
                  : 'bg-slate-800/30 border-slate-700 hover:bg-slate-800/60'
              }`}
            >
              <span className="text-[9px] font-bold font-mono text-white">REAR PROXIMITY ZONE</span>
            </div>
          </div>

          <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Target Proximity:</span>
              <span className="font-bold text-rose-400">{detectedEntity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Audio Alarm:</span>
              <span className={activeZone !== 'NONE' ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                {activeZone !== 'NONE' ? 'BEEPING (1200 Hz)' : 'Standby'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => handleToggleZone('LEFT', 'Pedestrian at Shoulder (1.8m)')}
              className="py-1.5 px-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold text-center"
            >
              Test Left
            </button>
            <button
              onClick={() => handleToggleZone('RIGHT', 'Two-Wheeler (2.1m)')}
              className="py-1.5 px-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold text-center"
            >
              Test Right
            </button>
            <button
              onClick={() => handleToggleZone('NONE', 'No Proximity Hazards')}
              className="py-1.5 px-1 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-[11px] font-semibold text-center border border-cyan-800"
            >
              Clear Zone
            </button>
          </div>
        </div>

        {/* PILLAR 2: DRIVER FATIGUE & DROWSINESS DMS */}
        <div className="bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Driver DMS Eye-Tracking</h3>
            </div>
            <StatusBadge status={drowsinessState} size="xs" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 font-mono space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Driver Name:</span>
                <span className="text-white font-bold">Harpreet Singh (TRUCK-204)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Driving Time:</span>
                <span className="text-amber-400 font-bold">{drivingHours}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Eye Closure Duration:</span>
                <span className="text-rose-400 font-bold">{eyeClosureDurationMs} ms (PERCLOS: 28%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Yawn Frequency:</span>
                <span className="text-amber-300 font-bold">{yawnCount} per hour</span>
              </div>
            </div>

            <div className="p-3 bg-amber-950/60 border border-amber-800 rounded-xl space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                MANDATORY BREAK RECOMMENDATION
              </span>
              <p className="text-xs text-slate-200">
                Driver exceeds safe fatigue threshold. Nearest designated freight rest area: <strong className="text-white">NHAI Highway Oasis 12 km Ahead</strong>.
              </p>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => {
                  setDrowsinessState(drowsinessState === 'ALERT' ? 'MODERATE FATIGUE' : 'ALERT');
                  setEyeClosureDurationMs(drowsinessState === 'ALERT' ? 420 : 110);
                  audio.playAlertBeep();
                }}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg transition-colors"
              >
                Toggle Fatigue Simulation (Alert vs Drowsy)
              </button>
            </div>
          </div>
        </div>

        {/* PILLAR 3: SCHOOL BUS CHILD SAFETY (SCH-09) */}
        <div className={`rounded-2xl border-2 p-5 shadow-xl space-y-4 transition-all ${
          childPresence 
            ? 'bg-gradient-to-br from-red-950/90 via-[#180e1e] to-[#0d162d] border-red-500 glow-red' 
            : 'bg-[#091122] border-cyan-900/60'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <AlertOctagon className="w-4 h-4 text-red-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">School Bus Safety (SCH-09)</h3>
            </div>
            <StatusBadge status={childPresence ? 'CRITICAL ALERT' : 'ALL CLEAR'} size="xs" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#0a1428] rounded-xl border border-cyan-900/60">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-mono text-cyan-200">28.6120° N, 77.2105° E</span>
              </div>
              <button
                onClick={() => {
                  audio.playAlertBeep();
                  onViewLiveLocation?.({
                    id: 'SCH-09',
                    name: 'School Bus Safety Unit SCH-09',
                    title: 'Ashok Leyland School Bus #09',
                    location: 'St. Xavier School Campus Depot',
                    lat: '28.6120',
                    lng: '77.2105',
                    speedKmh: 0,
                    heading: '90° E',
                    accuracy: '±10 cm (Depot RTK)',
                    category: 'Vehicle Safety',
                    details: '60GHz vital-sign radar active. Engine ignition is OFF. Door locked.',
                    actionTaken: 'Child presence detection protocol armed with external horn beacon.'
                  });
                }}
                className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold text-[10px] rounded-lg transition-colors flex items-center space-x-1"
              >
                <Navigation className="w-3 h-3 text-cyan-400" />
                <span>Track Live Location</span>
              </button>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Unit ID:</span>
                <span className="text-white font-bold">SCH-09 (Ashok Leyland)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Engine Ignition:</span>
                <span className="text-rose-400 font-bold">{engineState}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Doors & Interlock:</span>
                <span className="text-slate-200">LOCKED & SEALED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">60GHz mmWave Radar:</span>
                <span className={childPresence ? 'text-rose-400 font-bold animate-pulse' : 'text-emerald-400'}>
                  {childPresence ? 'CHILD DETECTED (SEAT 14)' : 'EMPTY CABIN'}
                </span>
              </div>
            </div>

            {childPresence ? (
              <div className="p-3 bg-red-900/60 border border-red-500 rounded-xl space-y-1.5 text-red-100">
                <div className="flex items-center space-x-1.5 text-white font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  <span>CHILD PRESENCE DETECTED AFTER ENGINE OFF</span>
                </div>
                <p className="text-[11px] text-red-200">
                  Vital-sign radar detected shallow breathing in rear row. Exterior buzzer active. Automated SMS dispatched to driver (+91 9820XXXX11) & School Principal.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero children remaining. School bus successfully cleared for depot parking.</span>
              </div>
            )}

            <button
              onClick={handleToggleChildPresence}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                childPresence 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950' 
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950'
              }`}
            >
              {childPresence ? 'Verify Child Evacuated & Clear Hazard' : 'Simulate Child Left Behind in Bus'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
