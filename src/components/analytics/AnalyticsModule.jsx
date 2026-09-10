import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, Clock, Fuel, ShieldCheck, 
  Activity, Download, CheckCircle2, Zap, ArrowUpRight,
  Siren, TrafficCone, AlertTriangle, Truck, Bus, Cpu, FileSpreadsheet
} from 'lucide-react';
import audio from '../../services/audioService';

export default function AnalyticsModule() {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleExportReport = () => {
    audio.playSuccessChime();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  // 11 Core SIH Performance Indicators requested by user
  const kpiItems = [
    { label: 'Emergency Response Time', value: '8.4 min', change: '-54%', icon: Siren, desc: 'Reduced from 20.2m via Dynamic Green Corridor', color: 'text-rose-400' },
    { label: 'Time Saved (Emergencies)', value: '13 min/run', change: '+32% Lives', icon: Clock, desc: '1,840 hours saved YTD for trauma patients', color: 'text-emerald-400' },
    { label: 'Signals Coordinated', value: '24 Preempted', change: '96% V2I', icon: TrafficCone, desc: 'Coordinated green wave passage through city', color: 'text-amber-400' },
    { label: 'Accidents Handled', value: '03 Triage', change: '-42% Crash', icon: ShieldCheck, desc: 'Acoustic impact detection & rapid patrol response', color: 'text-blue-400' },
    { label: 'Road Hazards Tracked', value: '27 Hazards', change: '8 Fixed Today', icon: AlertTriangle, desc: 'Potholes, floods & railway boom gate telemetry', color: 'text-yellow-400' },
    { label: 'Fleet Utilization', value: '92% On-Route', change: '+14% Turnaround', icon: Truck, desc: 'WIM overload prevention & optimized routing', color: 'text-cyan-300' },
    { label: 'Fuel Saved (City-Wide)', value: '14,280 L', change: '-18.4% Burn', icon: Fuel, desc: 'Reduced stop-and-go idle time at signals', color: 'text-emerald-400' },
    { label: 'Deliveries On-Time', value: '86 Deliveries', change: '92% Precision', icon: Zap, desc: 'Cold-chain pharmaceuticals & e-commerce freight', color: 'text-indigo-400' },
    { label: 'Congestion Reduction', value: '-26% Peak', change: '32% Current', icon: Activity, desc: 'Arterial flow balanced from 58% baseline', color: 'text-amber-300' },
    { label: 'IoT Network Health', value: '98.4% Uptime', change: '248/250 Online', icon: Cpu, desc: 'LiDAR, IMU, ultrasonic & radar edge devices', color: 'text-teal-300' },
    { label: 'Bus Occupancy (Avg)', value: '64% Loaded', change: 'APC 3D ToF', icon: Bus, desc: 'Automated passenger counting avoids overcrowding', color: 'text-purple-300' }
  ];

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="bg-[#0b1428] border border-cyan-800/50 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="p-2.5 bg-cyan-950 border border-cyan-700 rounded-xl text-cyan-400">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-black text-white tracking-wide">
                  TRANSPORTATION & LOGISTICS ANALYTICS
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  SIH 2026 AUDIT BENCHMARK
                </span>
              </div>
              <p className="text-xs text-slate-400">
                11 Core Performance Indicators: Emergency Transit, Coordinated Signals, Road Hazards, Fuel & Congestion
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportReport}
          className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-cyan-950 transition-all active:scale-95"
        >
          <Download className="w-4 h-4" />
          <span>{downloadSuccess ? 'REPORT EXPORTED (PDF/CSV)!' : 'EXPORT AUDIT REPORT'}</span>
        </button>
      </div>

      {/* 11 Hero KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {kpiItems.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-[#091122] border border-slate-800 hover:border-cyan-800/80 p-4 rounded-xl shadow-lg transition-all space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-[#0c162b] border border-slate-800 text-cyan-400">
                    <Icon className="w-4 h-4" />
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase">{kpi.label}</p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {kpi.change}
                </span>
              </div>

              <div className="flex items-baseline space-x-2">
                <h3 className={`text-2xl font-black font-mono ${kpi.color}`}>{kpi.value}</h3>
              </div>

              <p className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 leading-relaxed">
                {kpi.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Emergency Response Time Comparison (Normal vs Priority) */}
        <div className="bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Emergency Response Time: Normal vs Dynamic Green Corridor
              </h3>
              <p className="text-xs text-slate-400">Comparison of transit duration across distances (minutes)</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">54% Avg Reduction</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { distance: '5 km Corridor', normalTime: 18, priorityTime: 8, saved: 10 },
              { distance: '10 km Corridor', normalTime: 32, priorityTime: 14, saved: 18 },
              { distance: '15 km Corridor', normalTime: 46, priorityTime: 21, saved: 25 },
              { distance: '20 km Corridor', normalTime: 62, priorityTime: 29, saved: 33 }
            ].map((row, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white font-bold">{row.distance}</span>
                  <span className="text-slate-400">
                    Normal: <span className="text-rose-400 font-bold">{row.normalTime}m</span> → Priority: <span className="text-cyan-300 font-bold">{row.priorityTime}m</span> (<span className="text-emerald-400 font-bold">Saved {row.saved}m</span>)
                  </span>
                </div>
                {/* Double Bar Graphic */}
                <div className="space-y-1">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-600 rounded-full" style={{ width: `${(row.normalTime / 70) * 100}%` }} />
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(row.priorityTime / 70) * 100}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              <span>Red: Standard Congested Transit</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Green: V2I Coordinated Wave</span>
            </span>
          </div>
        </div>

        {/* Chart 2: Diurnal Hourly City Congestion vs Traffic Speed */}
        <div className="bg-[#091122] border border-cyan-900/60 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Hourly City Congestion vs Traffic Speed Curve
              </h3>
              <p className="text-xs text-slate-400">24-hour urban traffic density & average velocity progression</p>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">AI Load Balanced</span>
          </div>

          <div className="relative h-48 flex items-end justify-between pt-6 px-2 gap-2 border-b border-slate-800">
            {[
              { hour: '06:00', congestion: 18, speed: 52 },
              { hour: '08:00', congestion: 68, speed: 24 },
              { hour: '10:00', congestion: 78, speed: 19 },
              { hour: '12:00', congestion: 44, speed: 38 },
              { hour: '14:00', congestion: 48, speed: 36 },
              { hour: '16:00', congestion: 62, speed: 28 },
              { hour: '18:00', congestion: 84, speed: 16 },
              { hour: '20:00', congestion: 65, speed: 26 },
              { hour: '22:00', congestion: 28, speed: 48 }
            ].map((item, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group">
                <div 
                  className="w-full bg-gradient-to-t from-cyan-900 to-cyan-500 hover:to-cyan-300 rounded-t transition-all relative"
                  style={{ height: `${item.congestion}%` }}
                >
                  <span className="opacity-0 group-hover:opacity-100 absolute -top-6 left-1/2 -translate-x-1/2 bg-black/90 px-1.5 py-0.5 rounded text-[9px] font-mono text-cyan-300 border border-cyan-800 transition-opacity whitespace-nowrap">
                    {item.congestion}% / {item.speed} km/h
                  </span>
                </div>
                <span className="text-[9px] font-mono text-slate-400">{item.hour}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
            <span>Peak Congestion: 18:00 (84%)</span>
            <span>Optimal Flow: 06:00 (18%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
