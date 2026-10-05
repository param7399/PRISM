import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { MonthlyReadinessPoint } from '../../types';

interface ReadinessChartProps {
  data: MonthlyReadinessPoint[];
  target: number;
}

export const ReadinessChart: React.FC<ReadinessChartProps> = ({ data, target }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 16, right: 20, left: 0, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="month"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#cbd5e1' }}
            tickLine={false}
          />
          <YAxis
            domain={[30, 100]}
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            unit="%"
          />
          <Tooltip
            formatter={(value) => [`${value ?? 0}%`, 'Readiness']}
            contentStyle={{
              backgroundColor: '#ffffff',
              borderColor: '#e2e8f0',
              borderRadius: '10px',
              fontSize: '12px',
              color: '#0f172a'
            }}
          />
          <ReferenceLine
            y={target}
            stroke="#16a34a"
            strokeDasharray="4 4"
            label={{
              value: `Target ${target}%`,
              position: 'insideTopRight',
              fill: '#16a34a',
              fontSize: 11
            }}
          />
          <Line
            type="monotone"
            dataKey="readiness"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 5, fill: '#2563eb', strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
