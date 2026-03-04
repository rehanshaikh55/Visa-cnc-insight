'use client';

import { MachineState, stateColor } from '@/lib/utils';

interface Props {
  state: MachineState;
}

export function StatusBadge({ state }: Props) {
  const color = stateColor(state);
  const isOperating = state === 'OPERATING';

  return (
    <span className="flex items-center gap-1.5 text-sm font-semibold">
      <span
        className={isOperating ? 'animate-pulse-dot' : ''}
        style={{
          display: 'inline-block',
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
      <span style={{ color }}>{state}</span>
    </span>
  );
}
