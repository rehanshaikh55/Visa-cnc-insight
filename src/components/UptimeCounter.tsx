'use client';

import { useEffect, useState } from 'react';
import { formatUptime, MachineState } from '@/lib/utils';

interface Props {
  uptimeSec: number;
  state?: MachineState;
}

export function UptimeCounter({ uptimeSec, state }: Props) {
  const [elapsed, setElapsed] = useState(uptimeSec);

  useEffect(() => {
    setElapsed(uptimeSec);
  }, [uptimeSec]);

  useEffect(() => {
    if (state === 'OFF') return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [state]);

  const display = state === 'OFF' ? 0 : elapsed;
  return <span className="font-mono tabular-nums">{formatUptime(display)}</span>;
}
