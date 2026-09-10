import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, Play, RotateCcw, CheckCircle2, Siren, 
  Flame, Shield, ArrowRight, Clock, Zap, Radio, Building2, X
} from 'lucide-react';
import audio from '../../services/audioService';

export const SIMULATION_STEPS = [
  { id: 1, title: 'Emergency Detected', desc: 'Roadside acoustic sensor & 112 emergency call dispatch event logged.' },
  { id: 2, title: 'Vehicle Identified', desc: 'Nearest emergency unit localized via RTK-GPS and assigned.' },
  { id: 3, title: 'Traffic Analyzed', desc: 'AI analyzes intersection queue lengths and real-time congestion heatmaps.' },
  { id: 4, title: 'Fastest Route Calculated', desc: 'Dynamic routing algorithm bypasses flooded underpasses and active potholes.' },
  { id: 5, title: 'Priority Route Created', desc: 'Dedicated digital emergency lane locked into Central Transit Command.' },
  { id: 6, title: 'Traffic Signals Coordinated', desc: 'V2I preemption packet forces Signals 01-04 into coordinated green wave.' },
  { id: 7, title: 'Traffic Users Warned', desc: 'V2V geo-broadcast alerts civilian vehicles 500m ahead: "GIVE WAY".' },
  { id: 8, title: 'Hospital / Destination Notified', desc: 'Trauma team receives patient vitals telemetry and reserves ICU bed.' },
  { id: 9, title: 'Vehicle Reaches Destination', desc: 'Ambulance pulls into trauma bay with zero signal stops on corridor.' },
  { id: 10, title: 'Impact Calculated', desc: 'Golden Hour saved, fuel conserved, and audit report published.' }
];

export default function EmergencySimulationLab({ isOpen, onClose }) {
  const [selectedVehicle, setSelectedVehicle] = useState('Ambulance'); // Ambulance | Fire | Police
  const [trafficDensity, setTrafficDensity] = useState('Heavy'); // Low | Medium | Heavy
  const [distanceKm, setDistanceKm] = useState(10); // 5 | 10 | 15
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const timerRef = useRef(null);

  // Compute realistic dynamic results based on user inputs
  const trafficMultiplier = trafficDensity === 'Heavy' ? 2.4 : trafficDensity === 'Medium' ? 1.7 : 1.2;
  const normalEta = Math.round(distanceKm * 2.2 * trafficMultiplier);
  const priorityEta = Math.round(distanceKm * 1.1);
  const timeSaved = normalEta - priorityEta;

  const startSimulation = () => {
    setIsRunning(true);
    setCurrentStep(1);
    setIsCompleted(false);
    audio.playSiren();
  };

  const resetSimulation = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setIsRunning(false);
    setCurrentStep(0);
    setIsCompleted(false);
  };

  useEffect(() => {
    if (isRunning && currentStep > 0 && currentStep <= 10) {
      timerRef.current = setTimeout(() => {
        if (currentStep < 10) {
          setCurrentStep(prev => prev + 1);
          audio.playAlertBeep();
        } else {
          setIsRunning(false);
          setIsCompleted(true);
          audio.playSuccessChime();
        }
      }, 1200);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isRunning, currentStep]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-[#091122] border border-cyan-600/70 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title Header */}
        <div className="flex items-center space-x-3 pb-4 border-b border-cyan-900/50">
          <div className="p-3 bg-gradient-to-br from-amber-500 to-red-600 rounded-xl text-white shadow-lg shadow-amber-950">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-black text-white tracking-wide">
                EMERGENCY SIMULATION LAB (SIH DEMO)
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                10-STEP SEQUENCE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive end-to-end demonstration of the Connected Transportation Emergency Green Corridor
            </p>
          </div>
        </div>

        {/* Control Inputs */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Select Emergency */}
          <div className="bg-[#0e1932] p-3.5 rounded-xl border border-slate-800">
            <label className="text-xs font-bold text-slate-300 uppercase block mb-2">
              1. Emergency Type
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { name: 'Ambulance', icon: Siren, color: 'text-rose-400' },
                { name: 'Fire', icon: Flame, color: 'text-orange-400' },
                { name: 'Police', icon: Shield, color: 'text-blue-400' }
              ].map(item => (
                <button
                  key={item.name}
                  onClick={() => setSelectedVehicle(item.name)}
                  disabled={isRunning}
                  className={`p-2 rounded-lg text-xs font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                    selectedVehicle === item.name 
                      ? 'bg-cyan-950 border border-cyan-500 text-white shadow-md' 
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <item.icon className={`w-4 h-4 ${item.color}`} />
                  <span className="text-[10px]">{item.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Select Traffic */}
          <div className="bg-[#0e1932] p-3.5 rounded-xl border border-slate-800">
            <label className="text-xs font-bold text-slate-300 uppercase block mb-2">
              2. Traffic Density
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['Low', 'Medium', 'Heavy'].map(density => (
                <button
                  key={density}
                  onClick={() => setTrafficDensity(density)}
                  disabled={isRunning}
                  className={`py-2 px-1 rounded-lg text-xs font-bold text-center transition-all ${
                    trafficDensity === density 
                      ? 'bg-amber-950 border border-amber-500 text-amber-300' 
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {density}
                </button>
              ))}
            </div>
          </div>

          {/* Select Distance */}
          <div className="bg-[#0e1932] p-3.5 rounded-xl border border-slate-800">
            <label className="text-xs font-bold text-slate-300 uppercase block mb-2">
              3. Route Distance
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {[5, 10, 15].map(km => (
                <button
                  key={km}
                  onClick={() => setDistanceKm(km)}
                  disabled={isRunning}
                  className={`py-2 px-1 rounded-lg text-xs font-bold text-center transition-all ${
                    distanceKm === km 
                      ? 'bg-emerald-950 border border-emerald-500 text-emerald-300' 
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  {km} km
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Selected: <span className="text-white font-bold">{selectedVehicle}</span> • Traffic: <span className="text-amber-300 font-bold">{trafficDensity}</span> • Distance: <span className="text-emerald-300 font-bold">{distanceKm} km</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={resetSimulation}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold flex items-center space-x-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={startSimulation}
              disabled={isRunning}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center space-x-2 transition-all ${
                isRunning 
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-red-600 via-amber-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white shadow-lg shadow-red-950'
              }`}
            >
              <Play className="w-4 h-4 text-white" />
              <span>{isRunning ? 'SIMULATION IN PROGRESS...' : 'START SIMULATION'}</span>
            </button>
          </div>
        </div>

        {/* 10-Step Visual Flow */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Demonstration Execution Sequence</span>
            <span className="font-mono text-cyan-300 font-bold">{currentStep}/10 Steps Completed</span>
          </div>

          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-300"
              style={{ width: `${(currentStep / 10) * 100}%` }}
            />
          </div>

          {/* Steps List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 max-h-60 overflow-y-auto pr-1">
            {SIMULATION_STEPS.map((step) => {
              const isPast = currentStep >= step.id;
              const isCurrent = currentStep === step.id;

              return (
                <div
                  key={step.id}
                  className={`p-2.5 rounded-lg border text-xs flex items-start space-x-2.5 transition-all ${
                    isCurrent
                      ? 'bg-cyan-950/80 border-cyan-400 glow-cyan ring-1 ring-cyan-400'
                      : isPast
                        ? 'bg-[#0e1a30] border-emerald-700/60 text-slate-200'
                        : 'bg-slate-900/40 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono font-bold ${
                    isCurrent 
                      ? 'bg-cyan-500 text-black animate-pulse' 
                      : isPast 
                        ? 'bg-emerald-500 text-black' 
                        : 'bg-slate-800 text-slate-500'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.id}
                  </div>
                  <div>
                    <h5 className={`font-bold ${isCurrent ? 'text-cyan-300' : isPast ? 'text-white' : 'text-slate-400'}`}>
                      {step.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Final Result Card (Section 35 Requirement) */}
        {isCompleted && (
          <div className="mt-6 p-5 rounded-xl bg-gradient-to-r from-emerald-950 via-[#0c2226] to-[#0d1c2b] border border-emerald-500/70 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-emerald-800/50">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h4 className="text-sm font-black text-white uppercase tracking-wider">
                  SIMULATION COMPLETE — TRAUMA CORRIDOR IMPACT REPORT
                </h4>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-900 text-emerald-300">
                100% SUCCESS
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 text-center">
              <div className="bg-black/40 p-3 rounded-lg border border-slate-800">
                <p className="text-[10px] uppercase font-bold text-slate-400">Normal Highway ETA</p>
                <p className="text-2xl font-black font-mono text-slate-300 mt-1">{normalEta} min</p>
                <p className="text-[10px] text-rose-400 mt-0.5">Heavy congestion delay</p>
              </div>

              <div className="bg-black/40 p-3 rounded-lg border border-cyan-800">
                <p className="text-[10px] uppercase font-bold text-cyan-400">Priority Corridor ETA</p>
                <p className="text-3xl font-black font-mono text-cyan-300 mt-1">{priorityEta} min</p>
                <p className="text-[10px] text-emerald-400 mt-0.5">Zero-stop preemption</p>
              </div>

              <div className="bg-black/40 p-3 rounded-lg border border-emerald-700 glow-emerald">
                <p className="text-[10px] uppercase font-bold text-emerald-300">Life-Critical Time Saved</p>
                <p className="text-3xl font-black font-mono text-emerald-400 mt-1">{timeSaved} min</p>
                <p className="text-[10px] text-emerald-200 mt-0.5">Trauma Survival Window Secured</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
