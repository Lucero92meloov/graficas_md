import React from 'react';
import { X, Share2, ExternalLink, Download, FileText, Image as ImageIcon, Smartphone, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export function ExportModal({ isOpen, onClose, exportData }) {
  if (!isOpen || !exportData) return null;

  const { format, filename, dataUrl, blobUrl, file } = exportData;
  const isPdf = format === 'pdf';
  const isWebShareSupported = typeof navigator !== 'undefined' && !!navigator.canShare;

  const handleShare = async () => {
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          title: 'Reporte de Rendimiento - MD Chart Studio',
          text: `Reporte de gráfica de visualizaciones y likes (${format.toUpperCase()})`,
          files: [file]
        });
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error al compartir:', err);
        }
      }
    } else if (navigator.share) {
      try {
        await navigator.share({
          title: 'Reporte de Rendimiento - MD Chart Studio',
          url: blobUrl || dataUrl
        });
        confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error al compartir enlace:', err);
        }
      }
    } else {
      handleOpenNewTab();
    }
  };

  const handleOpenNewTab = () => {
    const targetUrl = blobUrl || dataUrl;
    if (targetUrl) {
      window.open(targetUrl, '_blank');
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    }
  };

  const handleDownloadDirect = () => {
    const targetUrl = blobUrl || dataUrl;
    if (targetUrl) {
      const link = document.createElement('a');
      link.href = targetUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      confetti({ particleCount: 60, spread: 65, origin: { y: 0.6 } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-[#E2D9D2] overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="px-5 py-4 bg-[#F5EFEB] border-b border-[#E2D9D2] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#2F4156] flex items-center justify-center text-white shadow-xs">
              {isPdf ? <FileText size={20} /> : <ImageIcon size={20} />}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#2F4156] flex items-center gap-2">
                Reporte Generado
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#C8D9E6] text-[#2F4156] border border-[#9fbcd2]">
                  {format}
                </span>
              </h3>
              <p className="text-xs text-[#2F4156]/70 truncate max-w-[220px] sm:max-w-xs">{filename}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-[#E2D9D2] text-[#2F4156]/70 hover:text-[#2F4156] transition-all cursor-pointer"
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo del Modal con Vista Previa */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          {/* Tarjeta de notificación verde de listo */}
          <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-emerald-800 text-xs font-medium">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span>El archivo ha sido procesado con éxito y está listo para guardarse.</span>
          </div>

          {/* Vista previa de la imagen/documento */}
          <div className="bg-[#F5EFEB] border border-[#E2D9D2] rounded-xl p-2 flex items-center justify-center min-h-[160px] max-h-[280px] overflow-hidden relative group">
            {dataUrl ? (
              <img
                src={dataUrl}
                alt="Vista previa de gráfica"
                className="max-h-[260px] w-auto object-contain rounded-lg shadow-xs"
              />
            ) : (
              <div className="text-center p-6 text-[#2F4156]/60">
                <FileText size={40} className="mx-auto mb-2 text-[#2F4156]" />
                <p className="text-xs font-semibold">Documento PDF generado</p>
              </div>
            )}
          </div>

          {/* Banner de ayuda responsivo para usuarios iOS / Safari */}
          <div className="bg-[#C8D9E6]/40 border border-[#C8D9E6] p-3 rounded-xl flex items-start gap-2.5 text-xs text-[#2F4156]">
            <Smartphone size={18} className="text-[#3A75A4] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">¿Usas iPhone, iPad o Safari?</span>
              <p className="text-[11px] text-[#2F4156]/80 leading-relaxed">
                Toca <strong className="text-[#2F4156]">"Compartir / Guardar en Archivos"</strong> para usar el menú nativo de iOS (Guardar en fotos, Archivos o AirDrop). También puedes abrirlo en una pestaña nueva o mantener presionada la imagen.
              </p>
            </div>
          </div>
        </div>

        {/* Pie de Modal con Acciones */}
        <div className="p-4 bg-[#F5EFEB] border-t border-[#E2D9D2] flex flex-col sm:flex-row gap-2 shrink-0">
          {/* Botón Principal (Nativo Share de iOS / Android / Desktop) */}
          {isWebShareSupported && (
            <button
              onClick={handleShare}
              className="flex-1 py-2.5 px-4 bg-[#2F4156] hover:bg-[#1f2d3d] text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-98 cursor-pointer"
            >
              <Share2 size={16} />
              <span>Compartir / Guardar (iOS)</span>
            </button>
          )}

          {/* Botón Abrir en Pestaña Nueva */}
          <button
            onClick={handleOpenNewTab}
            className="flex-1 py-2.5 px-4 bg-[#C8D9E6] hover:bg-[#b5cadb] text-[#2F4156] font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-[#9fbcd2] transition-all shadow-xs active:scale-98 cursor-pointer"
          >
            <ExternalLink size={16} />
            <span>Abrir en Pestaña</span>
          </button>

          {/* Botón Descargar Directa */}
          <button
            onClick={handleDownloadDirect}
            className="py-2.5 px-4 bg-white hover:bg-gray-50 text-[#2F4156] font-bold text-xs rounded-xl flex items-center justify-center gap-2 border border-[#E2D9D2] transition-all active:scale-98 cursor-pointer"
            title="Descargar directamente al navegador"
          >
            <Download size={16} />
            <span className="sm:hidden md:inline">Descargar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
