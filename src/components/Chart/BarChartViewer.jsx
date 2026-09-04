import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

export function BarChartViewer({ data, primaryKey, secondaryKey, expandHorizontal }) {
  if (!data || data.length === 0) return null;

  const displayPrimaryKey = primaryKey === 'Ojo' ? 'Visualizaciones' : primaryKey;
  const displaySecondaryKey = (secondaryKey === 'Corazón' || secondaryKey === 'Comentarios') ? 'Likes' : secondaryKey;

  const formatNumber = (num) => new Intl.NumberFormat('es-MX').format(num || 0);

  const scrollPointWidth = Math.max((data ? data.length : 0) * 60, 900);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-[#E2D9D2] p-3 rounded-xl shadow-xl text-xs space-y-1.5 font-sans z-50 text-[#2F4156] min-w-[180px]">
          <div className="font-semibold text-[#2F4156] border-b border-[#E2D9D2] pb-1">
            <span>📅 {label}</span>
          </div>
          <div className="space-y-1 pt-0.5 font-mono">
            {payload.map((entry, idx) => (
              <div key={idx} className="flex items-center justify-between gap-3 font-bold" style={{ color: entry.color }}>
                <span>{entry.name}:</span>
                <span>{formatNumber(entry.value)}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-white border border-[#E2D9D2] rounded-xl p-3 sm:p-4 shadow-xs overflow-x-auto select-none">
      <div
        style={{
          width: expandHorizontal ? `${scrollPointWidth}px` : '100%',
          minWidth: '100%'
        }}
        className="h-[340px] sm:h-[380px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: -10, bottom: 50 }}
            barGap={4}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#EFE8E1" vertical={false} />
            <XAxis
              dataKey="fecha"
              stroke="#576B80"
              tick={{ fill: '#576B80', fontSize: 9 }}
              angle={-45}
              textAnchor="end"
              dy={6}
              interval={0}
            />
            <YAxis
              stroke="#576B80"
              tick={{ fill: '#576B80', fontSize: 10 }}
              tickFormatter={(val) => formatNumber(val)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Bar
              dataKey="primaryVal"
              name={displayPrimaryKey}
              fill="#3A75A4"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
            <Bar
              dataKey="secondaryVal"
              name={displaySecondaryKey}
              fill="#E07A93"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
