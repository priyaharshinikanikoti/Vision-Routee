import React, { useState } from 'react';
import { 
  Box, Lock, Unlock, Thermometer, Flame, ShieldAlert, 
  CheckCircle2, AlertTriangle, Radio, Activity, Navigation, 
  Zap, BellRing, Eye, ArrowRight, MapPin, Crosshair
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import MiniRouteMap from '../common/MiniRouteMap';
import audio from '../../services/audioService';

export default function SmartCargoModule({ 
  onTriggerCommandAlert,
  onViewLiveLocation,
  onNavigate 
}) {
  // Cargo Tamper State (Container ISO-9941 / TRUCK-204)
  const [doorLocked, setDoorLocked] = useState(true);
  const [tamperAlert, setTamperAlert] = useState(false);

  // Cold Chain State (Reefer Vaccines)
  const [tempCelsius, setTempCelsius] = useState(4.2);
  const [humidity, setHumidity] = useState(54);

  // LPG / Hazardous Cargo State (TRUCK-312 Hazmat Tanker)
  const [gasLeakPpm, setGasLeakPpm] = useState(12); // safe < 250 ppm
  const [cordonActive, setCordonActive] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const isTempCritical = tempCelsius > 8.0;
  const isGasLeakCritical = gasLeakPpm > 100;

  const handleToggleDoor = () => {
    const nextLocked = !doorLocked;
    setDoorLocked(nextLocked);
    setTamperAlert(!nextLocked);

    if (!nextLocked) {
      audio.playAlertBeep();
      setToastMessage('SECURITY BREACH: Container rear door opened unexpectedly in transit!');
      onTriggerCommandAlert?.({
        type: 'CARGO TAMPERING ALERT',
        vehicle: 'TRUCK-204',
        desc: 'Magnetic container seal broken at GPS coordinates (28.6139, 77.2090). Anti-theft protocol engaged.'
      });
    } else {
      audio.playSuccessChime();
      setToastMessage('Container door resealed. Sensor telemetry secured.');
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSimulateGasLeak = () => {
    setGasLeakPpm(380);
    setCordonActive(true);
    audio.playAlertBeep();
    setToastMessage('CRITICAL HAZARD: Volatile LPG gas leakage detected on Tanker TRUCK-312! Multi-agency evacuation cordon initiated.');
    onTriggerCommandAlert?.({
      type: 'GAS LEAKAGE DETECTED',
      vehicle: 'TRUCK-312',
      desc: 'Optical sensor recorded 380 ppm volatile propane-butane vapor! Fire tender FIRE-22 and Police POL-18 dispatched.'
    });
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handleResetGasLeak = () => {
    setGasLeakPpm(12);
    setCordonActive(false);
    audio.playSuccessChime();
    setToastMessage('LPG valves verified sealed. Environmental readings nominal.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0b1428] border border-cyan-800/50 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-cyan-950 border border-cyan-700 rounded-xl text-cyan-400">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  SMART CARGO, COLD-CHAIN & HAZMAT SECURITY
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                  ANTI-THEFT & TEMPERATURE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                BLE Magnetic Door Seals, PT100 Refrigerated Vaccine Telemetry & LPG Explosive Gas Detection
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">CARGO MONITORED</span>
            <span className="text-cyan-300 font-bold text-base">5 Consignments</span>
          </div>
          <div className="bg-slate-900 px-3 py-2 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">HAZMAT STATUS</span>
            <span className={isGasLeakCritical ? 'text-rose-400 font-bold text-base animate-pulse' : 'text-emerald-400 font-bold text-base'}>
              {isGasLeakCritical ? 'CORDON ACTIVE' : 'NOMINAL'}
            </span>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className={`p-3 rounded-xl border text-xs flex items-center space-x-2 animate-in fade-in ${
          tamperAlert || isGasLeakCritical ? 'bg-rose-950 border-rose-500 text-rose-200' : 'bg-emerald-950 border-emerald-500 text-emerald-200'
        }`}>
          <AlertTriangle className="w-4 h-4 shrink-0 text-current" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Embedded Hazmat & Cold-Chain Route Corridor Map */}
      <MiniRouteMap
        title="Hazmat Tanker & Cold-Chain Transit Corridor"
        subtitle="Tracking Tanker TRUCK-312 (Refinery Terminal → Bottling Plant) with 500m Safe Buffer"
        startLabel="IndianOil Refinery Depot"
        endLabel="City Bottling Plant Hub"
        pathCoordinates={[
          { x: 90, y: 150 },
          { x: 250, y: 120 },
          { x: 420, y: 100 },
          { x: 580, y: 130 },
          { x: 720, y: 110 }
        ]}
        vehicle={{ id: 'TRUCK-312', speed: '48', x: 420, y: 100 }}
        corridorActive={!isGasLeakCritical}
        hazards={isGasLeakCritical ? [{ id: 'LPG-LEAK', x: 420, y: 100 }] : []}
        actionButtonText={isGasLeakCritical ? "Disperse Cordon" : "Simulate Gas Leak"}
        onActionClick={() => isGasLeakCritical ? handleResetGasLeak() : handleSimulateGasLeak()}
        height="h-64"
      />

      {/* 3 Core Interactive Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SECTION 1: GOODS THEFT & CARGO TAMPERING */}
        <div className={`rounded-2xl border-2 p-5 shadow-xl space-y-4 transition-all ${
          tamperAlert 
            ? 'bg-gradient-to-br from-red-950/90 via-[#180e1e] to-[#0d162d] border-red-500 glow-red' 
            : 'bg-[#091122] border-cyan-900/60'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              {doorLocked ? <Lock className="w-4 h-4 text-emerald-400" /> : <Unlock className="w-4 h-4 text-rose-400 animate-pulse" />}
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cargo Anti-Theft Sensor</h3>
            </div>
            <StatusBadge status={tamperAlert ? 'TAMPERING ALERT' : 'SECURE'} size="xs" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#0a1428] rounded-xl border border-cyan-900/60">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-[11px] font-mono text-cyan-200">28.6160° N, 77.2060° E</span>
              </div>
              <button
                onClick={() => {
                  audio.playAlertBeep();
                  onViewLiveLocation?.({
                    id: 'TRUCK-204',
                    name: 'Container ISO-9941 (TRUCK-204)',
                    title: 'Smart Cargo Container ISO-9941',
                    location: 'Expressway Interchange Route',
                    lat: '28.6160',
                    lng: '77.2060',
                    speedKmh: 62,
                    heading: '180° S',
                    accuracy: '±12 cm (Telematics GPS)',
                    category: 'Smart Cargo',
                    details: 'BLE magnetic container seal active. Cold-chain probe: 4.2°C.',
                    actionTaken: 'Anti-theft protocol active.'
                  });
                }}
                className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold text-[10px] rounded-lg transition-colors flex items-center space-x-1"
              >
                <Crosshair className="w-3 h-3 text-cyan-400" />
                <span>Track Live</span>
              </button>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Carrier Vehicle:</span>
                <span className="text-white font-bold">TRUCK-204 (BharatBenz)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cargo Type:</span>
                <span className="text-cyan-300">High-Value Electronics & Meds</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Magnetic Seal:</span>
                <span className={doorLocked ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                  {doorLocked ? 'LOCKED & SEALED' : 'BREACH DETECTED (OPEN)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Vibration Sensor:</span>
                <span className="text-slate-200">0.12 RMS (Smooth Road)</span>
              </div>
            </div>

            {tamperAlert ? (
              <div className="p-3 bg-red-900/60 border border-red-500 rounded-xl space-y-1 text-red-100">
                <p className="font-bold text-xs text-white">TAMPERING BREACH IN TRANSIT</p>
                <p className="text-[11px] text-red-200">
                  Automated alert sent to Logistics Operator & Command Center. Live GPS tracked to NH-48 Km 14/2.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Cargo container doors securely latched. Zero intrusion detected.</span>
              </div>
            )}

            <button
              onClick={handleToggleDoor}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                tamperAlert 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950' 
                  : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950'
              }`}
            >
              {doorLocked ? 'Simulate Unauthorized Door Opening' : 'Reseal Door & Clear Tamper Alert'}
            </button>
          </div>
        </div>

        {/* SECTION 2: COLD CHAIN TEMPERATURE TELEMETRY */}
        <div className={`rounded-2xl border-2 p-5 shadow-xl space-y-4 transition-all ${
          isTempCritical 
            ? 'bg-gradient-to-br from-amber-950/90 via-[#18110e] to-[#0d162d] border-amber-500 glow-amber' 
            : 'bg-[#091122] border-cyan-900/60'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Cold-Chain Temperature</h3>
            </div>
            <StatusBadge status={isTempCritical ? 'TEMPERATURE ALERT' : 'SAFE'} size="xs" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-3xl font-black font-mono text-cyan-300">{tempCelsius.toFixed(1)}°C</span>
                <span className="text-[10px] text-slate-400 ml-2">Setpoint: 4.0°C</span>
              </div>
              <span className={`text-xs font-mono font-bold ${isTempCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                {isTempCritical ? 'EXCEEDED 8.0°C!' : 'OPTIMAL'}
              </span>
            </div>

            <div>
              <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>Simulate Temperature Rise:</span>
                <span className="font-mono text-cyan-400 font-bold">{tempCelsius}°C</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="14" 
                step="0.2"
                value={tempCelsius}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setTempCelsius(val);
                  if (val > 8.0) audio.playAlertBeep();
                }}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Cargo Type:</span>
                <span className="text-white font-bold">Vaccines & Insulin (Rx)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Safe Range:</span>
                <span className="text-emerald-300">2.0°C - 8.0°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Chamber Humidity:</span>
                <span className="text-slate-200">{humidity}% RH</span>
              </div>
            </div>

            <p className={`text-[11px] font-semibold ${isTempCritical ? 'text-rose-300' : 'text-emerald-300'}`}>
              {isTempCritical 
                ? 'ALERT: Thermal spoilage threshold exceeded! Backup compressor switched to emergency high-flow mode.' 
                : 'Vaccine thermal integrity preserved within safe clinical distribution bounds.'}
            </p>
          </div>
        </div>

        {/* SECTION 3: LPG / FUEL TRANSPORT SAFETY (TRUCK-312) */}
        <div className={`rounded-2xl border-2 p-5 shadow-xl space-y-4 transition-all ${
          isGasLeakCritical 
            ? 'bg-gradient-to-br from-red-950/90 via-[#200e0e] to-[#0d162d] border-red-500 glow-red' 
            : 'bg-[#091122] border-cyan-900/60'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center space-x-2">
              <Flame className="w-4 h-4 text-orange-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">LPG & Hazmat Safety</h3>
            </div>
            <StatusBadge status={isGasLeakCritical ? 'CRITICAL HAZARD' : 'SAFE'} size="xs" />
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 bg-[#0a1428] rounded-xl border border-cyan-900/60">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                <span className="text-[11px] font-mono text-cyan-200">28.6175° N, 77.2040° E</span>
              </div>
              <button
                onClick={() => {
                  audio.playAlertBeep();
                  onViewLiveLocation?.({
                    id: 'TRUCK-312',
                    name: 'Bharat Petroleum LPG Tanker TRUCK-312',
                    title: 'LPG Pressurized Tanker TRUCK-312',
                    location: 'Freight Toll Plaza Hazmat Corridor',
                    lat: '28.6175',
                    lng: '77.2040',
                    speedKmh: 52,
                    heading: '135° SE',
                    accuracy: '±12 cm (Ex-d ATEX Unit)',
                    category: 'Smart Cargo & Hazmat',
                    driver: 'Vikram Singh (Hazmat Certified)',
                    details: 'Optical hydrocarbon sensor: 12 ppm (Normal). Pressure: 12.4 Bar.',
                    actionTaken: '500m evacuation cordon protocol standby.'
                  });
                }}
                className="px-2.5 py-1 bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-300 font-bold text-[10px] rounded-lg transition-colors flex items-center space-x-1"
              >
                <Crosshair className="w-3 h-3 text-cyan-400" />
                <span>Track Live</span>
              </button>
            </div>

            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 font-mono space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-400">Hazmat Tanker:</span>
                <span className="text-white font-bold">TRUCK-312 (Tata Signa 3525)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Cargo:</span>
                <span className="text-amber-300">Pressurized Liquefied Petroleum Gas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Gas Leakage Sensor:</span>
                <span className={isGasLeakCritical ? 'text-rose-400 font-bold animate-pulse' : 'text-emerald-400'}>
                  {gasLeakPpm} ppm ({isGasLeakCritical ? 'LETHAL BREACH' : 'Nominal <250'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tank Pressure:</span>
                <span className="text-slate-200">12.4 Bar (Valve Sealed)</span>
              </div>
            </div>

            {isGasLeakCritical ? (
              <div className="p-3 bg-red-900/60 border border-red-500 rounded-xl space-y-1.5 text-red-100">
                <div className="flex items-center space-x-1.5 text-white font-bold text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  <span>500m MULTI-AGENCY EVACUATION CORDON</span>
                </div>
                <p className="text-[11px] text-red-200">
                  Police Patrol POL-18 blocking highway access. Fire tender FIRE-22 spraying water fog curtain. Civilian traffic rerouted.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-xl text-emerald-200 text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>LPG valves 100% sealed. Hazardous cargo transport corridor verified clear.</span>
              </div>
            )}

            <button
              onClick={isGasLeakCritical ? handleResetGasLeak : handleSimulateGasLeak}
              className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all shadow-lg ${
                isGasLeakCritical 
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950' 
                  : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white shadow-orange-950'
              }`}
            >
              {isGasLeakCritical ? 'Seal LPG Valve & Deactivate Evacuation Cordon' : 'Simulate Explosive LPG Gas Leakage'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
