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

      {/* Top: image + stats */}
      <div className="flex gap-4 px-4 pt-3 pb-2">
        {/* Citizen L12 CNC thumbnail */}
        <div className="flex-shrink-0 flex items-center justify-center rounded-md overflow-hidden bg-gray-50 border border-card-border"
          style={{ width: 100, height: 72 }}>
          <Image
            src="/machines/section-a.png"
            alt="CNC Machine"
            width={100}
            height={72}
            className="object-contain w-full h-full p-1"
          />
        </div>

        {/* Stats */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <StatusBadge state={machine.state} />
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-text-secondary flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
                {machine.operator}
              </span>
              <span className="text-sm font-bold text-text-primary">M-{machine.id}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-text-secondary">
            <span>
              Power:{' '}
              <span className="text-text-primary font-semibold">
                {machine.powerKw.toFixed(1)} kW
              </span>
            </span>
            <span>
              Cost:{' '}
              <span className="text-text-primary font-semibold">
                {formatCost(machine.costToday)}
              </span>
            </span>
            <span>
              Uptime:{' '}
              <span className="text-text-primary font-semibold">
                <UptimeCounter uptimeSec={machine.uptimeSec} />
              </span>
            </span>
            <span>
              Cycles:{' '}
              <span className="text-text-primary font-semibold">{machine.cycleCount}</span>
            </span>
          </div>
        </div>

        {/* View Graph — top-right */}
        <div className="flex-shrink-0 self-start">
          <Link
            href={`/machines/${machine.id}`}
            className="text-xs px-2 py-1 rounded border border-accent text-accent hover:bg-accent hover:text-white transition-colors whitespace-nowrap"
          >
            View Graph
          </Link>
        </div>
      </div>

      {/* Sparkline — full width */}
      <div className="px-4 pb-2">
        <SparkLine data={machine.history} state={machine.state} />
      </div>
    </div>
  );
}
