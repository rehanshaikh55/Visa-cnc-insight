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

export function LargeMachineCard({ machine }: Props) {
  const borderClass = stateBorderClass(machine.state);

  return (
    <div className={`card-hover bg-card rounded-lg shadow-sm border border-card-border ${borderClass} w-full`}>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-card-border">
        <div className="flex items-center gap-3">
          <StatusBadge state={machine.state} />
          <span className="text-sm font-bold text-text-primary">M-{machine.id}</span>
          <span className="text-[11px] text-text-secondary flex items-center gap-1">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            {machine.operator}
          </span>
        </div>
        <Link
          href={`/machines/${machine.id}`}
          className="text-xs px-2 py-1 rounded border border-accent text-accent hover:bg-accent hover:text-white transition-colors"
        >
          View Graph
        </Link>
      </div>

      {/* Body: machine image + stats side by side */}
      <div className="flex gap-4 px-4 py-3 border-b border-card-border">
        {/* VMC MV 1600H image */}
        <div className="flex-shrink-0 flex items-center justify-center rounded-md overflow-hidden bg-gray-50 border border-card-border"
          style={{ width: 140, height: 100 }}>
          <Image
            src="/machines/section-b.png"
            alt="VMC Machine"
            width={140}
            height={100}
            className="object-contain w-full h-full p-1"
          />
        </div>

        {/* Stats: 2×2 grid filling remaining width */}
        <div className="flex-1 grid grid-cols-2 gap-x-6 gap-y-2 content-center">
          <div>
            <div className="text-lg font-bold text-text-primary leading-tight">
              {machine.powerKw.toFixed(1)} kW
            </div>
            <div className="text-xs text-text-secondary">Power</div>
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary leading-tight">
              {formatCost(machine.costToday)}
            </div>
            <div className="text-xs text-text-secondary">Cost Today</div>
          </div>
          <div>
            <div className="text-lg font-bold text-text-primary leading-tight">
              {machine.cycleCount}
            </div>
            <div className="text-xs text-text-secondary">Cycles</div>
          </div>
          <div>
            <div className="text-base font-bold text-text-primary leading-tight font-mono tabular-nums">
              <UptimeCounter uptimeSec={machine.uptimeSec} />
            </div>
            <div className="text-xs text-text-secondary">Uptime</div>
          </div>
        </div>
      </div>

      {/* Sparkline — full width */}
      <div className="px-4 py-2">
        <SparkLine data={machine.history} state={machine.state} />
      </div>
    </div>
  );
}
