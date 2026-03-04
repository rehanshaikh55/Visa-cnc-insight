import { MachineSnapshot } from '@/store/fleetStore';
import { calcPower } from './utils';

const MACHINE_IDS = Array.from({ length: 16 }, (_, i) =>
  String(i + 1).padStart(2, '0')
);

const STATES = ['OFF', 'IDLE', 'OPERATING'] as const;
const OPERATORS = ['Salman', 'Rohan'];

// Fixed random assignment per machine ID (stable across ticks)
const OPERATOR_MAP: Record<string, string> = Object.fromEntries(
  MACHINE_IDS.map((id) => [id, OPERATORS[Math.floor(Math.random() * OPERATORS.length)]])
);

function randomRms(state: string): number {
  if (state === 'OFF') return Math.random() * 0.4;
  if (state === 'IDLE') return 0.5 + Math.random() * 4;
  return 5 + Math.random() * 25;
}

function makeHistory(rms: number): { rms: number; ts: number }[] {
  const now = Date.now();
  return Array.from({ length: 60 }, (_, i) => ({
    rms: Math.max(0, rms + (Math.random() - 0.5) * 2),
    ts: now - (59 - i) * 1000,
  }));
}

export function generateMockMachines(): Record<string, MachineSnapshot> {
  const machines: Record<string, MachineSnapshot> = {};
  for (const id of MACHINE_IDS) {
    const state = STATES[Math.floor(Math.random() * 3)];
    const rms = randomRms(state);
    const powerKw = calcPower(rms);
    const uptimeSec = state === 'OFF' ? 0 : Math.floor(Math.random() * 28800);
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
      history: makeHistory(rms),
      operator: OPERATOR_MAP[id],
    };
  }
  return machines;
}

export function tickMock(machines: Record<string, MachineSnapshot>): Record<string, MachineSnapshot> {
  const updated = { ...machines };
  for (const id of Object.keys(updated)) {
    const m = { ...updated[id] };
    // Randomly change state 2% of the time
    if (Math.random() < 0.02) {
      m.state = STATES[Math.floor(Math.random() * 3)];
    }
    m.rms = Math.max(0, randomRms(m.state) * 0.8 + m.rms * 0.2);
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
