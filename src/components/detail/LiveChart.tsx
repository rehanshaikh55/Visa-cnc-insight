'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Label,
} from 'recharts';
import { useFleetStore } from '@/store/fleetStore';
import { stateColor } from '@/lib/utils';

interface Props {
  machineId: string;
}

// Threshold lines (matches stateService thresholds)
const IDLE_THRESHOLD      = 0.5;
const OPERATING_THRESHOLD = 5;

export function LiveChart({ machineId }: Props) {
  const machine = useFleetStore((s) => s.machines[machineId]);

  if (!machine) {
    return (
      <div className="flex items-center justify-center h-48 text-text-secondary text-sm">
        Waiting for data…
      </div>
    );
  }

  const color = stateColor(machine.state);

  // Build data with X = seconds relative to now (newest = 0, oldest = -59)
  const total = machine.history.length;
  const data = machine.history.map((h, i) => ({
    rms: h.rms,
    sec: i - (total - 1), // -59 … 0
  }));

  // Y-axis domain: 0 to max current + 10% headroom, min 10A so threshold lines are visible
  const maxRms = Math.max(...data.map((d) => d.rms), OPERATING_THRESHOLD + 2);
  const yMax   = Math.ceil(maxRms * 1.15);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    const val: number = payload[0].value ?? 0;
    return (
      <div className="bg-white border border-card-border rounded shadow-md px-3 py-2 text-xs">
        <p className="text-text-secondary mb-1">
          <span className="font-medium">{Math.abs(label)}s</span> ago
        </p>
        <p style={{ color }}>
          Current: <span className="font-bold">{val.toFixed(2)} A</span>
        </p>
        <p className="text-text-secondary">
          Power: <span className="font-medium text-text-primary">
            {((val * 415 * Math.sqrt(3)) / 1000).toFixed(2)} kW
          </span>
        </p>
      </div>
    );
  };

  // X-axis tick formatter: show label every 15 seconds
  const xTickFormatter = (v: number) => {
    if (v === 0) return 'Now';
    if (v % 15 === 0) return `${v}s`;
    return '';
  };

  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 16, right: 24, left: 8, bottom: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eaecef" vertical={false} />

        {/* X axis — seconds */}
        <XAxis
          dataKey="sec"
          type="number"
          domain={[-(total - 1), 0]}
          tickCount={9}
          tickFormatter={xTickFormatter}
          tick={{ fontSize: 11, fill: '#636e72' }}
          tickLine={false}
          axisLine={{ stroke: '#dcdde1' }}
        >
          <Label
            value="Time (seconds)"
            position="insideBottom"
            offset={-12}
            style={{ fontSize: 11, fill: '#636e72' }}
          />
        </XAxis>

        {/* Y axis — current in Amps */}
        <YAxis
          domain={[0, yMax]}
          tick={{ fontSize: 11, fill: '#636e72' }}
          tickLine={false}
          axisLine={false}
          width={46}
        >
          <Label
            value="Current (A)"
            angle={-90}
            position="insideLeft"
            offset={14}
            style={{ fontSize: 11, fill: '#636e72' }}
          />
        </YAxis>

        <Tooltip content={<CustomTooltip />} />

        {/* State threshold lines */}
        <ReferenceLine
          y={IDLE_THRESHOLD}
          stroke="#f39c12"
          strokeDasharray="4 3"
          strokeWidth={1.2}
          label={{ value: 'IDLE', position: 'right', fontSize: 10, fill: '#f39c12' }}
        />
        <ReferenceLine
          y={OPERATING_THRESHOLD}
          stroke="#2ecc71"
          strokeDasharray="4 3"
          strokeWidth={1.2}
          label={{ value: 'OPERATING', position: 'right', fontSize: 10, fill: '#2ecc71' }}
        />

        {/* Current line */}
        <Line
          type="monotone"
          dataKey="rms"
          stroke={color}
          strokeWidth={2.5}
          dot={false}
          isAnimationActive={false}
          activeDot={{ r: 4, strokeWidth: 0, fill: color }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
