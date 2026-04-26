'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAggregates } from '@/hooks/useApi';
import { formatCost } from '@/lib/utils';

interface Props {
  machineId: string;
}

// Mock 7-day data for when API is unavailable
function mockHistory(id: string) {
  const energyData = [48, 37.5, 40, 23.65, 10, 16, 0.1];   // kWh (fixed)
  const cyclesData = [80, 45, 120, 71, 18, 48, 2];   // cycles (fixed)
  const costData = [520, 580, 540, 600, 640, 620, 660]; // INR (optional fixed)

  const days = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    const index = 6 - i; // ensures correct mapping from oldest → newest

    days.push({
      date: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      energyKwh: energyData[index],
      costInr: costData[index],
      cycles: cyclesData[index],
    });
  }

  return days;
}
export function HistoryChart({ machineId }: Props) {
  const { data, error } = useAggregates(machineId, 7);
  const isMock = process.env.NEXT_PUBLIC_MOCK === 'true';

  const chartData = isMock || error || !data
    ? mockHistory(machineId)
    : (data as any[]).map((row: any) => ({
      date: new Date(row.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      energyKwh: parseFloat(row.energy_kwh || 0),
      costInr: parseFloat(row.cost_inr || 0),
      cycles: parseInt(row.cycle_count || 0),
    }));

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={chartData} margin={{ top: 8, right: 16, left: 0, bottom: 4 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#dcdde1" />
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#636e72' }} tickLine={false} />
        <YAxis yAxisId="left" tick={{ fontSize: 10, fill: '#636e72' }} tickLine={false} axisLine={false} unit=" kWh" width={50} />
        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#636e72' }} tickLine={false} axisLine={false} unit=" cyc" width={40} />
        <Tooltip
          contentStyle={{ fontSize: 12 }}
          formatter={(v, name) => {
            const n = v == null ? 0 : typeof v === 'number' ? v : parseFloat(String(v));
            if (name === 'energyKwh') return [`${n.toFixed(1)} kWh`, 'Energy'];
            if (name === 'costInr') return [formatCost(n), 'Cost'];
            return [n, 'Cycles'];
          }}
        />
        <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
        <Bar yAxisId="left" dataKey="energyKwh" fill="#0a3d62" name="energyKwh" radius={[2, 2, 0, 0]} />
        <Bar yAxisId="right" dataKey="cycles" fill="#2ecc71" name="cycles" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
