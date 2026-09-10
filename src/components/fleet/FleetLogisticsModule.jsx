import React, { useState } from 'react';
import { 
  Truck, ShieldAlert, Thermometer, Weight, Eye, Fuel, 
  BatteryCharging, AlertTriangle, CheckCircle2, Sliders, 
  MapPin, Clock, Zap, Lock, Unlock, Flame, Volume2, ArrowRight,
  Package, Wrench, Crosshair, Navigation, Gauge, RefreshCw
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';
import audio from '../../services/audioService';

export const EXTENDED_FLEET = [
  {
    id: 'TRUCK-204',
    model: 'Volvo FH16 540 Globetrotter',
    driver: 'Harpreet Singh (ID: DRV-8821)',
    cargoType: 'Refrigerated Vaccines & Pharmaceuticals',
    status: 'IN TRANSIT',
    speedKmh: 62,
    fuelPercent: 74,
    etaMinutes: 48,
    grossWeightTons: 18.4,
    permittedWeightTons: 16.0,
    isOverloaded: true,
    overloadPct: 15,
    tempCelsius: 4.2,
    route: 'Dwarka Sector 10 ⇄ Cyber City Hub',
    lat: '28.6160',
    lng: '77.2060',
    dmsFatigue: 'NORMAL (Eyes Open)',
    dmsEyeClosureMs: 210,
    dmsYawnCount: 1,
    maintenanceScore: '94% (Brakes: 82%, Tires: 34 PSI, Engine: 0 DTC)',
    consignments: 18,
    deliveredConsignments: 12
  },
  {
    id: 'TRUCK-312',
    model: 'BharatBenz 2823R Hazmat Tanker',
    driver: 'Vikram Singh (Hazmat Cert: HM-409)',
    cargoType: 'Pressurized LPG (Liquefied Petroleum Gas)',
    status: 'HAZMAT PATROL',
    speedKmh: 52,
    fuelPercent: 88,
    etaMinutes: 34,
    grossWeightTons: 24.0,
    permittedWeightTons: 25.0,
    isOverloaded: false,
    overloadPct: 0,
    tempCelsius: 22.4,
    route: 'Refinery Terminal ⇄ Industrial LPG Depot',
    lat: '28.6175',
    lng: '77.2040',
    dmsFatigue: 'ATTENTIVE',
    dmsEyeClosureMs: 180,
    dmsYawnCount: 0,
    maintenanceScore: '98% (Valves Inspected 2h ago)',
    consignments: 1,
    deliveredConsignments: 0
  },
  {
    id: 'VAN-108',
    model: 'Tata Ace EV Electric Delivery Van',
    driver: 'Rahul Deshmukh',
    cargoType: 'E-Commerce Last-Mile Deliveries',
    status: 'LAST-MILE DROP',
    speedKmh: 34,
    fuelPercent: 62,
    etaMinutes: 14,
    grossWeightTons: 1.8,
    permittedWeightTons: 2.2,
    isOverloaded: false,
    overloadPct: 0,
    tempCelsius: 26.0,
    route: 'Sector 15 Micro-Fulfillment ⇄ Residential Hub',
    lat: '28.6142',
    lng: '77.2086',
    dmsFatigue: 'NORMAL',
    dmsEyeClosureMs: 190,
    dmsYawnCount: 2,
    maintenanceScore: '96% (EV Battery State of Health: 94%)',
    consignments: 42,
    deliveredConsignments: 34
  }
];

export default function FleetLogisticsModule({ 
  fleet = EXTENDED_FLEET, 
  onCommandAlert,
  onViewLiveLocation,
  onNavigate
}) {
  const [fleetList, setFleetList] = useState(fleet && fleet.length >= 3 ? fleet : EXTENDED_FLEET);
  const [selectedTruckId, setSelectedTruckId] = useState('TRUCK-204');
  const [activeTab, setActiveTab] = useState('tracking'); // tracking | fatigue | overload | fuel | delivery | maintenance
  
  // Interactive Simulation states:
  const [cargoDoorLocked, setCargoDoorLocked] = useState(true);
  const [overloadWeight, setOverloadWeight] = useState(18.4);
  const [dmsDriverDrowsy, setDmsDriverDrowsy] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Fuel Intelligence inputs:
  const [calcVehicleType, setCalcVehicleType] = useState('Truck');
  const [calcFuelType, setCalcFuelType] = useState('Diesel');
  const [calcFuelPercent, setCalcFuelPercent] = useState(74);
  const [calcDistance, setCalcDistance] = useState(184);

  const currentTruck = fleetList.find(t => t.id === selectedTruckId) || fleetList[0];

  // Fuel computations
  const isEv = calcFuelType === 'Electric (EV)';
  const tankCapacity = calcVehicleType === 'Truck' ? 240 : 50; // Liters or kWh
  const mileage = calcVehicleType === 'Truck' ? 4.5 : 16.0; // km/L or km/kWh
  const remainingFuelVolume = (calcFuelPercent / 100) * tankCapacity;
  const estimatedRange = Math.round(remainingFuelVolume * mileage);
  const fuelNeeded = Math.round(calcDistance / mileage);
  const fuelCost = isEv ? Math.round(fuelNeeded * 8) : Math.round(fuelNeeded * 95);

  const handleToggleDoor = () => {
    const newState = !cargoDoorLocked;
    setCargoDoorLocked(newState);
    if (!newState) {
      audio.playAlertBeep();
      onCommandAlert?.({
        type: 'CARGO TAMPERING ALERT',
        vehicle: currentTruck.id,
        desc: `Container rear seal breach detected at lat: ${currentTruck.lat}, lng: ${currentTruck.lng} while in transit! Command center dispatched police check.`
      });
      setToastMessage('SECURITY BREACH: Container seal tampered! Alert dispatched to Command Center.');
    } else {
      audio.playSuccessChime();
      setToastMessage('Container door locked & encrypted seal restored.');
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleToggleFatigue = () => {
    const next = !dmsDriverDrowsy;
    setDmsDriverDrowsy(next);
    if (next) {
      audio.playAlertBeep();
      onCommandAlert?.({
        type: 'DRIVER FATIGUE ALERT',
        vehicle: currentTruck.id,
        desc: `DMS NIR camera detected 420ms eye-closure and 7 yawns for driver ${currentTruck.driver}. Immediate rest stop advisory signaled.`
      });
      setToastMessage('DRIVER DROWSINESS DETECTED! Rest stop recommended within 3 km.');
    } else {
      audio.playSuccessChime();
      setToastMessage('Driver verified alert & attentive.');
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0b1428] border border-blue-800/50 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-blue-950 border border-blue-700 rounded-xl text-blue-400">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  FLEET & LOGISTICS COMMAND
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-950 text-blue-300 border border-blue-800">
                  WIM & TELEMATICS
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Fleet Tracking, Weigh-In-Motion Overload, Driver DMS Fatigue, Fuel Intelligence, Last-Mile & Maintenance
              </p>
            </div>
          </div>
        </div>

        {/* Fleet Vehicle Selector */}
        <div className="flex items-center space-x-2 bg-slate-900/80 p-1.5 rounded-xl border border-slate-800">
          {fleetList.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTruckId(t.id);
                audio.playAlertBeep();
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedTruckId === t.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-950' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.id}
            </button>
          ))}
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-blue-950 border border-blue-500 text-blue-200 text-xs rounded-xl flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-Tabs for all 7 User Requirements */}
      <div className="flex flex-wrap items-center gap-2 bg-[#091122] p-2 rounded-xl border border-slate-800">
        {[
          { id: 'tracking', label: 'Fleet Tracking & Telematics', icon: Truck },
          { id: 'fatigue', label: 'Driver Fatigue (DMS)', icon: Eye },
          { id: 'overload', label: 'Vehicle Overload (WIM)', icon: Weight },
          { id: 'fuel', label: 'Fuel Intelligence Engine', icon: Fuel },
          { id: 'delivery', label: 'Delivery & Last-Mile', icon: Package },
          { id: 'maintenance', label: 'Vehicle Maintenance & OBD', icon: Wrench }
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
                  ? 'bg-blue-950 text-blue-200 border border-blue-500 shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: FLEET TRACKING & TELEMATICS ================= */}
      {activeTab === 'tracking' && (
        <div className="bg-[#091122] border border-blue-900/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-black text-white font-mono">{currentTruck.id}</h3>
                <StatusBadge status={currentTruck.status} size="xs" />
                <span className="text-xs text-slate-400 font-mono">({currentTruck.model})</span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Driver: <span className="text-white font-semibold">{currentTruck.driver}</span> • Route: <span className="text-cyan-300 font-semibold">{currentTruck.route}</span>
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  audio.playAlertBeep();
                  onViewLiveLocation?.({
                    id: currentTruck.id,
                    name: currentTruck.model,
                    title: `${currentTruck.id} (${currentTruck.cargoType})`,
                    location: currentTruck.route,
                    lat: currentTruck.lat,
                    lng: currentTruck.lng,
                    speedKmh: currentTruck.speedKmh,
                    heading: '180° S',
                    accuracy: '±14 cm (Fleet GPS)',
                    category: 'Fleet & Logistics',
                    driver: currentTruck.driver,
                    details: `Gross weight: ${currentTruck.grossWeightTons} tons. Fuel: ${currentTruck.fuelPercent}%. Destination ETA: ${currentTruck.etaMinutes} min.`
                  });
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-1.5"
              >
                <Crosshair className="w-4 h-4 text-cyan-200" />
                <span>Track Live Location</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Live Speed</span>
              <span className="text-xl font-bold text-cyan-300 block mt-1">{currentTruck.speedKmh} km/h</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Fuel / Battery</span>
              <span className="text-xl font-bold text-emerald-400 block mt-1">{currentTruck.fuelPercent}%</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Destination ETA</span>
              <span className="text-xl font-bold text-amber-300 block mt-1">{currentTruck.etaMinutes} min</span>
            </div>
            <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">GPS Location</span>
              <span className="text-xs font-bold text-slate-200 block mt-1 truncate">{currentTruck.lat}° N, {currentTruck.lng}° E</span>
            </div>
          </div>

          {/* Quick Cargo & Safety Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#0d162d] rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase">Cargo Compartment Security</span>
                <StatusBadge status={cargoDoorLocked ? 'SECURE' : 'BREACH DETECTED'} size="xs" />
              </div>
              <p className="text-slate-300">{currentTruck.cargoType}</p>
              <button
                onClick={handleToggleDoor}
                className="mt-2 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700 transition-colors"
              >
                {cargoDoorLocked ? 'Simulate Cargo Door Breach' : 'Reseal Container Door'}
              </button>
            </div>

            <div className="p-4 bg-[#0d162d] rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white uppercase">Driver Vigilance DMS</span>
                <StatusBadge status={dmsDriverDrowsy ? 'DROWSY' : 'ATTENTIVE'} size="xs" />
              </div>
              <p className="text-slate-300">{currentTruck.driver} • Eye closure: {dmsDriverDrowsy ? '420ms (Spike)' : '210ms'}</p>
              <button
                onClick={handleToggleFatigue}
                className="mt-2 py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 rounded-lg border border-slate-700 transition-colors"
              >
                {dmsDriverDrowsy ? 'Driver Took Rest Break' : 'Simulate Drowsiness Spike'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: DRIVER FATIGUE (DMS) ================= */}
      {activeTab === 'fatigue' && (
        <div className="bg-[#091122] border border-blue-900/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Driver Monitoring System (DMS) — NIR Eye-Tracking
              </h3>
              <p className="text-xs text-slate-400">940nm Near-Infrared Camera monitoring PERCLOS (Percentage of Eye Closure)</p>
            </div>
            <StatusBadge status={dmsDriverDrowsy ? 'FATIGUE DETECTED' : 'OPERATOR NOMINAL'} size="xs" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Eye Closure Duration</span>
              <span className={`text-2xl font-black font-mono block mt-1 ${dmsDriverDrowsy ? 'text-rose-400' : 'text-emerald-400'}`}>
                {dmsDriverDrowsy ? '420 ms' : '210 ms'}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Threshold: &gt;350ms indicates microsleep risk</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Yawn Frequency</span>
              <span className={`text-2xl font-black font-mono block mt-1 ${dmsDriverDrowsy ? 'text-amber-400' : 'text-cyan-300'}`}>
                {dmsDriverDrowsy ? '7 yawns / hr' : '1 yawn / hr'}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Threshold: &gt;4 yawns/hr signals physical fatigue</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Recommended Rest Stop</span>
              <span className="text-sm font-bold text-white block mt-1">Expressway Plaza Food Court (3.2 km)</span>
              <p className="text-[10px] text-emerald-400 mt-1">Safe truck parking & hot beverage available</p>
            </div>
          </div>

          <button
            onClick={handleToggleFatigue}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              dmsDriverDrowsy ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {dmsDriverDrowsy ? 'Acknowledge & Clear Driver Fatigue Warning' : 'Simulate Driver Drowsiness Alert'}
          </button>
        </div>
      )}

      {/* ================= TAB 3: VEHICLE LOAD & WEIGH-IN-MOTION ================= */}
      {activeTab === 'overload' && (
        <div className="bg-[#091122] border border-blue-900/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Piezoelectric Weigh-In-Motion (WIM) Axle Sensor (WIM-401)
              </h3>
              <p className="text-xs text-slate-400">High-speed quartz strips at Freight Toll Plaza Lane 3</p>
            </div>
            <StatusBadge status={overloadWeight > 16.0 ? 'OVERLOAD VIOLATION' : 'LEGAL PAYLOAD'} size="xs" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Gross Measured Weight</span>
              <span className={`text-2xl font-black font-mono block mt-1 ${overloadWeight > 16.0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {overloadWeight} Tons
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Permitted Limit: 16.0 Tons</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Overload Percentage</span>
              <span className="text-2xl font-black font-mono text-amber-400 block mt-1">
                {overloadWeight > 16.0 ? `+${Math.round(((overloadWeight - 16.0) / 16.0) * 100)}%` : '0%'}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Axle strain rating: High</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Enforcement Action</span>
              <span className="text-sm font-bold text-rose-300 block mt-1">
                {overloadWeight > 16.0 ? 'Electronic Challan ₹5,000 Issued' : 'Cleared for Highway Transit'}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Directly logged to Ministry VAHAN portal</p>
            </div>
          </div>

          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Simulate Truck Payload:</span>
              <span className="text-white font-bold">{overloadWeight} Tons</span>
            </div>
            <input
              type="range"
              min="12.0"
              max="24.0"
              step="0.2"
              value={overloadWeight}
              onChange={(e) => setOverloadWeight(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>
      )}

      {/* ================= TAB 4: FUEL INTELLIGENCE ENGINE ================= */}
      {activeTab === 'fuel' && (
        <div className="bg-[#091122] border border-blue-900/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Fleet Fuel Intelligence & Range Optimization
              </h3>
              <p className="text-xs text-slate-400">Calculates range, fuel burn, cost, and stops based on highway elevation & traffic speed</p>
            </div>
            <StatusBadge status={estimatedRange >= calcDistance ? 'SUFFICIENT RANGE' : 'REFUEL REQUIRED'} size="xs" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Remaining Range</span>
              <span className="text-2xl font-black font-mono text-cyan-300 block mt-1">{estimatedRange} km</span>
              <p className="text-[10px] text-slate-400 mt-1">Fuel tank at {calcFuelPercent}%</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Trip Fuel Needed</span>
              <span className="text-2xl font-black font-mono text-amber-300 block mt-1">
                {fuelNeeded} {isEv ? 'kWh' : 'Liters'}
              </span>
              <p className="text-[10px] text-slate-400 mt-1">Distance: {calcDistance} km</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Estimated Energy Cost</span>
              <span className="text-2xl font-black font-mono text-emerald-400 block mt-1">₹{fuelCost}</span>
              <p className="text-[10px] text-slate-400 mt-1">{isEv ? '₹8/kWh' : '₹95/L diesel'}</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Eco-Speed Advisory</span>
              <span className="text-xl font-bold text-white block mt-1">58 - 64 km/h</span>
              <p className="text-[10px] text-emerald-400 mt-1">Saves up to 18% fuel vs speeding</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 5: DELIVERY & LAST-MILE ================= */}
      {activeTab === 'delivery' && (
        <div className="bg-[#091122] border border-blue-900/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Consignment Delivery & Last-Mile Dispatch
              </h3>
              <p className="text-xs text-slate-400">Dynamic routing avoiding road hazards and congested signal junctions</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">92% On-Time Delivery Rate</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Active Consignments</span>
              <span className="text-2xl font-black font-mono text-white block mt-1">{currentTruck.consignments} Packages</span>
              <p className="text-[10px] text-slate-400 mt-1">Refrigerated bio-medical supplies</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Delivered Drops</span>
              <span className="text-2xl font-black font-mono text-emerald-400 block mt-1">{currentTruck.deliveredConsignments} / {currentTruck.consignments}</span>
              <p className="text-[10px] text-slate-400 mt-1">Remaining: {currentTruck.consignments - currentTruck.deliveredConsignments} drops</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Next Stop</span>
              <span className="text-sm font-bold text-cyan-300 block mt-1">Cyber City Hospital Trauma Pharmacy</span>
              <p className="text-[10px] text-slate-400 mt-1">ETA: 14 mins via cleared route</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 6: VEHICLE MAINTENANCE & OBD-II ================= */}
      {activeTab === 'maintenance' && (
        <div className="bg-[#091122] border border-blue-900/60 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                CAN-Bus & OBD-II Vehicle Health Diagnostics
              </h3>
              <p className="text-xs text-slate-400">Real-time telemetry from engine ECU, brake wear sensors and TPMS</p>
            </div>
            <span className="text-xs font-mono text-emerald-400">Fleet Health: 96% Nominal</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Engine Diagnostic Codes</span>
              <span className="text-xl font-bold text-emerald-400 block mt-1">0 DTC (Clean)</span>
              <p className="text-[10px] text-slate-400 mt-1">ECU nominal, emissions normal</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Brake Pad Thickness</span>
              <span className="text-xl font-bold text-cyan-300 block mt-1">82% Remaining</span>
              <p className="text-[10px] text-slate-400 mt-1">Next inspection in 12,000 km</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Tire Pressure (TPMS)</span>
              <span className="text-xl font-bold text-emerald-300 block mt-1">34 PSI (All 6 Tires)</span>
              <p className="text-[10px] text-slate-400 mt-1">Temperature: 38°C</p>
            </div>
            <div className="bg-[#0c162b] p-4 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase block">Alternator / Battery</span>
              <span className="text-xl font-bold text-emerald-400 block mt-1">24.2 V (Nominal)</span>
              <p className="text-[10px] text-slate-400 mt-1">Auxiliary telematics powered</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
