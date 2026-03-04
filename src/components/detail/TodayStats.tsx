'use client';

import { useFleetStore } from '@/store/fleetStore';
import { formatCost, formatUptime } from '@/lib/utils';
import { UptimeCounter } from '@/components/UptimeCounter';

interface Props {
  machineId: string;
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-card rounded-lg border border-card-border p-4 flex flex-col gap-1 shadow-sm">
      <div className="text-xl font-bold text-text-primary">{value}</div>
      <div className="text-xs text-text-secondary uppercase tracking-wider">{label}</div>
    </div>
  );
}

export function TodayStats({ machineId }: Props) {
  const machine = useFleetStore((s) => s.machines[machineId]);

  if (!machine) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <StatCard label="Power" value={`${machine.powerKw.toFixed(1)} kW`} />
      <StatCard label="Cost Today" value={formatCost(machine.costToday)} />
      <StatCard label="Cycles" value={machine.cycleCount} />
      <StatCard
        label="Uptime"
        value={<UptimeCounter uptimeSec={machine.uptimeSec} />}
      />
    </div>
  );
}
