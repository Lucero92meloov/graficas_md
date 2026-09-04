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
import { AlertCircle, Hash, Maximize2, Minimize2, ImageDown, FileText, TrendingUp, Calendar, PieChart as PieIcon, BarChart3, FileSpreadsheet } from 'lucide-react';
import { parseMarkdownChart } from '../../utils/mdParser';
import { AnimatedIcon } from '../UI/AnimatedIcon';
import { PackageSelector } from '../PackageFilter/PackageSelector';
import { PieChartViewer } from './PieChartViewer';
import { BarChartViewer } from './BarChartViewer';
import { ExecutiveReportView } from './ExecutiveReportView';
import { ExportModal } from '../UI/ExportModal';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';

export function LineChartViewer({ markdownContent, exportHandlerRef }) {
  const [chartType, setChartType] = useState('report'); // 'report' únicamente
  const [scaleMode, setScaleMode] = useState('percentage');
  const [showPointValues, setShowPointValues] = useState(false);
  const [expandHorizontal, setExpandHorizontal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [exportModalData, setExportModalData] = useState(null);

  const exportBoxRef = useRef(null);

  const parsedResult = parseMarkdownChart(markdownContent);
  const { data, maxPrimary, maxSecondary, primaryKey, secondaryKey, hasData, error } = parsedResult;

  const displayPrimaryKey = primaryKey === 'Ojo' ? 'Visualizaciones' : primaryKey;
  const displaySecondaryKey = (secondaryKey === 'Corazón' || secondaryKey === 'Comentarios') ? 'Likes' : secondaryKey;

  const formatNumber = (num) => new Intl.NumberFormat('es-MX').format(num || 0);
  const engagementRatio = maxPrimary > 0 ? ((maxSecondary / maxPrimary) * 100).toFixed(1) : '0';

  const minPointWidth = 70;
  const dynamicExportWidth = Math.max((data ? data.length : 0) * minPointWidth, 1200);
  const scrollPointWidth = Math.max((data ? data.length : 0) * 60, 900);

  // Función de exportación de Reporte PDF responsivo multi-página
  const handleExportChart = async (format = 'pdf') => {
    if (!exportBoxRef.current) return;
    try {
      setIsExporting(true);
      await new Promise((r) => setTimeout(r, 250));

      const targetEl = exportBoxRef.current;
      // Ancho dinámico adaptativo para mantener proporciones nítidas y alta resolución
      const captureWidth = Math.max((data ? data.length : 0) * 55, 1080);

      const dataUrl = await toPng(targetEl, {
        backgroundColor: '#F5EFEB',
        quality: 1.0,
        pixelRatio: 2,
        width: captureWidth,
        style: {
          width: `${captureWidth}px`,
          maxWidth: 'none',
          padding: '16px',
          boxSizing: 'border-box'
        }
      });

      const img = new Image();
      img.src = dataUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const imgWidth = img.width;
      const imgHeight = img.height;

      // Crear documento PDF A4 vertical o horizontal según proporciones
      const isLandscape = imgWidth > (imgHeight * 1.2);
      const pdf = new jsPDF({
        orientation: isLandscape ? 'landscape' : 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();
      const margin = 8; // 8mm márgenes

      const printableWidth = pdfPageWidth - (margin * 2);
      const printableHeight = pdfPageHeight - (margin * 2);

      const scaledImgHeight = (imgHeight * printableWidth) / imgWidth;

      if (scaledImgHeight <= printableHeight) {
        // Cabe perfectamente en 1 sola página
        const yPos = (pdfPageHeight - scaledImgHeight) / 2;
        pdf.addImage(dataUrl, 'PNG', margin, Math.max(yPos, margin), printableWidth, scaledImgHeight);
      } else {
        // Multi-página responsiva: dividir el lienzo por segmentos de alto sin deformar ni aplastar
        const canvasPageHeight = (imgWidth * printableHeight) / printableWidth;
        const sourceCanvas = document.createElement('canvas');
        sourceCanvas.width = imgWidth;
        sourceCanvas.height = imgHeight;
        const ctx = sourceCanvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        let heightLeft = imgHeight;
        let pageIndex = 0;

        while (heightLeft > 0) {
          const sliceHeight = Math.min(canvasPageHeight, heightLeft);
          const pageCanvas = document.createElement('canvas');
          pageCanvas.width = imgWidth;
          pageCanvas.height = sliceHeight;
          const pageCtx = pageCanvas.getContext('2d');

          pageCtx.drawImage(
            sourceCanvas,
            0, pageIndex * canvasPageHeight,
            imgWidth, sliceHeight,
            0, 0,
            imgWidth, sliceHeight
          );

          const sliceDataUrl = pageCanvas.toDataURL('image/png', 1.0);
          const sliceMmHeight = (sliceHeight * printableWidth) / imgWidth;

          if (pageIndex > 0) {
            pdf.addPage();
          }

          pdf.addImage(sliceDataUrl, 'PNG', margin, margin, printableWidth, sliceMmHeight);

          heightLeft -= canvasPageHeight;
          pageIndex++;
        }
      }

      const timestamp = Date.now();
      const filename = `reporte-ejecutivo-${timestamp}.pdf`;
      const pdfArrayBuffer = pdf.output('arraybuffer');
      const pdfDataUri = pdf.output('datauristring');
      const file = new File([pdfArrayBuffer], filename, { type: 'application/pdf' });

      setExportModalData({
        format: 'pdf',
        filename,
        dataUrl,
        pdfDataUri,
        file
      });

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Error al exportar reporte PDF:', err);
      alert('Hubo un inconveniente al generar el PDF. Intenta nuevamente.');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    if (exportHandlerRef) {
      exportHandlerRef.current = handleExportChart;
    }
  }, [exportHandlerRef, handleExportChart]);

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

  // Componente de Etiqueta Azul (Visualizaciones)
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

  // Componente de Etiqueta Rosa (Likes)
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
      {/* Barra de Control de Exportación de Reporte Completo */}
      {!isExporting && (
        <div className="flex items-center justify-between gap-2 flex-wrap bg-white border border-[#E2D9D2] p-2.5 rounded-xl shadow-xs">
          <div className="flex items-center gap-2 px-1 text-xs font-extrabold text-[#2F4156]">
            <div className="w-6 h-6 rounded-lg bg-[#3A75A4] flex items-center justify-center text-white text-xs">
              <FileSpreadsheet size={14} />
            </div>
            <span>Reporte Ejecutivo Completo</span>
          </div>

          <button
            onClick={() => handleExportChart('pdf')}
            disabled={isExporting}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#2F4156] hover:bg-[#1f2d3d] text-white shadow-xs flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
            title="Descargar o guardar el reporte en documento PDF"
          >
            <FileText size={14} />
            <span>Reporte PDF</span>
          </button>
        </div>
      )}

      {/* ÁREA DE EXPORTACIÓN CON REPORTE EJECUTIVO COMPLETO */}
      <div
        ref={exportBoxRef}
        style={{
          width: isExporting ? `${dynamicExportWidth}px` : '100%',
          minWidth: '100%'
        }}
        className="bg-[#F5EFEB] space-y-3"
      >
        <ExecutiveReportView
          data={data}
          maxPrimary={maxPrimary}
          maxSecondary={maxSecondary}
          primaryKey={primaryKey}
          secondaryKey={secondaryKey}
          selectedPackage={selectedPackage}
          setSelectedPackage={setSelectedPackage}
        />
      </div>

      {/* Modal de Exportación y Descarga para iOS/Desktop */}
      <ExportModal
        isOpen={!!exportModalData}
        onClose={() => setExportModalData(null)}
        exportData={exportModalData}
      />
    </div>
  );
}
