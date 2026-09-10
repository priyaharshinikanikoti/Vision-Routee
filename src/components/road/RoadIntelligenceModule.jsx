import React, { useState } from 'react';
import { 
  AlertTriangle, Waves, Train, ShieldCheck, CheckCircle2, 
  MapPin, Clock, ArrowRight, Radio, RefreshCw, Send, Check,
  Crosshair, ShieldAlert, Wrench, Siren, FileText, Sliders, Activity
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import audio from '../../services/audioService';

export const INITIAL_ROAD_INTELLIGENCE_HAZARDS = [
  {
    id: 'HAZ-301',
    category: 'Pothole',
    severity: 'HIGH',
    location: 'NH-48 Outer Ring Road (Km 14/2)',
    distanceFromAmbulanceMeters: 800,
    detectedTime: '12 mins ago',
    source: 'Transit Bus #102 Accelerometer & CV Camera (2.1g spike)',
    status: 'ACTIVE',
    details: 'Severe crater 14cm deep, 80cm diameter in middle lane. Causes rim damage and abrupt braking.',
    actionTaken: 'Warning broadcasted to nearby vehicles; PWD Repair Ticket #PWD-8812 logged.',
    lat: '28.6152',
    lng: '77.2075',
    iriScore: '5.2 (Poor)',
    coordinates: { x: 42, y: 44 }
  },
  {
    id: 'HAZ-302',
    category: 'Flooded Road',
    severity: 'CRITICAL',
    location: 'Civil Lines Subway Underpass',
    distanceFromAmbulanceMeters: 2400,
    detectedTime: '24 mins ago',
    source: 'Ultrasonic Water Level Gauge WL-309',
    waterLevelCm: 52,
    status: 'ROAD CLOSED',
    details: 'Water level reached 52 cm (above 50 cm threshold). Submerged drainage pump failure.',
    actionTaken: 'Subway barrier automatically lowered; automated route diversion triggered.',
    lat: '28.6180',
    lng: '77.2050',
    iriScore: 'Submerged',
    coordinates: { x: 55, y: 68 }
  },
  {
    id: 'HAZ-303',
    category: 'Accident Crash',
    severity: 'CRITICAL',
    location: 'Eastern Bypass Toll Approach Lane 2',
    distanceFromAmbulanceMeters: 1600,
    detectedTime: '4 mins ago',
    source: 'Acoustic Shock Sensor AC-112 (62 dB impact spike)',
    status: 'ACTIVE TRIAGE',
    details: 'Two-car side impact collision blocking right lane. Immediate EMS and police intercept needed.',
    actionTaken: 'Ambulance AMB-108 & Police POL-18 dispatched. Incoming traffic warned via VMS.',
    lat: '28.6165',
    lng: '77.2062',
    iriScore: 'Debris on Road',
    coordinates: { x: 62, y: 38 }
  },
  {
    id: 'HAZ-304',
    category: 'Road Blockage',
    severity: 'HIGH',
    location: 'Airport Expressway Feeder Ramp',
    distanceFromAmbulanceMeters: 3100,
    detectedTime: '15 mins ago',
    source: 'RSU-902 V2X Automated Video Incident Detection',
    status: 'ACTIVE',
    details: 'Stalled container truck blocking left two lanes. Traffic bottleneck extending 400m.',
    actionTaken: 'Heavy recovery crane dispatched. Upstream signals set to meter inflow.',
    lat: '28.6128',
    lng: '77.2100',
    iriScore: 'Obstructed',
    coordinates: { x: 30, y: 58 }
  },
  {
    id: 'HAZ-305',
    category: 'Railway Crossing',
    severity: 'HIGH',
    location: 'Level Crossing LC-14 (Km 18/4)',
    distanceFromAmbulanceMeters: 1900,
    detectedTime: 'Just now',
    source: 'Railway Crossing Track Proximity Radar RC-101',
    trainDistanceKm: 1.2,
    status: 'GATES CLOSED',
    details: 'Express freight train approaching at 75 km/h. Boom barriers interlocked shut.',
    actionTaken: 'Ambulances and buses automatically rerouted via Railway Overbridge Flyover.',
    lat: '28.6105',
    lng: '77.2120',
    iriScore: 'Nominal',
    coordinates: { x: 68, y: 55 }
  },
  {
    id: 'HAZ-306',
    category: 'Damaged Road Sign',
    severity: 'MEDIUM',
    location: 'Sector 15 Flyover Divergence Portal',
    distanceFromAmbulanceMeters: 1100,
    detectedTime: '35 mins ago',
    source: 'Municipal CV Survey Van Dashcam',
    status: 'WORK ORDER ISSUED',
    details: 'Speed limit (60 km/h) & Hospital Directional Sign bent 45 degrees by storm winds.',
    actionTaken: 'PWD Signage Replacement Team Work Order #SGN-204 dispatched.',
    lat: '28.6140',
    lng: '77.2088',
    iriScore: 'Sign Damaged',
    coordinates: { x: 48, y: 50 }
  },
  {
    id: 'HAZ-307',
    category: 'Broken Signal',
    severity: 'HIGH',
    location: 'Gandhi Chowk Crossroad',
    distanceFromAmbulanceMeters: 1400,
    detectedTime: '42 mins ago',
    source: 'Signal Health Optical Sensor SC-509',
    status: 'TRAFFIC POLICE DISPATCHED',
    details: 'Northbound traffic light head power supply fault. Flashing amber fallback mode engaged.',
    actionTaken: 'Traffic police officer deployed for manual direction. Technician team en route.',
    lat: '28.6135',
    lng: '77.2092',
    iriScore: 'Controller Fault',
    coordinates: { x: 52, y: 44 }
  }
];

export default function RoadIntelligenceModule({ 
  hazards = INITIAL_ROAD_INTELLIGENCE_HAZARDS, 
  onUpdateHazards,
  onViewLiveLocation,
  onNavigate
}) {
  const [hazardsList, setHazardsList] = useState(
    hazards && hazards.length >= 7 ? hazards : INITIAL_ROAD_INTELLIGENCE_HAZARDS
  );
  const [selectedHazard, setSelectedHazard] = useState(hazardsList[0]);
  const [activeTab, setActiveTab] = useState('all'); // all | pothole | flood | accident | blockage | railway | signs | signals | condition
  const [waterLevelCm, setWaterLevelCm] = useState(52);
  const [trainDistanceKm, setTrainDistanceKm] = useState(1.2);
  const [toastMessage, setToastMessage] = useState(null);

  // Dynamic flood status based on water level slider
  const floodStatus = waterLevelCm >= 50 
    ? { text: 'ROAD CLOSED', color: 'text-rose-400', bg: 'bg-rose-950/80 border-rose-600', level: 'CRITICAL' }
    : waterLevelCm >= 25 
      ? { text: 'CAUTION (High Water)', color: 'text-amber-400', bg: 'bg-amber-950/80 border-amber-600', level: 'CAUTION' }
      : { text: 'SAFE (Normal Flow)', color: 'text-emerald-400', bg: 'bg-emerald-950/80 border-emerald-600', level: 'SAFE' };

  // Dynamic train status based on distance
  const railwayStatus = trainDistanceKm <= 2.0 
    ? { state: 'CLOSED', color: 'text-rose-400', alert: 'Train Approaching (Gates Locked)' }
    : { state: 'OPEN', color: 'text-emerald-400', alert: 'Track Clear for Highway Traffic' };

  const handleSimulatePothole = () => {
    audio.playAlertBeep();
    const newPothole = {
      id: `HAZ-${Math.floor(400 + Math.random() * 500)}`,
      category: 'Pothole',
      severity: 'HIGH',
      location: 'Outer Ring Road Expressway (Km 16/4)',
      distanceFromAmbulanceMeters: 650,
      detectedTime: 'Just now',
      source: 'Fleet Bus #102 Bosch IMU Accelerometer Spike (2.4g)',
      status: 'ACTIVE',
      details: 'Severe crater detected by vehicle IMU telemetry. Transmitted via 4G MQTT.',
      actionTaken: 'Driver warned via HUD. PWD road maintenance ticket logged.',
      lat: '28.6158',
      lng: '77.2068',
      iriScore: '5.8 (Severe)',
      coordinates: { x: 44, y: 46 }
    };
    const updated = [newPothole, ...hazardsList];
    setHazardsList(updated);
    setSelectedHazard(newPothole);
    onUpdateHazards?.(updated);
    setToastMessage('NEW POTHOLE DETECTED! Accelerometer 2.4g spike logged. PWD ticket dispatched.');
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleResolveHazard = (id) => {
    audio.playSuccessChime();
    const updated = hazardsList.map(h => h.id === id ? { 
      ...h, 
      status: 'RESOLVED', 
      actionTaken: 'Inspected and repaired by Municipal PWD Maintenance Squad.' 
    } : h);
    setHazardsList(updated);
    setSelectedHazard(prev => prev && prev.id === id ? { 
      ...prev, 
      status: 'RESOLVED', 
      actionTaken: 'Inspected and repaired by Municipal PWD Maintenance Squad.' 
    } : prev);
    onUpdateHazards?.(updated);
    setToastMessage(`Hazard ${id} marked as RESOLVED by Municipal Authority.`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filteredHazards = hazardsList.filter(h => {
    const cat = (h?.category || '').toLowerCase();
    if (activeTab === 'pothole') return cat.includes('pothole');
    if (activeTab === 'flood') return cat.includes('flood');
    if (activeTab === 'accident') return cat.includes('accident') || cat.includes('crash');
    if (activeTab === 'blockage') return cat.includes('blockage');
    if (activeTab === 'railway') return cat.includes('railway');
    if (activeTab === 'signs') return cat.includes('sign');
    if (activeTab === 'signals') return cat.includes('signal');
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0b1428] border border-amber-800/50 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-amber-950 border border-amber-700 rounded-xl text-amber-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  ROAD INTELLIGENCE & HAZARD MONITORING
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                  MUNICIPAL PWD CORE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Potholes, Ultrasonic Flood Gauges, Crash Sensors, Blockages, Railway Crossing Gates & Road Condition Index
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSimulatePothole}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-950 transition-all active:scale-95"
        >
          <Radio className="w-4 h-4" />
          <span>SIMULATE VEHICLE-MOUNTED POTHOLE DETECTION</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-amber-950 border border-amber-500 text-amber-200 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-Tabs for all 8 SIH Road Intelligence Problems */}
      <div className="flex flex-wrap items-center gap-2 bg-[#091122] p-2 rounded-xl border border-slate-800">
        {[
          { id: 'all', label: 'All Road Hazards' },
          { id: 'pothole', label: 'Pothole Detection' },
          { id: 'flood', label: 'Flood Detection' },
          { id: 'accident', label: 'Accident Detection' },
          { id: 'blockage', label: 'Road Blockages' },
          { id: 'railway', label: 'Railway Crossing' },
          { id: 'signs', label: 'Damaged Signs' },
          { id: 'signals', label: 'Broken Signals' },
          { id: 'condition', label: 'Road Condition Index (IRI)' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              audio.playAlertBeep();
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-amber-950 text-amber-200 border border-amber-500 shadow-md' 
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Interactive Simulation Sliders (Flood & Railway) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Flood Simulation Slider */}
        <div className="bg-[#091122] border border-cyan-900/50 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Waves className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold text-white uppercase">Ultrasonic Water Level Sensor (WL-309)</h4>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${floodStatus.bg} ${floodStatus.color}`}>
              {floodStatus.text}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Subway Water Depth:</span>
              <span className="text-cyan-300 font-bold">{waterLevelCm} cm</span>
            </div>
            <input 
              type="range"
              min="0"
              max="75"
              step="1"
              value={waterLevelCm}
              onChange={(e) => setWaterLevelCm(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>0 cm (Dry)</span>
              <span className="text-amber-400">25 cm (Caution)</span>
              <span className="text-rose-400">50 cm (Barrier Closed)</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800">
            {waterLevelCm >= 50 
              ? 'Automatic subway boom barrier DOWN. Traffic diverted to Flyover Link 2.' 
              : 'Water pumps nominal. Passage safe for civilian traffic.'}
          </p>
        </div>

        {/* Railway Crossing Slider */}
        <div className="bg-[#091122] border border-cyan-900/50 rounded-xl p-4 shadow-lg space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Train className="w-4 h-4 text-rose-400" />
              <h4 className="text-xs font-bold text-white uppercase">Railway Track Proximity Radar (RC-101)</h4>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${railwayStatus.color} bg-slate-900 border border-slate-800`}>
              GATES {railwayStatus.state}
            </span>
          </div>

          <div>
            <div className="flex justify-between text-xs font-mono mb-1">
              <span className="text-slate-400">Approaching Train Distance:</span>
              <span className="text-rose-300 font-bold">{trainDistanceKm} km</span>
            </div>
            <input 
              type="range"
              min="0.2"
              max="5.0"
              step="0.1"
              value={trainDistanceKm}
              onChange={(e) => setTrainDistanceKm(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-400"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span className="text-rose-400">0.2 km (Locked)</span>
              <span className="text-amber-400">2.0 km (Warning)</span>
              <span className="text-emerald-400">5.0 km (Clear)</span>
            </div>
          </div>

          <p className="text-[11px] text-slate-300 bg-slate-900/60 p-2 rounded border border-slate-800">
            {railwayStatus.alert}. SIL-4 fail-safe interlock synchronizes with city transit maps.
          </p>
        </div>
      </div>

      {/* Main Grid: Hazard Queue & Detailed Inspector */}
      {activeTab === 'condition' ? (
        /* Section 8: Road Condition Index (IRI) View */
        <div className="bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                City-Wide Road Condition & International Roughness Index (IRI)
              </h3>
              <p className="text-xs text-slate-400">Crowdsourced IMU telemetry scores road surface degradation</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">City Avg IRI: 3.2 (Good)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { road: 'Outer Ring Road (NH-48)', score: '4.8 IRI', rating: 'POOR (Potholes at Km 14)', color: 'text-amber-400', fix: 'PWD Resurfacing in 48h' },
              { road: 'Hospital Boulevard Corridor', score: '1.8 IRI', rating: 'EXCELLENT (Smooth)', color: 'text-emerald-400', fix: 'No action needed' },
              { road: 'Industrial Sector 62 Link', score: '5.6 IRI', rating: 'CRITICAL (Rutting)', color: 'text-rose-400', fix: 'Heavy asphalt mill scheduled' },
              { road: 'Civil Lines Arterial', score: '3.1 IRI', rating: 'FAIR (Minor cracks)', color: 'text-cyan-300', fix: 'Routine crack sealing' }
            ].map((rc, i) => (
              <div key={i} className="p-4 bg-[#0c162b] rounded-xl border border-slate-800 space-y-2">
                <span className="font-bold text-white text-xs block">{rc.road}</span>
                <span className={`text-2xl font-black font-mono block ${rc.color}`}>{rc.score}</span>
                <p className="text-[11px] text-slate-300">{rc.rating}</p>
                <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 font-mono">
                  {rc.fix}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Hazards Queue */}
          <div className="lg:col-span-2 bg-[#091122] border border-amber-900/50 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Active Road Hazards Queue ({filteredHazards.length} Items)
              </h3>
              <span className="text-xs font-mono text-cyan-400">V2X Geofence Broadcast Active</span>
            </div>

            <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
              {filteredHazards.map((h) => {
                const isSelected = selectedHazard?.id === h.id;
                return (
                  <div
                    key={h.id}
                    onClick={() => setSelectedHazard(h)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all space-y-2 ${
                      isSelected 
                        ? 'bg-[#151c2f] border-amber-400 glow-amber' 
                        : 'bg-[#0c162b] border-slate-800 hover:border-amber-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-amber-300">{h.id}</span>
                          <StatusBadge status={h.category} size="xs" />
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-900 text-slate-300 border border-slate-800">
                            {h.severity}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white mt-1">{h.location}</h4>
                      </div>

                      <span className="text-[10px] font-mono text-slate-500">{h.detectedTime}</span>
                    </div>

                    <p className="text-xs text-slate-300">{h.details}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[10px] font-mono text-slate-400">
                      <span>Source: {h.source}</span>
                      <span className="text-emerald-400 font-bold">{h.status}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Selected Hazard Inspector */}
          {selectedHazard && (
            <div className="bg-[#091122] border border-amber-900/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Hazard Telemetry Detail
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                    {selectedHazard.id}
                  </span>
                </div>

                <div className="mt-4 space-y-3">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Incident Location</span>
                    <h4 className="text-sm font-bold text-white mt-0.5">{selectedHazard.location}</h4>
                  </div>

                  {/* Live Coordinates Box */}
                  <div className="p-3 bg-[#0a1428] rounded-xl border border-cyan-900/60 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">GPS Coordinates</span>
                        <span className="text-xs font-mono text-cyan-200">
                          {selectedHazard.lat || '28.6152'}° N, {selectedHazard.lng || '77.2075'}° E
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        audio.playAlertBeep();
                        onViewLiveLocation?.({
                          id: selectedHazard.id,
                          name: selectedHazard.category,
                          title: `${selectedHazard.category} (${selectedHazard.id})`,
                          location: selectedHazard.location,
                          lat: selectedHazard.lat || '28.6152',
                          lng: selectedHazard.lng || '77.2075',
                          speedKmh: 0,
                          heading: '0° N',
                          category: 'Road Hazard',
                          details: selectedHazard.details,
                          actionTaken: selectedHazard.actionTaken
                        });
                      }}
                      className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold text-[11px] rounded-lg transition-colors flex items-center space-x-1"
                    >
                      <Crosshair className="w-3 h-3" />
                      <span>Track Live</span>
                    </button>
                  </div>

                  <div className="p-3 bg-[#0c162b] rounded-xl border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex justify-between"><span className="text-slate-400">Category:</span><span className="text-amber-300 font-bold">{selectedHazard.category}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Severity:</span><span className="text-rose-400 font-bold">{selectedHazard.severity}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Sensor Source:</span><span className="text-slate-200 truncate">{selectedHazard.source}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Status:</span><span className="text-emerald-400 font-bold">{selectedHazard.status}</span></div>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Municipal Action Log</span>
                    <p className="text-xs text-slate-200">{selectedHazard.actionTaken}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => handleResolveHazard(selectedHazard.id)}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Check className="w-4 h-4" />
                  <span>Mark Hazard as Repaired / Resolved</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
