'use client';

import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';
import { stateColor, MachineState } from '@/lib/utils';

interface Props {
  data: Array<{ rms: number; ts: number }>;
  state: MachineState;
}

export function SparkLine({ data, state }: Props) {
  const color = stateColor(state);
  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        <Line
          type="monotone"
          dataKey="rms"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          isAnimationActive={false}
        />
        <Tooltip
          contentStyle={{ fontSize: 11, padding: '2px 6px' }}
          formatter={(v) => [`${Number(v ?? 0).toFixed(1)} A`, 'Current']}
          labelFormatter={() => ''}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
