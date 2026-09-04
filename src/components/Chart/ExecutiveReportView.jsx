import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Activity, Eye, Heart, TrendingUp, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { PackageSelector } from '../PackageFilter/PackageSelector';

export function ExecutiveReportView({
  data,
  maxPrimary,
  maxSecondary,
  primaryKey,
  secondaryKey,
  selectedPackage,
  setSelectedPackage
}) {
  if (!data || data.length === 0) return null;

  const displayPrimaryKey = primaryKey === 'Ojo' ? 'Visualizaciones' : primaryKey;
  const displaySecondaryKey = (secondaryKey === 'Corazón' || secondaryKey === 'Comentarios') ? 'Likes' : secondaryKey;

  const formatNumber = (num) => new Intl.NumberFormat('es-MX').format(num || 0);
  const engagementRatio = maxPrimary > 0 ? ((maxSecondary / maxPrimary) * 100).toFixed(1) : '0';

  const totalPrimary = data.reduce((acc, item) => acc + (item.primaryVal || 0), 0);
  const totalSecondary = data.reduce((acc, item) => acc + (item.secondaryVal || 0), 0);
  const totalPoints = data.length;

  const avgPrimary = Math.round(totalPrimary / Math.max(totalPoints, 1));
  const avgSecondary = Math.round(totalSecondary / Math.max(totalPoints, 1));

  const pieData = [
    { name: displayPrimaryKey, value: maxPrimary, color: '#3A75A4' },
    { name: displaySecondaryKey, value: maxSecondary, color: '#E07A93' }
  ];

  const currentDateStr = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="w-full bg-[#F5EFEB] p-3 sm:p-5 space-y-4 font-sans select-none border border-[#E2D9D2] rounded-2xl shadow-xs">
      {/* Encabezado del Reporte Ejecutivo */}
      <div className="bg-white border border-[#E2D9D2] p-4 sm:p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3A75A4] via-[#E07A93] to-[#2F4156] p-[2px] shadow-xs shrink-0">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Activity size={22} className="text-[#2F4156]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-extrabold text-[#2F4156] tracking-tight">
                Reporte Ejecutivo de Rendimiento y Alcance
              </h2>
              <span className="text-[9px] font-bold bg-[#C8D9E6] text-[#2F4156] px-2 py-0.5 rounded-full uppercase tracking-wider">
                Consolidado
              </span>
            </div>
            <p className="text-xs text-[#576B80] font-medium mt-0.5">
              Análisis completo de {displayPrimaryKey} e Interacciones ({displaySecondaryKey})
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right shrink-0">
          <p className="text-[10px] text-[#576B80] font-semibold">Fecha de emisión</p>
          <p className="text-xs font-bold text-[#2F4156] font-mono">{currentDateStr}</p>
        </div>
      </div>

      {/* Tarjetas KPI de Resumen */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
        <div className="bg-white border border-[#E2D9D2] p-3 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[#576B80] font-bold uppercase tracking-wider">{displayPrimaryKey} Máx.</span>
            <div className="p-1 bg-[#C8D9E6]/50 rounded text-[#3A75A4]">
              <Eye size={14} />
            </div>
          </div>
          <p className="text-base sm:text-lg font-extrabold font-mono text-[#3A75A4]">{formatNumber(maxPrimary)}</p>
          <p className="text-[10px] text-[#576B80] mt-0.5 font-medium">Promedio: {formatNumber(avgPrimary)} / toma</p>
        </div>

        <div className="bg-white border border-[#E2D9D2] p-3 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[#576B80] font-bold uppercase tracking-wider">{displaySecondaryKey} Máx.</span>
            <div className="p-1 bg-[#F7C9D4]/50 rounded text-[#E07A93]">
              <Heart size={14} />
            </div>
          </div>
          <p className="text-base sm:text-lg font-extrabold font-mono text-[#E07A93]">{formatNumber(maxSecondary)}</p>
          <p className="text-[10px] text-[#576B80] mt-0.5 font-medium">Promedio: {formatNumber(avgSecondary)} / toma</p>
        </div>

        <div className="bg-white border border-[#E2D9D2] p-3 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[#576B80] font-bold uppercase tracking-wider">Ratio Reacción</span>
            <div className="p-1 bg-[#FFE1E6] rounded text-[#E07A93]">
              <TrendingUp size={14} />
            </div>
          </div>
          <p className="text-base sm:text-lg font-extrabold font-mono text-[#2F4156]">{engagementRatio}%</p>
          <p className="text-[10px] text-[#576B80] mt-0.5 font-medium">Likes vs Visualizaciones</p>
        </div>

        <div className="bg-white border border-[#E2D9D2] p-3 rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-[#576B80] font-bold uppercase tracking-wider">Muestras / Tomas</span>
            <div className="p-1 bg-[#FAF5F2] rounded text-[#2F4156]">
              <Calendar size={14} />
            </div>
          </div>
          <p className="text-base sm:text-lg font-extrabold font-mono text-[#2F4156]">{totalPoints}</p>
          <p className="text-[10px] text-[#576B80] mt-0.5 font-medium">Registros procesados</p>
        </div>
      </div>

      {/* Bloque Principal: Gráfica de Tendencia (Lineal) */}
      <div className="bg-white border border-[#E2D9D2] rounded-xl p-3 sm:p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3 border-b border-[#E2D9D2] pb-2">
          <h3 className="text-xs font-bold text-[#2F4156] flex items-center gap-1.5">
            <TrendingUp size={15} className="text-[#3A75A4]" />
            <span>Curva de Crecimiento y Rendimiento Temporal</span>
          </h3>
          <span className="text-[10px] font-mono text-[#576B80]">{totalPoints} Puntos de medición</span>
        </div>
        <div className="h-[280px] sm:h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: -15, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EFE8E1" vertical={false} />
              <XAxis dataKey="fecha" stroke="#576B80" tick={{ fill: '#576B80', fontSize: 9 }} angle={-45} textAnchor="end" dy={6} interval={0} />
              <YAxis stroke="#576B80" tick={{ fill: '#576B80', fontSize: 10 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <RechartsTooltip />
              <Line type="monotone" dataKey="primaryPct" name={displayPrimaryKey} stroke="#3A75A4" strokeWidth={3} dot={{ r: 4, fill: '#C8D9E6', stroke: '#3A75A4', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="secondaryPct" name={displaySecondaryKey} stroke="#E07A93" strokeWidth={3} dot={{ r: 4, fill: '#F7C9D4', stroke: '#E07A93', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bloque Secundario: Gráfica de Pastel (Distribución Porcentual) + Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-1 bg-white border border-[#E2D9D2] rounded-xl p-3 shadow-xs flex flex-col justify-between">
          <div className="border-b border-[#E2D9D2] pb-2 mb-2">
            <h4 className="text-xs font-bold text-[#2F4156]">Distribución de Alcance</h4>
            <p className="text-[10px] text-[#576B80]">Relación entre {displayPrimaryKey} y {displaySecondaryKey}</p>
          </div>
          <div className="h-[180px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#FFFFFF" strokeWidth={2} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={30} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resumen de Hitos y Paquete */}
        <div className="md:col-span-2 bg-white border border-[#E2D9D2] rounded-xl p-4 shadow-xs flex flex-col justify-between">
          <div className="border-b border-[#E2D9D2] pb-2 mb-3">
            <h4 className="text-xs font-bold text-[#2F4156] flex items-center gap-1.5">
              <CheckCircle2 size={15} className="text-[#3A75A4]" />
              <span>Estado del Objetivo y Conclusiones del Reporte</span>
            </h4>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 bg-[#F5EFEB] rounded-xl border border-[#E2D9D2] flex items-center justify-between">
              <span className="font-semibold text-[#2F4156]">Pico de Visualizaciones</span>
              <span className="font-bold font-mono text-[#3A75A4]">{formatNumber(maxPrimary)} Vistas</span>
            </div>
            <div className="p-2.5 bg-[#F5EFEB] rounded-xl border border-[#E2D9D2] flex items-center justify-between">
              <span className="font-semibold text-[#2F4156]">Pico de Interacciones (Likes)</span>
              <span className="font-bold font-mono text-[#E07A93]">{formatNumber(maxSecondary)} Likes</span>
            </div>
            <div className="p-2.5 bg-[#F5EFEB] rounded-xl border border-[#E2D9D2] flex items-center justify-between">
              <span className="font-semibold text-[#2F4156]">Efectividad de Conversión (Engagement)</span>
              <span className="font-bold font-mono text-[#2F4156]">{engagementRatio}% por cada 100 vistas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Paquete Integrado */}
      <PackageSelector
        selectedPackage={selectedPackage}
        onSelectPackage={setSelectedPackage}
        maxPrimary={maxPrimary}
        maxSecondary={maxSecondary}
      />
    </div>
  );
}
