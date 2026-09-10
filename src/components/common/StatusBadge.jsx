import React from 'react';

export default function StatusBadge({ status, size = 'sm', pulse = false }) {
  const s = String(status || '').toUpperCase();
  let bg = 'bg-slate-800/80 text-slate-300 border-slate-700';
  let dot = 'bg-slate-400';

  if (s.includes('ONLINE') || s.includes('SAFE') || s.includes('SECURE') || s.includes('NORMAL') || s.includes('RESOLVED') || s.includes('GREEN')) {
    bg = 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60';
    dot = 'bg-emerald-400';
  } else if (s.includes('WARNING') || s.includes('CAUTION') || s.includes('PREPARING') || s.includes('UNDER REVIEW') || s.includes('YELLOW') || s.includes('MODERATE')) {
    bg = 'bg-amber-950/80 text-amber-300 border-amber-700/60';
    dot = 'bg-amber-400';
  } else if (s.includes('CRITICAL') || s.includes('OFFLINE') || s.includes('ROAD CLOSED') || s.includes('RED') || s.includes('OVERLOAD') || s.includes('TAMPER') || s.includes('ALERT') || s.includes('BLOCKED')) {
    bg = 'bg-rose-950/80 text-rose-300 border-rose-700/60';
    dot = 'bg-rose-400';
  } else if (s.includes('ACTIVE') || s.includes('PRIORITY') || s.includes('LOCKED') || s.includes('DISPATCHED')) {
    bg = 'bg-cyan-950/80 text-cyan-300 border-cyan-700/60';
    dot = 'bg-cyan-400';
  }

  const sizeClass = size === 'xs' ? 'text-[9px] px-1.5 py-0.5' : size === 'lg' ? 'text-xs px-3 py-1 font-bold' : 'text-[10px] px-2 py-0.5 font-semibold';

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full border ${bg} ${sizeClass} tracking-wide font-mono`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} ${pulse ? 'animate-ping' : ''}`} />
      <span>{status}</span>
    </span>
  );
}
