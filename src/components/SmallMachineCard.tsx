'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MachineSnapshot } from '@/store/fleetStore';
import { StatusBadge } from './StatusBadge';
import { UptimeCounter } from './UptimeCounter';
import { SparkLine } from './SparkLine';
import { stateBorderClass, formatCost } from '@/lib/utils';

interface Props {
  machine: MachineSnapshot;
}

export function SmallMachineCard({ machine }: Props) {
  const borderClass = stateBorderClass(machine.state);

  return (
    <div className={`card-hover bg-card rounded-lg shadow-sm border border-card-border ${borderClass} w-full`}>

      {/* Top: image + stats + view button */}
      <div className="flex gap-3 px-3 pt-3 pb-2">
        {/* Machine thumbnail — hidden on very small screens */}
        <div className="hidden xs:flex flex-shrink-0 items-center justify-center rounded-md overflow-hidden bg-gray-50 border border-card-border"
          style={{ width: 80, height: 62 }}>
          <Image
            src="/machines/section-a.png"
            alt="CNC Machine"
            width={80}
            height={62}
            className="object-contain w-full h-full p-1"
          />
        </div>

        {/* Stats */}
        <div className="flex-1 min-w-0">
          {/* Header row */}
          <div className="flex items-center justify-between mb-1.5 gap-2">
            <StatusBadge state={machine.state} />
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <span className="text-[11px] text-text-secondary flex items-center gap-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                {machine.operator}
              </span>
              <span className="text-sm font-bold text-text-primary">M-{machine.id}</span>
            </div>
          </div>

          {/* Stats grid — 2 cols */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-xs text-text-secondary">
            <span>Power: <span className="text-text-primary font-semibold">{machine.powerKw.toFixed(1)} kW</span></span>
            <span>Cost: <span className="text-text-primary font-semibold">{formatCost(machine.costToday)}</span></span>
            <span>Uptime: <span className="text-text-primary font-semibold"><UptimeCounter uptimeSec={machine.uptimeSec} /></span></span>
            <span>Cycles: <span className="text-text-primary font-semibold">{machine.cycleCount}</span></span>
          </div>
        </div>

        {/* View Graph button */}
        <div className="flex-shrink-0 self-start">
          <Link
            href={`/machines/${machine.id}`}
            className="text-xs px-2 py-1 rounded border border-accent text-accent hover:bg-accent hover:text-white transition-colors whitespace-nowrap"
          >
            View
          </Link>
        </div>
      </div>

      {/* Sparkline */}
      <div className="px-3 pb-2">
        <SparkLine data={machine.history} state={machine.state} />
      </div>
    </div>
  );
}
