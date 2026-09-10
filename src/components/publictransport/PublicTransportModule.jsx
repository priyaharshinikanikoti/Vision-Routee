import React, { useState } from 'react';
import { 
  Bus, Users, ShieldAlert, CheckCircle2, AlertOctagon, 
  MapPin, Clock, Radio, Volume2, ShieldCheck, BatteryCharging,
  Crosshair, Navigation, ArrowRight, Zap, RefreshCw
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import audio from '../../services/audioService';

export const CITY_BUSES = [
  { 
    id: 'BUS-102', 
    route: 'Route 714: Central Stn ⇄ Cyber City', 
    passengers: 54, 
    capacity: 60, 
    crowding: '90%', 
    crowdingStatus: 'HIGH (OVERCROWDED)', 
    eta: '5 min', 
    speed: 28, 
    battery: '82%', 
    nextStop: 'Medical College North Gate', 
    driver: 'Kishore N.',
    boardingsToday: 412,
    alightingsToday: 358,
    lat: '28.6130',
    lng: '77.2095',
    sensorType: 'Stereoscopic 3D ToF (Overhead)'
  },
  { 
    id: 'BUS-205', 
    route: 'Route 302: Ring Rd Express Circular', 
    passengers: 28, 
    capacity: 60, 
    crowding: '46%', 
    crowdingStatus: 'NORMAL', 
    eta: '12 min', 
    speed: 38, 
    battery: '68%', 
    nextStop: 'Sector 15 Metro Interchange', 
    driver: 'D. Sharma',
    boardingsToday: 290,
    alightingsToday: 262,
    lat: '28.6148',
    lng: '77.2078',
    sensorType: 'Stereoscopic 3D ToF (Overhead)'
  },
  { 
    id: 'BUS-310', 
    route: 'Route 108: Outer Freight & Tech Corridor', 
    passengers: 14, 
    capacity: 50, 
    crowding: '28%', 
    crowdingStatus: 'LOW', 
    eta: '18 min', 
    speed: 44, 
    battery: '91%', 
    nextStop: 'Electronic City Gate 2', 
    driver: 'A. Joseph',
    boardingsToday: 145,
    alightingsToday: 131,
    lat: '28.6162',
    lng: '77.2052',
    sensorType: 'Stereoscopic 3D ToF (Overhead)'
  }
];

export default function PublicTransportModule({ 
  onViewLiveLocation,
  onNavigate 
}) {
  const [buses, setBuses] = useState(CITY_BUSES);
  const [selectedBus, setSelectedBus] = useState(CITY_BUSES[0]);
  const [activeTab, setActiveTab] = useState('fleet'); // fleet | apc | school_bus

  // School Bus Safety Simulation State (SCH-09)
  const [schoolBusEngineOff, setSchoolBusEngineOff] = useState(true);
  const [childDetected, setChildDetected] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const handleToggleChildAlert = () => {
    const next = !childDetected;
    setChildDetected(next);
    if (next) {
      audio.playAlertBeep();
      setToastMessage('ALERT: 60GHz radar detected breathing occupant in parked bus SCH-09 with engine OFF!');
    } else {
      audio.playSuccessChime();
      setToastMessage('Cabin verified clear. Student safety protocol verified satisfied.');
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDispatchAuxiliaryBus = () => {
    audio.playSuccessChime();
    setToastMessage('Auxiliary relief bus BUS-404 dispatched to Route 714 to reduce peak overcrowding.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-[#0b1428] border border-purple-800/50 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-purple-950 border border-purple-700 rounded-xl text-purple-400">
              <Bus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  PUBLIC TRANSPORT & BUS SAFETY
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                  APC & TRANSIT CORE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Live Bus Tracking, 3D ToF Passenger Counting (APC), Overcrowding Alleviation & School Bus Monitoring
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">ACTIVE TRANSIT BUSES</span>
            <span className="text-purple-300 font-bold text-base">42 Transit Units</span>
          </div>
          <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">PEAK CROWD RATING</span>
            <span className="text-amber-400 font-bold text-base">64% Avg Load</span>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-purple-950 border border-purple-500 text-purple-200 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 bg-[#091122] p-2 rounded-xl border border-slate-800">
        {[
          { id: 'fleet', label: 'Live Transit Bus Tracking', icon: Bus },
          { id: 'apc', label: 'Passenger Counting (APC) & Crowding', icon: Users },
          { id: 'school_bus', label: 'School Bus Student Safety (SCH-09)', icon: AlertOctagon }
        ].map(tab => {
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
                  ? 'bg-purple-950 text-purple-200 border border-purple-500 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: FLEET TRACKING ================= */}
      {activeTab === 'fleet' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {buses.map((b) => {
              const isSelected = selectedBus.id === b.id;
              const isOvercrowded = parseInt(b.crowding) >= 85;

              return (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBus(b);
                    audio.playAlertBeep();
                  }}
                  className={`p-4 rounded-xl border cursor-pointer transition-all space-y-3 ${
                    isSelected ? 'bg-[#151233] border-purple-400 glow-purple' : 'bg-[#0d162d] border-slate-800 hover:border-purple-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-xs font-black text-purple-300">{b.id}</span>
                        <StatusBadge status={b.crowdingStatus} size="xs" />
                      </div>
                      <h4 className="text-xs font-bold text-white mt-1">{b.route}</h4>
                    </div>
                    <span className="text-sm font-mono font-bold text-cyan-300">ETA {b.eta}</span>
                  </div>

                  {/* Crowding bar */}
                  <div>
                    <div className="flex justify-between text-[10px] text-slate-400 mb-1 font-mono">
                      <span>Passengers: {b.passengers}/{b.capacity}</span>
                      <span className={isOvercrowded ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{b.crowding} Full</span>
                    </div>
                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${isOvercrowded ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                        style={{ width: `${(b.passengers / b.capacity) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Live Coordinates and Track Button */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400 truncate">{b.lat}° N, {b.lng}° E</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audio.playAlertBeep();
                        onViewLiveLocation?.({
                          id: b.id,
                          name: b.route,
                          title: `City Transit ${b.id}`,
                          location: b.nextStop,
                          lat: b.lat,
                          lng: b.lng,
                          speedKmh: b.speed,
                          heading: '45° NE',
                          accuracy: '±14 cm (Transit GPS)',
                          category: 'Public Transport',
                          driver: b.driver,
                          details: `Occupancy: ${b.passengers}/${b.capacity} (${b.crowding}). Sensor: ${b.sensorType}.`
                        });
                      }}
                      className="px-2 py-1 rounded bg-purple-950 hover:bg-purple-900 border border-purple-700 text-purple-200 text-[10px] font-bold flex items-center space-x-1"
                    >
                      <Crosshair className="w-3 h-3 text-purple-300" />
                      <span>Track</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Bus Telemetry Inspector */}
          {selectedBus && (
            <div className="bg-[#091122] border border-purple-900/60 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedBus.id} — Telemetry & APC Diagnostics</h3>
                  <p className="text-xs text-slate-400">{selectedBus.route} • Driver: {selectedBus.driver}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {parseInt(selectedBus.crowding) >= 85 && (
                    <button
                      onClick={handleDispatchAuxiliaryBus}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
                    >
                      Dispatch Relief Bus
                    </button>
                  )}
                  <button
                    onClick={() => {
                      audio.playAlertBeep();
                      onViewLiveLocation?.({
                        id: selectedBus.id,
                        name: selectedBus.route,
                        title: `City Transit ${selectedBus.id}`,
                        location: selectedBus.nextStop,
                        lat: selectedBus.lat,
                        lng: selectedBus.lng,
                        speedKmh: selectedBus.speed,
                        heading: '45° NE',
                        accuracy: '±14 cm (Transit GPS)',
                        category: 'Public Transport',
                        driver: selectedBus.driver,
                        details: `Occupancy: ${selectedBus.passengers}/${selectedBus.capacity} (${selectedBus.crowding}). Sensor: ${selectedBus.sensorType}.`
                      });
                    }}
                    className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1"
                  >
                    <Crosshair className="w-4 h-4" />
                    <span>Track Live GPS Location</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Current Velocity</span>
                  <span className="text-xl font-bold text-cyan-300 block mt-1">{selectedBus.speed} km/h</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">EV Battery / Fuel</span>
                  <span className="text-xl font-bold text-emerald-400 block mt-1">{selectedBus.battery}</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Next Stop</span>
                  <span className="text-xs font-bold text-white block mt-1 truncate">{selectedBus.nextStop}</span>
                </div>
                <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase block">Sensor Hardware</span>
                  <span className="text-[11px] font-bold text-purple-300 block mt-1 truncate">{selectedBus.sensorType}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 2: PASSENGER COUNTING (APC) ================= */}
      {activeTab === 'apc' && (
        <div className="bg-[#091122] border border-purple-900/60 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Automated Passenger Counting (APC) — 3D Time-of-Flight Sensors
              </h3>
              <p className="text-xs text-slate-400">Stereoscopic optical sensors mounted at bus doorways track boardings and alightings with 99.1% accuracy</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">EN 13816 Compliant</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Total Boardings Today</span>
              <span className="text-3xl font-black font-mono text-cyan-300 block mt-1">12,480</span>
              <p className="text-[10px] text-slate-400 mt-1">Across 42 active transit corridors</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Total Alightings Today</span>
              <span className="text-3xl font-black font-mono text-emerald-400 block mt-1">11,920</span>
              <p className="text-[10px] text-slate-400 mt-1">Net onboard delta: 560 passengers</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Overcrowded Bottlenecks</span>
              <span className="text-3xl font-black font-mono text-amber-400 block mt-1">02 Routes</span>
              <p className="text-[10px] text-slate-400 mt-1">Route 714 & Route 302 peak</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: SCHOOL BUS STUDENT SAFETY ================= */}
      {activeTab === 'school_bus' && (
        <div className={`p-5 sm:p-6 rounded-2xl border-2 shadow-2xl transition-all ${
          childDetected && schoolBusEngineOff 
            ? 'bg-gradient-to-r from-red-950 via-rose-950 to-red-950 border-red-500 glow-red' 
            : 'bg-[#0d162d] border-slate-800'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-xl ${
                childDetected && schoolBusEngineOff ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-800 text-slate-400'
              }`}>
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide">
                    SCHOOL BUS SAFETY RADAR — UNIT SCH-09
                  </h3>
                  <StatusBadge 
                    status={childDetected && schoolBusEngineOff ? 'CRITICAL SAFETY ALERT' : 'DEPOT ALL CLEAR'} 
                    size="xs" 
                  />
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Ashok Leyland Sunshine School Bus • Route: St. Xavier High School Morning Drop • Driver: Mahesh Sharma
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
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
                className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center space-x-1"
              >
                <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                <span>Track Bus GPS</span>
              </button>

              <button
                onClick={handleToggleChildAlert}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  childDetected 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg' 
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-lg'
                }`}
              >
                {childDetected ? 'Resolve & Clear Alert' : 'Simulate Child Left Behind'}
              </button>
            </div>
          </div>

          {/* Emergency Alert Banner */}
          {childDetected && schoolBusEngineOff ? (
            <div className="mt-4 p-4 rounded-xl bg-red-900/60 border border-red-500 text-red-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h4 className="text-sm font-black uppercase tracking-wider text-white flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
                  <span>CHILD PRESENCE DETECTED AFTER ENGINE OFF!</span>
                </h4>
                <p className="text-xs text-red-200">
                  60GHz mmWave Vital-Sign Radar detected breathing occupant at Seat 14. Engine ignition is OFF. Door locked.
                </p>
                <p className="text-[11px] font-mono text-amber-200">
                  Automated Actions: Emergency hazard lights flashing • Exterior horn pulsing • SMS beacon dispatched to Driver (+91 9820XXXX11) & School Dispatch.
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0">
                <span className="px-2 py-1 rounded bg-black/50 text-[10px] font-mono text-red-300 border border-red-700">
                  HORN ACTIVE
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-200 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Cabin scan 100% verified. Zero occupants detected in school bus after route completion. Safe for depot lockdown.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
