'use client';

import { useEffect, useState } from 'react';
import { formatUptime } from '@/lib/utils';

interface Props {
  uptimeSec: number;
}

export function UptimeCounter({ uptimeSec }: Props) {
  const [elapsed, setElapsed] = useState(uptimeSec);

  useEffect(() => {
    setElapsed(uptimeSec);
  }, [uptimeSec]);

  useEffect(() => {
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return <span className="font-mono tabular-nums">{formatUptime(elapsed)}</span>;
}
