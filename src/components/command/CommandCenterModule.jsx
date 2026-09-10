import React, { useState } from 'react';
import { 
  Radio, ShieldAlert, AlertTriangle, Cpu, Activity, Video, 
  Send, CheckCircle2, Siren, Flame, Shield, Check, RefreshCw, Zap,
  Truck, Bus, Building2, Crosshair, MapPin, Layers, ExternalLink
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import audio from '../../services/audioService';

export const COMMAND_INCIDENTS = [
  {
    id: 'INC-101',
    type: 'POTHOLE DETECTED',
    category: 'Road Hazard',
    severity: 'HIGH',
    location: 'NH-48 Outer Ring Road (Km 14/2)',
    timestamp: '8 mins ago',
    lat: '28.6152',
    lng: '77.2075',
    rules: [
      { step: 'Update Live Transportation Map', done: true },
      { step: 'Broadcast V2X Hazard Warning to nearby vehicles', done: true },
      { step: 'Notify Municipal Traffic Authority (PWD Ticket #8812)', done: true },
      { step: 'Recalculate Emergency Routes if affected', done: true }
    ],
    status: 'ACTIVE RESPONSE'
  },
  {
    id: 'INC-102',
    type: 'ACCIDENT DETECTED',
    category: 'Crash Impact',
    severity: 'CRITICAL',
    location: 'Eastern Bypass Toll Approach Lane 2',
    timestamp: '4 mins ago',
    lat: '28.6165',
    lng: '77.2062',
    rules: [
      { step: 'Notify Central Command Dispatch & Highway Patrol', done: true },
      { step: 'Notify Police Patrol Interceptor POL-18', done: true },
      { step: 'Recommend and Dispatch Ambulance AMB-108', done: true },
      { step: 'Warn incoming traffic via Variable Message Signs', done: true },
      { step: 'Recalculate Arterial Traffic Inflow & Bypass', done: true }
    ],
    status: 'ACTIVE RESPONSE'
  },
  {
    id: 'INC-103',
    type: 'FLOOD DETECTED',
    category: 'Environmental',
    severity: 'CRITICAL',
    location: 'Civil Lines Subway Underpass (52 cm)',
    timestamp: '18 mins ago',
    lat: '28.6180',
    lng: '77.2050',
    rules: [
      { step: 'Mark Road as Unsafe (>50 cm threshold)', done: true },
      { step: 'Lower automatic subway barriers & Close route', done: true },
      { step: 'Alert public navigation & GPS networks', done: true },
      { step: 'Recommend alternative Flyover Divergent Route B', done: true }
    ],
    status: 'ROAD CLOSED'
  },
  {
    id: 'INC-104',
    type: 'CARGO TAMPERING ALERT',
    category: 'Logistics Breach',
    severity: 'CRITICAL',
    location: 'Container ISO-9941 (Truck TRUCK-204)',
    timestamp: 'Just now',
    lat: '28.6160',
    lng: '77.2060',
    rules: [
      { step: 'Alert Logistics Operator & Fleet Manager', done: true },
      { step: 'Lock GPS coordinates & stream live telemetry', done: true },
      { step: 'Mark incident as Critical Anti-Theft Priority', done: true },
      { step: 'Dispatch nearest Police Patrol unit to intercept', done: true }
    ],
    status: 'POLICE DISPATCHED'
  },
  {
    id: 'INC-105',
    type: 'GAS LEAKAGE DETECTED',
    category: 'Hazardous Hazmat',
    severity: 'CRITICAL',
    location: 'Tanker TRUCK-312 (LPG Pressure Valves)',
    timestamp: '2 mins ago',
    lat: '28.6175',
    lng: '77.2040',
    rules: [
      { step: 'Trigger High-Priority Multi-Agency Alert', done: true },
      { step: 'Alert Fire & Rescue Tender FIRE-22', done: true },
      { step: 'Alert Police Traffic Division for 500m Cordon', done: true },
      { step: 'Warn nearby civilian vehicles to turn off engines', done: true },
      { step: 'Recalculate Hazmat Safe Dispersal Corridor', done: true }
    ],
    status: 'HAZMAT CORDON'
  }
];

export default function CommandCenterModule({ 
  emergencies = [],
  signals = [],
  hazards = [],
  fleet = [],
  iotDevices = [],
  customAlerts = [],
  onViewLiveLocation,
  onNavigate 
}) {
  const [incidents, setIncidents] = useState(COMMAND_INCIDENTS);
  const [selectedIncident, setSelectedIncident] = useState(COMMAND_INCIDENTS[0]);
  const [activeTab, setActiveTab] = useState('incidents'); // incidents | emergencies | traffic | fleet_buses | cross_module
  const [toastMessage, setToastMessage] = useState(null);

  const handleExecuteRule = (incId) => {
    audio.playSuccessChime();
    setToastMessage(`Automated multi-agency response protocols re-verified for ${incId}.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0b1428] border border-cyan-800/50 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-cyan-950 border border-cyan-700 rounded-xl text-cyan-400">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  CENTRAL COMMAND & CONTROL CENTER
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  BRAIN OF THE CITY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Multi-Agency Command: Emergencies, Incidents, Traffic Signals, Fleet, Buses, Hospitals & Cross-Module Rules
              </p>
            </div>
          </div>
        </div>

        {/* Agency Coordination Status Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-rose-950/80 border border-rose-700 text-rose-300 flex items-center space-x-1">
            <Siren className="w-3 h-3" />
            <span>AMBULANCE: LINKED</span>
          </span>
          <span className="px-2.5 py-1 rounded bg-orange-950/80 border border-orange-700 text-orange-300 flex items-center space-x-1">
            <Flame className="w-3 h-3" />
            <span>FIRE: LINKED</span>
          </span>
          <span className="px-2.5 py-1 rounded bg-blue-950/80 border border-blue-700 text-blue-300 flex items-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>POLICE: LINKED</span>
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300 flex items-center space-x-1">
            <Activity className="w-3 h-3" />
            <span>PWD / NHAI: LINKED</span>
          </span>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-cyan-950 border border-cyan-500 text-cyan-200 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-Tabs for all user-requested views */}
      <div className="flex flex-wrap items-center gap-2 bg-[#091122] p-2 rounded-xl border border-slate-800">
        {[
          { id: 'incidents', label: 'Incident Triage & Response Rules', icon: Radio },
          { id: 'emergencies', label: 'Active Emergencies (Ambulance/Fire/Police)', icon: Siren },
          { id: 'traffic', label: 'Traffic Signals & V2X Network', icon: Zap },
          { id: 'fleet_buses', label: 'Fleet & Public Buses', icon: Truck },
          { id: 'cross_module', label: 'Cross-Module Event Stream', icon: Layers }
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
                  ? 'bg-cyan-950 text-cyan-200 border border-cyan-500 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: INCIDENT TRIAGE & RULES ================= */}
      {activeTab === 'incidents' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Incident Queue */}
          <div className="lg:col-span-2 bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Real-Time Incident Triage Queue ({incidents.length} Active)
              </h3>
              <span className="text-xs font-mono text-emerald-400">Autonomous Rule Engine Active</span>
            </div>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {incidents.map((inc) => {
                const isSelected = selectedIncident.id === inc.id;
                return (
                  <div
                    key={inc.id}
                    onClick={() => {
                      setSelectedIncident(inc);
                      audio.playAlertBeep();
                    }}
                    className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                      isSelected ? 'bg-[#0f1f3d] border-cyan-400 glow-cyan' : 'bg-[#0c162b] border-slate-800 hover:border-cyan-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-cyan-300">{inc.id}</span>
                          <StatusBadge status={inc.status} size="xs" />
                          <span className="text-[10px] font-mono text-rose-400 bg-rose-950 px-1.5 py-0.5 rounded border border-rose-900">
                            {inc.severity}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1.5">{inc.type}</h4>
                        <p className="text-[11px] text-slate-400">{inc.location}</p>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500">{inc.timestamp}</span>
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-slate-300">
                      <span className="text-emerald-400">✓ {inc.rules.length} Rule-Based Actions Executed</span>
                      <span className="text-slate-400">{inc.lat}° N, {inc.lng}° E</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Incident Rule Execution Engine */}
          <div className="bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Automated Response Protocol
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                  {selectedIncident.id}
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Incident Type</span>
                  <h4 className="text-sm font-bold text-white mt-0.5">{selectedIncident.type}</h4>
                  <p className="text-xs text-slate-400">{selectedIncident.location}</p>
                </div>

                {/* Live Location Pill */}
                <div className="p-3 bg-[#0a1428] rounded-xl border border-cyan-900/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Incident Coordinates</span>
                      <span className="text-xs font-mono text-cyan-200">
                        {selectedIncident.lat}° N, {selectedIncident.lng}° E
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      audio.playAlertBeep();
                      onViewLiveLocation?.({
                        id: selectedIncident.id,
                        name: selectedIncident.type,
                        title: `${selectedIncident.type} (${selectedIncident.id})`,
                        location: selectedIncident.location,
                        lat: selectedIncident.lat,
                        lng: selectedIncident.lng,
                        speedKmh: 0,
                        heading: '0° N',
                        accuracy: '±5 cm (Incident Triaged)',
                        category: 'Command Incident',
                        details: `Severity: ${selectedIncident.severity}. Status: ${selectedIncident.status}.`
                      });
                    }}
                    className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold text-[11px] rounded-lg transition-colors flex items-center space-x-1"
                  >
                    <Crosshair className="w-3 h-3" />
                    <span>Track Live</span>
                  </button>
                </div>

                {/* Rules Checklist */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    Automated Actions Executed:
                  </span>
                  {selectedIncident.rules.map((r, idx) => (
                    <div key={idx} className="p-2.5 bg-[#0c162b] rounded-lg border border-slate-800 text-xs flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-200">{r.step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => handleExecuteRule(selectedIncident.id)}
                className="w-full py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center space-x-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Execute Multi-Agency Incident Workflow</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ACTIVE EMERGENCIES ================= */}
      {activeTab === 'emergencies' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { id: 'AMB-104', type: 'Cardiac Golden-Hour Transfer', unit: 'ALS Ambulance', speed: '68 km/h', eta: '11 min', saved: '13 min saved', lat: '28.6139', lng: '77.2090' },
            { id: 'FIRE-22', type: 'Industrial Warehouse Blaze', unit: '10,000L Foam Tender', speed: '54 km/h', eta: '16 min', saved: '16 min saved', lat: '28.6172', lng: '77.2045' },
            { id: 'POL-18', type: 'Highway Multi-Vehicle Pileup', unit: 'High-Speed Patrol', speed: '82 km/h', eta: '9 min', saved: '9 min saved', lat: '28.6165', lng: '77.2062' }
          ].map(emg => (
            <div key={emg.id} className="p-4 bg-[#091122] rounded-2xl border border-rose-900/60 shadow-xl space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-black text-rose-400">{emg.id}</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-800 font-bold">
                  {emg.saved}
                </span>
              </div>
              <h4 className="text-sm font-bold text-white">{emg.type}</h4>
              <p className="text-slate-400">{emg.unit} • {emg.speed} • ETA {emg.eta}</p>

              <button
                onClick={() => {
                  audio.playAlertBeep();
                  onViewLiveLocation?.({
                    id: emg.id,
                    name: emg.unit,
                    title: `${emg.id}: ${emg.type}`,
                    location: 'Priority Transportation Corridor',
                    lat: emg.lat,
                    lng: emg.lng,
                    speedKmh: parseInt(emg.speed) || 60,
                    heading: '42° NE',
                    accuracy: '±12 cm (RTK Locked)',
                    category: 'Emergency Vehicle'
                  });
                }}
                className="w-full py-2 bg-rose-950 hover:bg-rose-900 border border-rose-700 text-rose-200 text-xs font-bold rounded-xl flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Crosshair className="w-3.5 h-3.5 text-rose-400" />
                <span>Track Live Location</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 3: TRAFFIC & SIGNALS ================= */}
      {activeTab === 'traffic' && (
        <div className="bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Central Signal Controllers & V2I Infrastructure Status
            </h3>
            <span className="text-xs font-mono text-emerald-400">96% System Online (24 of 25)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
            {signals.slice(0, 4).map(sig => (
              <div key={sig.id} className="p-3 bg-[#0c162b] rounded-xl border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-cyan-300 font-bold">{sig.id}</span>
                  <span className={`font-bold ${sig.state === 'GREEN' ? 'text-emerald-400' : sig.state === 'YELLOW' ? 'text-yellow-400' : 'text-rose-400'}`}>
                    {sig.state}
                  </span>
                </div>
                <p className="text-white font-sans text-xs truncate" title={sig.name}>{sig.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{sig.priorityStatus || sig.cycleMode}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: FLEET & BUSES ================= */}
      {activeTab === 'fleet_buses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#091122] border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase">Freight & Logistics Units (3 Active)</h4>
            {fleet.map(t => (
              <div key={t.id} className="p-3 bg-[#0c162b] rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold font-mono text-blue-300">{t.id}</span>
                  <p className="text-slate-300">{t.cargoType}</p>
                </div>
                <span className="font-mono text-cyan-300">{t.speedKmh} km/h</span>
              </div>
            ))}
          </div>

          <div className="bg-[#091122] border border-slate-800 rounded-2xl p-5 space-y-3 text-xs">
            <h4 className="font-bold text-white uppercase">Public Transit & School Buses</h4>
            {[
              { id: 'BUS-102', route: 'Route 714: Central Stn ⇄ Cyber City', load: '90% Full (APC)' },
              { id: 'BUS-205', route: 'Route 302: Ring Rd Express', load: '46% Normal' },
              { id: 'SCH-09', route: 'School Bus Morning Drop', load: '60GHz Radar Active' }
            ].map(b => (
              <div key={b.id} className="p-3 bg-[#0c162b] rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="font-bold font-mono text-purple-300">{b.id}</span>
                  <p className="text-slate-300">{b.route}</p>
                </div>
                <span className="font-mono text-amber-300">{b.load}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 5: CROSS-MODULE EVENT STREAM ================= */}
      {activeTab === 'cross_module' && (
        <div className="bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Real-Time Cross-Module Event Pipeline
              </h3>
              <p className="text-xs text-slate-400">Continuous inter-module messaging: Road Health → Traffic Signals → Command → Analytics</p>
            </div>
            <span className="text-xs font-mono text-cyan-400">Zero-Loss Stream</span>
          </div>

          <div className="space-y-2.5">
            {[
              { time: 'Just now', module: 'ROAD INTELLIGENCE → COMMAND', desc: 'Pothole HAZ-301 detected at Km 14/2. Live Map updated. V2X warning sent to 12 nearby vehicles.' },
              { time: '1 min ago', module: 'EMERGENCY → SIGNALS', desc: 'Ambulance AMB-104 priority route calculated. Signals SIG-101 to SIG-104 preempted GREEN.' },
              { time: '3 mins ago', module: 'CARGO → POLICE', desc: 'BLE Container Seal on TRUCK-204 verified secure. Telemetry packet logged.' },
              { time: '5 mins ago', module: 'PUBLIC TRANSPORT → FLEET', desc: 'Route 714 occupancy 90%. Relief feeder bus BUS-404 dispatched.' }
            ].map((evt, i) => (
              <div key={i} className="p-3 bg-[#0c162b] rounded-xl border border-slate-800 flex items-start justify-between gap-4 text-xs font-mono">
                <div className="space-y-0.5">
                  <span className="text-cyan-300 font-bold block">{evt.module}</span>
                  <p className="text-slate-300 font-sans">{evt.desc}</p>
                </div>
                <span className="text-slate-500 shrink-0 text-[10px]">{evt.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
