'use client';

import { useFleetStore } from '@/store/fleetStore';
import { SmallMachineCard } from './SmallMachineCard';
import { LargeMachineCard } from './LargeMachineCard';
import { MachineSnapshot } from '@/store/fleetStore'; 

function PlaceholderCard({ id }: { id: string }) {
  return (
    <div className="w-full bg-card rounded-lg border border-card-border border-l-4 border-l-gray-300 p-3 opacity-50 animate-pulse">
      <div className="text-xs text-text-secondary">M-{id} — loading…</div>
    </div>
  );
}

function Small({ id, machines }: { id: string; machines: Record<string, MachineSnapshot> }) {
  const m = machines[id];
  return m ? <SmallMachineCard machine={m} /> : <PlaceholderCard id={id} />;
}

function Large({ id, machines }: { id: string; machines: Record<string, MachineSnapshot> }) {
  const m = machines[id];
  return m ? <LargeMachineCard machine={m} /> : <PlaceholderCard id={id} />;
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 py-1">
      <div className="flex-1 border-t border-dashed border-card-border" />
      <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-widest whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 border-t border-dashed border-card-border" />
    </div>
  );
}

export function FactoryFloor() {
  const machines = useFleetStore((s) => s.machines);

  return (
    <div className="flex w-full min-h-0 gap-5 p-5">

      {/* ── SECTION A (50%) ── */}
      <div className="flex flex-col gap-3 w-1/2">
        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">
          Section A
        </p>

        {/* Small cards M-01..M-07 */}
        <Small id="01" machines={machines} />
        <Small id="02" machines={machines} />
        <Small id="03" machines={machines} />
        <Small id="04" machines={machines} />
        <Small id="05" machines={machines} />
        <Small id="06" machines={machines} />
        <Small id="07" machines={machines} />

        {/* Large card M-08 */}
        <SectionDivider label="CNC-08" />
        <Large id="08" machines={machines} />
      </div>

      {/* ── SECTION B (50%) ── */}
      <div className="flex flex-col gap-3 w-1/2">
        <p className="text-xs font-bold text-text-secondary uppercase tracking-widest px-1">
          Section B
        </p>

        {/* Group 1: M-13..M-16 */}
        <Large id="13" machines={machines} />
        <Large id="14" machines={machines} />
        <Large id="15" machines={machines} />
        <Large id="16" machines={machines} />

        {/* Gap between groups */}
        <div className="py-3">
          <SectionDivider label="next line" />
        </div>

        {/* Group 2: M-09..M-12 */}
        <Large id="09" machines={machines} />
        <Large id="10" machines={machines} />
        <Large id="11" machines={machines} />
        <Large id="12" machines={machines} />
      </div>

    </div>
  );
}
