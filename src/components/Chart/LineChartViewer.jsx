import React, { useState, useRef, useEffect } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';
import { AlertCircle, Hash, Maximize2, Minimize2, ImageDown, TrendingUp, Calendar } from 'lucide-react';
import { parseMarkdownChart } from '../../utils/mdParser';
import { AnimatedIcon } from '../UI/AnimatedIcon';
import { PackageSelector } from '../PackageFilter/PackageSelector';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';

export function LineChartViewer({ markdownContent, exportHandlerRef }) {
  const [scaleMode, setScaleMode] = useState('percentage'); // 'percentage' | 'absolute'
  const [showPointValues, setShowPointValues] = useState(false); // Vista limpia por defecto
  const [expandHorizontal, setExpandHorizontal] = useState(false); // 100% ajustada por defecto
  const [selectedPackage, setSelectedPackage] = useState(null); // '2k' | '5k' | etc.
  const [isExporting, setIsExporting] = useState(false);

  const exportBoxRef = useRef(null);

  const parsedResult = parseMarkdownChart(markdownContent);
  const { data, maxPrimary, maxSecondary, primaryKey, secondaryKey, hasData, error } = parsedResult;

  const displayPrimaryKey = primaryKey === 'Ojo' ? 'Visualizaciones' : primaryKey;
  const displaySecondaryKey = (secondaryKey === 'Corazón' || secondaryKey === 'Comentarios') ? 'Likes' : secondaryKey;

  const formatNumber = (num) => new Intl.NumberFormat('es-MX').format(num || 0);
  const engagementRatio = maxPrimary > 0 ? ((maxSecondary / maxPrimary) * 100).toFixed(1) : '0';

  const exportWidth = 1100;
  const scrollPointWidth = Math.max((data ? data.length : 0) * 60, 900);

  // Función para descargar la imagen PNG completa
  const handleDownloadImage = async () => {
    if (!exportBoxRef.current) return;
    try {
      setIsExporting(true);
      await new Promise((r) => setTimeout(r, 250));

      const targetEl = exportBoxRef.current;

      const dataUrl = await toPng(targetEl, {
        backgroundColor: '#F5EFEB',
        quality: 1.0,
        pixelRatio: 2,
        width: exportWidth,
        style: {
          width: `${exportWidth}px`,
          overflow: 'visible',
          maxWidth: 'none'
        }
      });

      const link = document.createElement('a');
      link.download = `reporte-grafica-paquete-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Error al exportar imagen:', err);
      alert('Hubo un inconveniente al generar la imagen.');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (exportHandlerRef) {
      exportHandlerRef.current = handleDownloadImage;
    }
  }, [exportHandlerRef, handleDownloadImage]);

  if (!hasData) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#F5EFEB] text-[#2F4156]/60 text-center">
        <div className="w-14 h-14 rounded-2xl bg-white border border-[#E2D9D2] flex items-center justify-center mb-3 shadow-xs">
          <AlertCircle size={28} className="text-[#E07A93]" />
        </div>
        <h3 className="text-sm font-bold text-[#2F4156] mb-1">Pega tu tabla para generar la gráfica</h3>
        <p className="text-xs text-[#2F4156]/70 max-w-xs mb-3">
          {error || 'Pega una tabla Markdown en el cuadro de la izquierda para ver el avance.'}
        </p>
      </div>
    );
  }

  // Componente de Etiqueta Azul (Visualizaciones) - Muestra el valor numérico REAL (ej. 2,560 o 2.6k)
  const CustomBlueLabel = (props) => {
    try {
      if (!showPointValues && !isExporting) return null;
      const { x, y, index } = props;
      if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) {
        return null;
      }

      const item = data && data[index] ? data[index] : {};
      const value = item.primaryVal;
      if (value === undefined || value === null) return null;

      const primaryPct = item.primaryPct || 0;
      const secondaryPct = item.secondaryPct || 0;

      const isHigherThanPink = primaryPct >= secondaryPct;
      const offsetY = isHigherThanPink ? -16 : 16;
      const formatted = value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`;

      return (
        <g transform={`translate(${x},${y + offsetY})`}>
          <rect
            x="-14"
            y="-10"
            width="28"
            height="14"
            rx="4"
            fill="#3A75A4"
            opacity="0.95"
          />
          <text
            x="0"
            y="-1"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {formatted}
          </text>
        </g>
      );
    } catch (e) {
      return null;
    }
  };

  // Componente de Etiqueta Rosa (Likes) - Muestra el valor numérico REAL (ej. 118)
  const CustomPinkLabel = (props) => {
    try {
      if (!showPointValues && !isExporting) return null;
      const { x, y, index } = props;
      if (x === undefined || y === undefined || isNaN(x) || isNaN(y)) {
        return null;
      }

      const item = data && data[index] ? data[index] : {};
      const value = item.secondaryVal;
      if (value === undefined || value === null) return null;

      const primaryPct = item.primaryPct || 0;
      const secondaryPct = item.secondaryPct || 0;

      const isHigherThanBlue = secondaryPct > primaryPct;
      const offsetY = isHigherThanBlue ? -16 : 16;
      const formatted = value >= 1000 ? `${(value / 1000).toFixed(1)}k` : `${value}`;

      return (
        <g transform={`translate(${x},${y + offsetY})`}>
          <rect
            x="-14"
            y="-10"
            width="28"
            height="14"
            rx="4"
            fill="#E07A93"
            opacity="0.95"
          />
          <text
            x="0"
            y="-1"
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize="9"
            fontWeight="bold"
            fontFamily="monospace"
          >
            {formatted}
          </text>
        </g>
      );
    } catch (e) {
      return null;
    }
  };

  // Tooltip flotante cristalino
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const itemRaw = payload[0].payload;

      return (
        <div className="bg-white border border-[#E2D9D2] p-3 rounded-xl shadow-xl text-xs space-y-1.5 font-sans z-50 text-[#2F4156] min-w-[190px]">
          <div className="font-semibold text-[#2F4156] border-b border-[#E2D9D2] pb-1 flex items-center justify-between">
            <span>📅 {label}</span>
          </div>

          <div className="space-y-1.5 pt-0.5">
            <div className="flex items-center justify-between gap-4 text-[#3A75A4] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#3A75A4] inline-block shrink-0" />
                {displayPrimaryKey}:
              </span>
              <span className="font-mono text-[#2F4156]">
                {formatNumber(itemRaw.primaryVal)}
                <span className="text-[10px] text-[#3A75A4] ml-1 font-semibold">({itemRaw.primaryPct}%)</span>
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-[#E07A93] font-bold">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E07A93] inline-block shrink-0" />
                {displaySecondaryKey}:
              </span>
              <span className="font-mono text-[#2F4156]">
                {formatNumber(itemRaw.secondaryVal)}
                <span className="text-[10px] text-[#E07A93] ml-1 font-semibold">({itemRaw.secondaryPct}%)</span>
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full bg-[#F5EFEB] p-2 sm:p-4 pb-4 select-none space-y-3 font-sans">
      {/* Botones de Control Integrados de la Vista Web */}
      {!isExporting && (
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setExpandHorizontal(!expandHorizontal)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                expandHorizontal
                  ? 'bg-[#3A75A4] text-white border-[#3A75A4] shadow-xs'
                  : 'bg-white text-[#2F4156] border-[#E2D9D2] hover:bg-[#F5EFEB]'
              }`}
              title="Alternar entre ajustar a pantalla o scroll alargado"
            >
              {expandHorizontal ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
              <span>{expandHorizontal ? 'Modo Alargado' : 'Ajustar a Pantalla'}</span>
            </button>

            <button
              onClick={() => setShowPointValues(!showPointValues)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
                showPointValues
                  ? 'bg-[#2F4156] text-[#F5EFEB] border-[#2F4156] shadow-xs'
                  : 'bg-white text-[#2F4156] border-[#E2D9D2] hover:bg-[#F5EFEB]'
              }`}
              title="Mostrar u ocultar los números sobre los puntos"
            >
              <Hash size={13} />
              <span>{showPointValues ? 'Números Visibles' : 'Mostrar Números'}</span>
            </button>
          </div>

          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#E07A93] hover:bg-[#c9627a] text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
            title="Descargar la gráfica como imagen PNG"
          >
            <ImageDown size={14} />
            <span>Descargar Imagen PNG</span>
          </button>
        </div>
      )}

      {/* ÁREA DE EXPORTACIÓN Y CONTENIDO PRINCIPAL */}
      <div
        ref={exportBoxRef}
        style={{
          width: isExporting ? `${exportWidth}px` : '100%',
          minWidth: '100%'
        }}
        className="bg-[#F5EFEB] space-y-3"
      >
        {/* Tarjetas resumen superior */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <div className="bg-white border border-[#E2D9D2] p-2.5 rounded-xl flex items-center gap-2 shadow-xs overflow-hidden">
            <div className="p-1.5 bg-[#C8D9E6]/50 border border-[#9fbcd2] rounded-lg text-[#3A75A4] shrink-0">
              <AnimatedIcon name="eye" size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#576B80] font-medium truncate">{displayPrimaryKey}</p>
              <p className="text-xs sm:text-sm font-bold font-mono text-[#3A75A4] truncate">{formatNumber(maxPrimary)}</p>
            </div>
          </div>

          <div className="bg-white border border-[#E2D9D2] p-2.5 rounded-xl flex items-center gap-2 shadow-xs overflow-hidden">
            <div className="p-1.5 bg-[#F7C9D4]/50 border border-[#e8a3b4] rounded-lg text-[#E07A93] shrink-0">
              <AnimatedIcon name="heart" size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#576B80] font-medium truncate">{displaySecondaryKey}</p>
              <p className="text-xs sm:text-sm font-bold font-mono text-[#E07A93] truncate">{formatNumber(maxSecondary)}</p>
            </div>
          </div>

          <div className="bg-white border border-[#E2D9D2] p-2.5 rounded-xl flex items-center gap-2 shadow-xs overflow-hidden">
            <div className="p-1.5 bg-[#FFE1E6] border border-[#F7C9D4] rounded-lg text-[#E07A93] shrink-0">
              <TrendingUp size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#576B80] font-medium truncate">Ratio Reacción</p>
              <p className="text-xs sm:text-sm font-bold font-mono text-[#E07A93] truncate">{engagementRatio}%</p>
            </div>
          </div>

          <div className="bg-white border border-[#E2D9D2] p-2.5 rounded-xl flex items-center gap-2 shadow-xs overflow-hidden">
            <div className="p-1.5 bg-[#FAF5F2] border border-[#E2D9D2] rounded-lg text-[#2F4156] shrink-0">
              <Calendar size={16} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-[#576B80] font-medium truncate">Tomas</p>
              <p className="text-xs sm:text-sm font-bold font-mono text-[#2F4156] truncate">{data.length}</p>
            </div>
          </div>
        </div>

        {/* Gráfica Lineal Recharts */}
        <div className="bg-white border border-[#E2D9D2] rounded-xl p-2 sm:p-4 shadow-xs overflow-x-auto">
          <div
            style={{
              width: (expandHorizontal && !isExporting) ? `${scrollPointWidth}px` : '100%',
              minWidth: '100%'
            }}
            className="h-[300px] sm:h-[360px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 30, right: 25, left: -15, bottom: 50 }}
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
                  domain={scaleMode === 'percentage' ? [0, 100] : ['auto', 'auto']}
                  tickFormatter={(val) => (scaleMode === 'percentage' ? `${val}%` : formatNumber(val))}
                />

                <Tooltip content={<CustomTooltip />} />

                {/* Línea Azul = Visualizaciones */}
                <Line
                  type="monotone"
                  connectNulls={true}
                  isAnimationActive={false}
                  dataKey={scaleMode === 'percentage' ? 'primaryPct' : 'primaryVal'}
                  name={displayPrimaryKey}
                  stroke="#3A75A4"
                  strokeWidth={3}
                  dot={{
                    r: 4.5,
                    fill: '#C8D9E6',
                    stroke: '#3A75A4',
                    strokeWidth: 2
                  }}
                  activeDot={{
                    r: 6.5,
                    fill: '#FFFFFF',
                    stroke: '#3A75A4',
                    strokeWidth: 3
                  }}
                  label={<CustomBlueLabel />}
                />

                {/* Línea Rosa = Likes */}
                <Line
                  type="monotone"
                  connectNulls={true}
                  isAnimationActive={false}
                  dataKey={scaleMode === 'percentage' ? 'secondaryPct' : 'secondaryVal'}
                  name={displaySecondaryKey}
                  stroke="#E07A93"
                  strokeWidth={3}
                  dot={{
                    r: 4.5,
                    fill: '#F7C9D4',
                    stroke: '#E07A93',
                    strokeWidth: 2
                  }}
                  activeDot={{
                    r: 6.5,
                    fill: '#FFFFFF',
                    stroke: '#E07A93',
                    strokeWidth: 3
                  }}
                  label={<CustomPinkLabel />}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Componente de Filtro por Paquete Adquirido (Integrado limpiamente) */}
        <PackageSelector
          selectedPackage={selectedPackage}
          onSelectPackage={setSelectedPackage}
          maxPrimary={maxPrimary}
          maxSecondary={maxSecondary}
        />
      </div>
    </div>
  );
}
