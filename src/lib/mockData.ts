import { MachineSnapshot } from '@/store/fleetStore';
import { calcPower } from './utils';

const MACHINE_IDS = Array.from({ length: 16 }, (_, i) =>
  String(i + 1).padStart(2, '0')
);

const STATES = ['OFF', 'IDLE', 'OPERATING'] as const;
const OPERATORS = ['Salman', 'Rohan'];

// Only these machines start ON (OPERATING). All others are OFF.
const ON_MACHINES = new Set(['01', '13']);

function initialState(id: string): (typeof STATES)[number] {
  return ON_MACHINES.has(id) ? 'OPERATING' : 'OFF';
}

// Fixed random assignment per machine ID (stable across ticks)
const OPERATOR_MAP: Record<string, string> = Object.fromEntries(
  MACHINE_IDS.map((id) => [id, OPERATORS[Math.floor(Math.random() * OPERATORS.length)]])
);

function randomRms(state: string): number {
  if (state === 'OFF') return 0;
  if (state === 'IDLE') return 1.5 + Math.random() * 1.5;   // ~1.5–3 A
  return 15 + Math.random() * 5;                             // ~15–20 A
}

// State-specific clamp so drift stays within a believable band
function clampRms(state: string, rms: number): number {
  if (state === 'OFF') return 0;
  if (state === 'IDLE') return Math.min(3.5, Math.max(0.8, rms));
  return Math.min(22, Math.max(12, rms));
}

function makeHistory(rms: number, state: string): { rms: number; ts: number }[] {
  const now = Date.now();
  // Walk backward from `rms` with small ±0.2 A steps so past history is smooth
  const out: { rms: number; ts: number }[] = [];
  let v = rms;
  for (let i = 59; i >= 0; i--) {
    out.unshift({
      rms: state === 'OFF' ? 0 : v,
      ts: now - i * 1000,
    });
    v = clampRms(state, v + (Math.random() - 0.5) * 0.4);
  }
  return out;
}

export function generateMockMachines(): Record<string, MachineSnapshot> {
  const machines: Record<string, MachineSnapshot> = {};
  for (const id of MACHINE_IDS) {
    const state = initialState(id);
    const rms = randomRms(state);
    const powerKw = calcPower(rms);
    // On load, ON machines start with 15–20 minutes of uptime
    const uptimeSec = state === 'OFF' ? 0 : 900 + Math.floor(Math.random() * 301);
    const cycleCount = Math.floor(Math.random() * 40);
    const energyKwh = powerKw * (uptimeSec / 3600);
    machines[id] = {
      id,
      rms,
      state,
      powerKw,
      costToday: energyKwh * 7.0,
      energyKwh,
      cycleCount,
      uptimeSec,
      lastUpdated: Date.now(),
      history: makeHistory(rms, state),
      operator: OPERATOR_MAP[id],
    };
  }
  return machines;
}

export function tickMock(machines: Record<string, MachineSnapshot>): Record<string, MachineSnapshot> {
  const updated = { ...machines };
  for (const id of Object.keys(updated)) {
    const m = { ...updated[id] };
    // Gentle drift: ±0.2 A per second, clamped to the state's band
    m.rms = m.state === 'OFF'
      ? 0
      : clampRms(m.state, m.rms + (Math.random() - 0.5) * 0.4);
    m.powerKw = calcPower(m.rms);
    if (m.state !== 'OFF') {
      m.uptimeSec += 1;
    }
    const energyIncrement = m.powerKw * (1 / 3600);
    m.energyKwh += energyIncrement;
    m.costToday += energyIncrement * 7.0;
    m.lastUpdated = Date.now();
    m.history = [
      ...m.history.slice(-59),
      { rms: m.rms, ts: Date.now() },
    ];
    m.operator = OPERATOR_MAP[id];
    updated[id] = m;
  }
  return updated;
}
