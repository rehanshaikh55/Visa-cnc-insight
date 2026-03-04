'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useFleetStore } from '@/store/fleetStore';
import { useMachineSocket } from '@/hooks/useMachineSocket';
import { AuthGuard } from '@/components/AuthGuard';
import { StatusBadge } from '@/components/StatusBadge';
import { UptimeCounter } from '@/components/UptimeCounter';
import { LiveChart } from '@/components/detail/LiveChart';
import { HistoryChart } from '@/components/detail/HistoryChart';
import { formatCost, stateColor } from '@/lib/utils';

interface Props {
  params: { id: string };
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-card-border last:border-0">
      <span className="text-xs text-text-secondary w-28 flex-shrink-0">{label}</span>
      <span className="text-sm font-semibold text-text-primary">{value}</span>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent?: string;
}) {
  return (
    <div
      className="bg-card rounded-lg border border-card-border shadow-sm p-4 flex flex-col gap-0.5"
      style={accent ? { borderTop: `3px solid ${accent}` } : {}}
    >
      <div className="text-2xl font-bold text-text-primary tabular-nums">{value}</div>
      {sub && <div className="text-xs text-text-secondary">{sub}</div>}
      <div className="text-xs text-text-secondary uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function DetailContent({ id }: { id: string }) {
  useMachineSocket();

  const machine = useFleetStore((s) => s.machines[id]);

  // Section A: M-01..M-08 → Citizen L12; Section B: M-09..M-16 → VMC MV 1600H
  const numId = parseInt(id, 10);
  const isSectionA   = numId <= 8;
  const machineImage = isSectionA ? '/machines/section-a.png' : '/machines/section-b.png';
  const machineType  = isSectionA ? 'Citizen L12 CNC' : 'VMC MV 1600H';
  const sectionLabel = isSectionA ? 'Section A' : 'Section B';

  const stateAccent = machine ? stateColor(machine.state) : '#dcdde1';

  return (
    <div className="flex flex-col min-h-screen bg-surface">

      {/* ── Top bar ── */}
      <div className="flex items-center gap-4 px-6 py-3 shadow-md" style={{ backgroundColor: '#0a3d62' }}>
        <Link
          href="/"
          className="flex items-center gap-1 text-white opacity-80 hover:opacity-100 text-sm transition-opacity"
        >
          <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </Link>
        <div className="h-4 w-px bg-white opacity-30" />
        <span className="text-white font-bold">M-{id} — {machineType}</span>
        {machine && <div className="ml-1"><StatusBadge state={machine.state} /></div>}
        <div className="flex-1" />
        {machine && (
          <span className="text-white text-xs opacity-70">
            Operator: <span className="font-semibold opacity-100">{machine.operator}</span>
          </span>
        )}
      </div>

      <main className="flex-1 p-6 flex flex-col gap-5 max-w-6xl mx-auto w-full">

        {/* ── Machine info + stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Machine info card */}
          <div className="bg-card rounded-lg border border-card-border shadow-sm p-4 flex gap-4 md:col-span-1">
            {/* Image */}
            <div className="flex-shrink-0 flex items-start justify-center rounded-md overflow-hidden bg-gray-50 border border-card-border"
              style={{ width: 110, height: 90 }}>
              <Image
                src={machineImage}
                alt={machineType}
                width={110}
                height={90}
                className="object-contain w-full h-full p-1"
              />
            </div>

            {/* Detail rows */}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                Machine Info
              </p>
              <InfoRow label="Machine ID"  value={`M-${id}`} />
              <InfoRow label="Type"        value={machineType} />
              <InfoRow label="Section"     value={sectionLabel} />
              <InfoRow label="Operator"    value={machine?.operator ?? '—'} />
              <InfoRow label="Status"      value={machine ? <StatusBadge state={machine.state} /> : '—'} />
              <InfoRow label="RMS Current" value={machine ? `${machine.rms.toFixed(2)} A` : '—'} />
            </div>
          </div>

          {/* 4 stat cards */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4 content-start">
            <StatCard
              label="Live Power"
              value={machine ? `${machine.powerKw.toFixed(1)} kW` : '—'}
              sub="3-phase @ 415V"
              accent={stateAccent}
            />
            <StatCard
              label="Cost Today"
              value={machine ? formatCost(machine.costToday) : '—'}
              sub={`${machine?.energyKwh.toFixed(2) ?? '0'} kWh`}
              accent="#0a3d62"
            />
            <StatCard
              label="Cycles"
              value={machine?.cycleCount ?? '—'}
              sub="today"
              accent="#636e72"
            />
            <StatCard
              label="Uptime"
              value={machine ? <UptimeCounter uptimeSec={machine.uptimeSec} /> : '—'}
              sub="HH : MM : SS"
              accent="#636e72"
            />
          </div>
        </div>

        {/* ── Live Current Chart ── */}
        <div className="bg-card rounded-lg border border-card-border shadow-sm p-5">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h2 className="text-sm font-bold text-text-primary">Live Current — Last 60 Seconds</h2>
              <p className="text-xs text-text-secondary mt-0.5">
                X axis: time in seconds · Y axis: RMS current (A) · Dashed lines = state thresholds
              </p>
            </div>
            {machine && (
              <div className="text-right">
                <div className="text-2xl font-bold tabular-nums" style={{ color: stateAccent }}>
                  {machine.rms.toFixed(2)} A
                </div>
                <div className="text-xs text-text-secondary">current reading</div>
              </div>
            )}
          </div>
          <LiveChart machineId={id} />
        </div>

        {/* ── 7-day History ── */}
        <div className="bg-card rounded-lg border border-card-border shadow-sm p-5">
          <h2 className="text-sm font-bold text-text-primary mb-0.5">Energy &amp; Cycles — Last 7 Days</h2>
          <p className="text-xs text-text-secondary mb-3">Daily energy consumption (kWh) and cycle count</p>
          <HistoryChart machineId={id} />
        </div>

      </main>
    </div>
  );
}

export default function MachineDetailPage({ params }: Props) {
  return (
    <AuthGuard>
      <DetailContent id={params.id} />
    </AuthGuard>
  );
}
