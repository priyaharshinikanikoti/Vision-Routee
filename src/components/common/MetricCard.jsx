import React from 'react';

export default function MetricCard({ 
  title, 
  value, 
  subtext, 
  icon: Icon, 
  accentColor = 'cyan', 
  trend, 
  onClick, 
  badge,
  isHero = false 
}) {
  const colorMap = {
    cyan: 'border-cyan-800/50 hover:border-cyan-500/70 text-cyan-400 bg-cyan-950/20',
    rose: 'border-rose-800/50 hover:border-rose-500/70 text-rose-400 bg-rose-950/20',
    emerald: 'border-emerald-800/50 hover:border-emerald-500/70 text-emerald-400 bg-emerald-950/20',
    amber: 'border-amber-800/50 hover:border-amber-500/70 text-amber-400 bg-amber-950/20',
    purple: 'border-purple-800/50 hover:border-purple-500/70 text-purple-400 bg-purple-950/20',
    blue: 'border-blue-800/50 hover:border-blue-500/70 text-blue-400 bg-blue-950/20',
  };

  const textGradient = {
    cyan: 'from-white via-cyan-100 to-cyan-400',
    rose: 'from-white via-rose-100 to-rose-400',
    emerald: 'from-white via-emerald-100 to-emerald-400',
    amber: 'from-white via-amber-100 to-amber-400',
    purple: 'from-white via-purple-100 to-purple-400',
    blue: 'from-white via-blue-100 to-blue-400',
  };

  return (
    <div 
      onClick={onClick}
      className={`rounded-xl border bg-[#0b1428]/90 p-4 transition-all duration-200 relative overflow-hidden group shadow-lg ${
        colorMap[accentColor] || colorMap.cyan
      } ${onClick ? 'cursor-pointer hover:scale-[1.02] active:scale-[0.99]' : ''} ${
        isHero ? 'ring-1 ring-rose-500/50 glow-red' : ''
      }`}
    >
      {/* Background soft glow */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-current opacity-5 blur-2xl group-hover:opacity-10 transition-opacity" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            {title}
          </p>
          <div className="flex items-baseline space-x-2">
            <h3 className={`text-2xl sm:text-3xl font-black font-mono tracking-tight bg-gradient-to-r ${textGradient[accentColor]} bg-clip-text text-transparent`}>
              {value}
            </h3>
            {trend && (
              <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                {trend}
              </span>
            )}
          </div>
        </div>

        {Icon && (
          <div className="w-10 h-10 rounded-lg bg-[#0e1b38] border border-cyan-800/40 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/70 pt-2">
        <span className="truncate">{subtext}</span>
        {badge && (
          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800/50 shrink-0 ml-2">
            {badge}
          </span>
        )}
      </div>
    </div>
  );
}
