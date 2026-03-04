'use client';

import { useRouter } from 'next/navigation';
import { useFleetStore } from '@/store/fleetStore';
import { formatCost } from '@/lib/utils';
import { logout } from '@/lib/auth';

export function Header() {
  const router   = useRouter();
  const machines = useFleetStore((s) => s.machines);

  function handleLogout() {
    logout();
    router.replace('/login');
  }

  const list      = Object.values(machines);
  const operating = list.filter((m) => m.state === 'OPERATING').length;
  const idle      = list.filter((m) => m.state === 'IDLE').length;
  const off       = list.filter((m) => m.state === 'OFF').length;
  const totalKw   = list.reduce((sum, m) => sum + m.powerKw, 0);
  const totalCost = list.reduce((sum, m) => sum + m.costToday, 0);

  return (
    <header className="shadow-md" style={{ backgroundColor: '#0a3d62' }}>
      {/* Row 1 — logo + logout */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white"
            strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" />
            <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
            <line x1="12" y1="12" x2="12" y2="16" />
            <line x1="10" y1="14" x2="14" y2="14" />
          </svg>
          <span className="text-white font-bold tracking-wide text-base sm:text-lg">
            VISA CNC INSIGHTS
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white border border-white/20 hover:border-white/50 rounded px-2.5 py-1.5 transition-all"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>

      {/* Row 2 — state badges + power/cost */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pb-2.5 border-t border-white/10 pt-2">
        {/* State badges */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1.5 text-white">
            <span className="inline-block w-2 h-2 rounded-full bg-operating animate-pulse-dot flex-shrink-0" />
            <span className="opacity-90">{operating} Operating</span>
          </span>
          <span className="flex items-center gap-1.5 text-white">
            <span className="inline-block w-2 h-2 rounded-full bg-idle flex-shrink-0" />
            <span className="opacity-90">{idle} Idle</span>
          </span>
          <span className="flex items-center gap-1.5 text-white">
            <span className="inline-block w-2 h-2 rounded-full bg-off flex-shrink-0" />
            <span className="opacity-90">{off} Off</span>
          </span>
        </div>

        {/* Power + cost */}
        <div className="text-xs text-white/80 font-mono">
          <strong className="text-white">{totalKw.toFixed(1)} kW</strong>
          <span className="mx-1.5 opacity-40">|</span>
          <strong className="text-white">{formatCost(totalCost)}</strong>
          <span className="text-white/50 ml-1 hidden sm:inline">today</span>
        </div>
      </div>
    </header>
  );
}
