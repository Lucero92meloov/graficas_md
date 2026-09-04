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
import { ExecutiveReportPDF } from './ExecutiveReportPDF';
import { ExportModal } from '../UI/ExportModal';
import { toPng } from 'html-to-image';
import { pdf as renderPdf } from '@react-pdf/renderer';
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

  // Función de exportación de Reporte PDF nativo con @react-pdf/renderer
  const handleExportChart = async (format = 'pdf') => {
    if (!exportBoxRef.current) return;
    try {
      setIsExporting(true);
      await new Promise((r) => setTimeout(r, 250));

      const targetEl = exportBoxRef.current;
      const captureWidth = 1000;
      const captureHeight = 1414;

      const dataUrl = await toPng(targetEl, {
        backgroundColor: '#F5EFEB',
        quality: 0.92,
        pixelRatio: 1.5,
        width: captureWidth,
        height: captureHeight,
        style: {
          width: `${captureWidth}px`,
          height: `${captureHeight}px`,
          maxWidth: 'none',
          padding: '24px',
          boxSizing: 'border-box'
        }
      });

      const currentDateStr = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });

      const pdfDoc = (
        <ExecutiveReportPDF
          data={data}
          maxPrimary={maxPrimary}
          maxSecondary={maxSecondary}
          primaryKey={primaryKey}
          secondaryKey={secondaryKey}
          chartImageUri={dataUrl}
          currentDateStr={currentDateStr}
        />
      );

      const pdfBlob = await renderPdf(pdfDoc).toBlob();
      const timestamp = Date.now();
      const filename = `reporte-ejecutivo-${timestamp}.pdf`;
      const pdfBlobUrl = URL.createObjectURL(pdfBlob);
      const file = new File([pdfBlob], filename, { type: 'application/pdf' });

      // Descargar directamente el archivo PDF vectorial
      const link = document.createElement('a');
      link.href = pdfBlobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportModalData({
        format: 'pdf',
        filename,
        dataUrl,
        pdfBlobUrl,
        file
      });

      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      console.error('Error al exportar reporte PDF con @react-pdf/renderer:', err);
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
          width: isExporting ? '1000px' : '100%',
          height: isExporting ? '1414px' : 'auto',
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
