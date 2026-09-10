import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, Volume2, VolumeX, Clock, ChevronDown, 
  Sparkles, Radio, Activity, AlertOctagon, CheckCircle2, Bot
} from 'lucide-react';
import { USER_ROLES } from '../../data/mockData';
import audio from '../../services/audioService';

export default function Header({ 
  userRole, 
  setUserRole, 
  onOpenSimulationLab, 
  onOpenAICopilot,
  activeEmergenciesCount, 
  soundEnabled, 
  setSoundEnabled,
  onNavigateToModule
}) {
  const [time, setTime] = useState(new Date());
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleSound = () => {
    const nextState = !soundEnabled;
    audio.toggleSound(nextState);
    setSoundEnabled(nextState);
    if (nextState) {
      audio.playSuccessChime();
    }
  };

  const currentRoleObj = USER_ROLES.find(r => r.id === userRole) || USER_ROLES[0];

  return (
    <header className="bg-[#091122] border-b border-cyan-900/40 sticky top-0 z-50 backdrop-blur-md shadow-2xl">
      {/* Top Incident / Emergency Alert Ticker */}
      <div className="bg-gradient-to-r from-red-950/80 via-rose-900/60 to-red-950/80 border-b border-red-500/30 px-4 py-1 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="flex items-center space-x-1.5 text-rose-300 font-semibold uppercase tracking-wider shrink-0 animate-pulse">
            <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
            <span>LIVE CORRIDOR ACTIVE:</span>
          </div>
          <p className="text-slate-200 truncate">
            Ambulance <span className="font-mono text-cyan-300 font-bold">AMB-104</span> on Route to City Central Trauma Hospital • <span className="text-emerald-300 font-semibold">Signals 01-04 Preempted (13m Saved)</span> • Flooded Underpass at Civil Lines <span className="text-rose-300 font-semibold">CLOSED</span>
          </p>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-[11px] text-slate-300 shrink-0 pl-4">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-mono text-emerald-300">V2X MESH ONLINE</span>
          </span>
          <span className="text-slate-600">|</span>
          <span className="font-mono text-cyan-300">GROQ AI ACTIVE</span>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Name & Tagline */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigateToModule('overview')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/25 border border-cyan-300/40 relative group">
            <ShieldAlert className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-extrabold tracking-wider bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
                SMART TRANSIT COMMAND
              </h1>
              <span className="hidden lg:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-950/80 text-cyan-300 border border-cyan-800/60">
                SIH 2026
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide hidden sm:block">
              Connected Intelligence for Safer, Faster and Smarter Transportation
            </p>
          </div>
        </div>

        {/* Center Actions: Groq AI Copilot & Simulation Lab Launch */}
        <div className="hidden lg:flex items-center space-x-2.5">
          <button
            onClick={onOpenAICopilot}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-700 via-blue-700 to-cyan-600 hover:from-cyan-600 hover:to-blue-600 text-white text-xs font-bold shadow-lg shadow-cyan-950/50 border border-cyan-400/40 transition-all transform hover:scale-105 active:scale-95"
            title="Launch Groq AI Autonomous Assistant"
          >
            <Bot className="w-4 h-4 text-cyan-200" />
            <span>GROQ AI COPILOT</span>
            <span className="px-1.5 py-0.2 rounded bg-black/40 text-[9px] font-mono text-cyan-300">ONLINE</span>
          </button>

          <button
            onClick={onOpenSimulationLab}
            className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-rose-600 via-red-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold shadow-lg shadow-red-900/40 border border-red-400/40 transition-all transform hover:scale-105 active:scale-95"
            title="Launch Interactive Step-by-Step SIH Demonstration Lab"
          >
            <Sparkles className="w-4 h-4 text-amber-200 animate-spin" style={{ animationDuration: '8s' }} />
            <span>EMERGENCY SIMULATION LAB</span>
            <span className="px-1.5 py-0.5 bg-black/40 rounded text-[10px] font-mono text-amber-300">DEMO</span>
          </button>
        </div>

        {/* Right Section: Role Selector, Sound Toggle & Real-time Clock */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* User Mode Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-[#111c34] hover:bg-[#172647] border border-cyan-800/50 text-xs text-slate-200 transition-all shadow-inner"
            >
              <div className="flex flex-col text-left">
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold">User Role</span>
                <span className={`font-bold text-[12px] ${currentRoleObj.color}`}>
                  {currentRoleObj.name}
                </span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#0d172e] border border-cyan-700/60 shadow-2xl py-2 z-50 backdrop-blur-xl animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 border-b border-cyan-900/50 mb-1">
                  <p className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold">Switch User Mode</p>
                  <p className="text-[10px] text-slate-400">Tailors dashboard panels & permissions</p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {USER_ROLES.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => {
                        setUserRole(r.id);
                        setRoleDropdownOpen(false);
                        audio.playSuccessChime();
                      }}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-cyan-950/60 transition-colors text-xs ${
                        userRole === r.id ? 'bg-cyan-950/90 text-cyan-300 font-bold border-l-2 border-cyan-400' : 'text-slate-300'
                      }`}
                    >
                      <div>
                        <p className={r.color}>{r.name}</p>
                        <p className="text-[10px] text-slate-400 font-normal">{r.badge}</p>
                      </div>
                      {userRole === r.id && <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-lg border text-xs transition-all ${
              soundEnabled 
                ? 'bg-cyan-950/80 border-cyan-700/70 text-cyan-300 hover:bg-cyan-900' 
                : 'bg-slate-900/80 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={soundEnabled ? "Sound Alert Effects Enabled" : "Sound Muted"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Clock */}
          <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-[#0d162b] border border-cyan-900/40 text-xs font-mono text-cyan-200">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{time.toLocaleTimeString()}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
