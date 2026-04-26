import { MachineSnapshot } from '@/store/fleetStore';
import { calcPower } from './utils';

const MACHINE_IDS = Array.from({ length: 16 }, (_, i) =>
  String(i + 1).padStart(2, '0')
);

const STATES = ['OFF', 'IDLE', 'OPERATING'] as const;
const OPERATORS = ['Salman', 'Rohan'];

// Only these machines start ON (OPERATING). All others are OFF.
const ON_MACHINES = new Set(['00', '00']);

function initialState(id: string): (typeof STATES)[number] {
  return ON_MACHINES.has(id) ? 'OPERATING' : 'OFF';
}

// Fixed random assignment per machine ID (stable across ticks)
const OPERATOR_MAP: Record<string, string> = Object.fromEntries(
  MACHINE_IDS.map((id) => [id, OPERATORS[Math.floor(Math.random() * OPERATORS.length)]])
);

function randomRms(state: string): number {
  if (state === 'OFF') return 0;
  if (state === 'IDLE') return 5 + Math.random() * 10;   // 5–15
  return 10 + Math.random() * 40;                        // 10–50
}

// State-specific clamp so drift stays within a believable band
function clampRms(state: string, rms: number): number {
  if (state === 'OFF') return 0;
  if (state === 'IDLE') return Math.min(20, Math.max(5, rms));
  return Math.min(50, Math.max(10, rms));
}
function makeHistory(rms: number, state: string): { rms: number; ts: number }[] {
  const now = Date.now();
  const out: { rms: number; ts: number }[] = [];
  let v = rms;

  for (let i = 59; i >= 0; i--) {
    out.unshift({
      rms: state === 'OFF' ? 0 : v,
      ts: now - i * 1000,
    });

    // smooth fluctuation
    v = clampRms(state, v + (Math.random() - 0.5) * 4); // ±2
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
    const target = 10 + Math.random() * 40; // random target between 10–50

    m.rms = m.state === 'OFF'
      ? 0
      : clampRms(
        m.state,
        m.rms
        + (target - m.rms) * 0.4      // pulls toward new value (big movement)
        + (Math.random() - 0.5) * 6   // extra randomness
      );
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