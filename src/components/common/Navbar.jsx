import React from 'react';
import { 
  LayoutDashboard, Map, Siren, TrafficCone, AlertTriangle, 
  Truck, Navigation, Bus, Cpu, Network, Radio, BarChart3,
  ShieldCheck, Box 
} from 'lucide-react';
import { PRIMARY_MODULES } from '../../data/mockData';

const iconMap = {
  LayoutDashboard,
  Map,
  Siren,
  TrafficCone,
  AlertTriangle,
  Truck,
  ShieldCheck,
  Box,
  Navigation,
  Bus,
  Cpu,
  Network,
  Radio,
  BarChart3
};

export default function Navbar({ activeModule, setActiveModule, userRole }) {
  return (
    <nav className="bg-[#0b1428] border-b border-cyan-900/40 px-3 sm:px-6 py-2 overflow-x-auto shadow-md">
      <div className="flex items-center space-x-1 sm:space-x-2 min-w-max">
        {PRIMARY_MODULES.map((mod) => {
          const Icon = iconMap[mod.icon] || LayoutDashboard;
          const isActive = activeModule === mod.id;
          const isHero = mod.hero;

          return (
            <button
              key={mod.id}
              onClick={() => setActiveModule(mod.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-150 relative ${
                isActive
                  ? isHero
                    ? 'bg-rose-950/80 text-rose-200 border border-rose-500/70 shadow-lg shadow-rose-950/60 font-bold'
                    : 'bg-cyan-950/80 text-cyan-200 border border-cyan-500/60 shadow-lg shadow-cyan-950/60 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#111e3b] border border-transparent'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? (isHero ? 'text-rose-400' : 'text-cyan-400') : 'text-slate-400'}`} />
              <span>{mod.name}</span>
              
              {/* Badge */}
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-mono ${
                isActive
                  ? isHero 
                    ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' 
                    : 'bg-cyan-500/30 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {mod.badge}
              </span>

              {/* Active Bottom Glow Indicator */}
              {isActive && (
                <span className={`absolute bottom-0 left-2 right-2 h-0.5 rounded-full ${
                  isHero ? 'bg-rose-500 shadow-rose-400 shadow' : 'bg-cyan-400 shadow-cyan-400 shadow'
                }`} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
