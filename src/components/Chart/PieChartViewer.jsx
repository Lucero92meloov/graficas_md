import React from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from 'recharts';
import { PieChart as PieIcon, Activity, Heart, Eye } from 'lucide-react';

export function PieChartViewer({ data, maxPrimary, maxSecondary, primaryKey, secondaryKey }) {
  if (!data || data.length === 0) return null;

  const displayPrimaryKey = primaryKey === 'Ojo' ? 'Visualizaciones' : primaryKey;
  const displaySecondaryKey = (secondaryKey === 'Corazón' || secondaryKey === 'Comentarios') ? 'Likes' : secondaryKey;

  const totalPrimary = data.reduce((acc, item) => acc + (item.primaryVal || 0), 0);
  const totalSecondary = data.reduce((acc, item) => acc + (item.secondaryVal || 0), 0);
  const totalInteraction = totalPrimary + totalSecondary;

  const pieDataDistribution = [
    {
      name: displayPrimaryKey,
      value: totalPrimary,
      color: '#3A75A4',
      percentage: totalInteraction > 0 ? ((totalPrimary / totalInteraction) * 100).toFixed(1) : '0'
    },
    {
      name: displaySecondaryKey,
      value: totalSecondary,
      color: '#E07A93',
      percentage: totalInteraction > 0 ? ((totalSecondary / totalInteraction) * 100).toFixed(1) : '0'
    }
  ];

  // Datos para pastel de crecimiento por etapas (Primer tercio, Segundo tercio, Tercer tercio)
  const third = Math.ceil(data.length / 3);
  const phase1 = data.slice(0, third).reduce((acc, item) => acc + item.primaryVal, 0);
  const phase2 = data.slice(third, third * 2).reduce((acc, item) => acc + item.primaryVal, 0);
  const phase3 = data.slice(third * 2).reduce((acc, item) => acc + item.primaryVal, 0);

  const phaseData = [
    { name: 'Etapa Inicial', value: phase1, color: '#C8D9E6' },
    { name: 'Etapa Intermedia', value: phase2, color: '#3A75A4' },
    { name: 'Etapa Cierre', value: phase3, color: '#2F4156' }
  ].filter(p => p.value > 0);

  const formatNumber = (num) => new Intl.NumberFormat('es-MX').format(num || 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      return (
        <div className="bg-white border border-[#E2D9D2] p-2.5 rounded-xl shadow-lg text-xs space-y-1 font-sans text-[#2F4156]">
          <div className="flex items-center gap-2 font-bold" style={{ color: item.payload.color }}>
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.payload.color }} />
            {item.name}
          </div>
          <p className="font-mono text-xs font-semibold text-[#2F4156]">
            {formatNumber(item.value)} unidades
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full space-y-4 font-sans select-none">
      {/* Tarjetas informativas superiores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div className="bg-white border border-[#E2D9D2] p-3 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#C8D9E6]/40 text-[#3A75A4] rounded-lg">
              <Eye size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[#576B80] font-semibold">Proporción {displayPrimaryKey}</p>
              <p className="text-sm font-bold text-[#3A75A4] font-mono">{pieDataDistribution[0].percentage}%</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#2F4156]">{formatNumber(totalPrimary)}</span>
        </div>

        <div className="bg-white border border-[#E2D9D2] p-3 rounded-xl shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#F7C9D4]/40 text-[#E07A93] rounded-lg">
              <Heart size={18} />
            </div>
            <div>
              <p className="text-[10px] text-[#576B80] font-semibold">Proporción {displaySecondaryKey}</p>
              <p className="text-sm font-bold text-[#E07A93] font-mono">{pieDataDistribution[1].percentage}%</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-[#2F4156]">{formatNumber(totalSecondary)}</span>
        </div>
      </div>

      {/* Gráficas de Pastel en paralelo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pastel 1: Distribución Global */}
        <div className="bg-white border border-[#E2D9D2] p-4 rounded-xl shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#2F4156] flex items-center gap-1.5">
              <PieIcon size={14} className="text-[#3A75A4]" />
              <span>Distribución Global de Alcance</span>
            </h4>
          </div>
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieDataDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieDataDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry) => (
                    <span className="text-xs font-semibold text-[#2F4156] mr-2">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pastel 2: Distribución por Fases del Periodo */}
        <div className="bg-white border border-[#E2D9D2] p-4 rounded-xl shadow-xs flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold text-[#2F4156] flex items-center gap-1.5">
              <Activity size={14} className="text-[#E07A93]" />
              <span>Distribución por Etapas de Crecimiento</span>
            </h4>
          </div>
          <div className="w-full h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={phaseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {phaseData.map((entry, index) => (
                    <Cell key={`cell-phase-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => (
                    <span className="text-xs font-semibold text-[#2F4156] mr-2">{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
