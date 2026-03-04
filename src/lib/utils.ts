export type MachineState = 'OFF' | 'IDLE' | 'OPERATING';

export function formatUptime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export function formatCost(cost: number): string {
  return `₹ ${Math.round(cost).toLocaleString('en-IN')}`;
}

export function stateColor(state: MachineState): string {
  switch (state) {
    case 'OPERATING': return '#2ecc71';
    case 'IDLE':      return '#f39c12';
    case 'OFF':       return '#e74c3c';
  }
}

export function stateBorderClass(state: MachineState): string {
  switch (state) {
    case 'OPERATING': return 'border-l-[4px] border-l-operating';
    case 'IDLE':      return 'border-l-[4px] border-l-idle';
    case 'OFF':       return 'border-l-[4px] border-l-off';
  }
}

export function calcPower(rms: number): number {
  return (rms * 415 * Math.sqrt(3)) / 1000;
}

export function stateBg(state: MachineState): string {
  switch (state) {
    case 'OPERATING': return 'bg-operating';
    case 'IDLE':      return 'bg-idle';
    case 'OFF':       return 'bg-off';
  }
}
