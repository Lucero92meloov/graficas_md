import React from 'react';
import { Activity, Edit3, LineChart, RefreshCw, ImageDown, FileText } from 'lucide-react';

export function Navbar({
  viewMode,
  setViewMode,
  onDownload,
  onResetDefault
}) {
  return (
    <header className="h-14 bg-white border-b border-[#E2D9D2] px-3 sm:px-5 flex items-center justify-between select-none shadow-xs z-30 shrink-0">
      {/* Logotipo y Título */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#C8D9E6] via-[#F7C9D4] to-[#2F4156] p-[1.5px] shadow-xs shrink-0">
          <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
            <Activity size={18} className="text-[#2F4156]" />
          </div>
        </div>
        <div>
          <h1 className="text-xs sm:text-sm font-bold text-[#2F4156] leading-tight flex items-center gap-2">
            MD Chart Studio
            <span className="text-[10px] font-semibold bg-[#FFE1E6] border border-[#F7C9D4] text-[#2F4156] px-2 py-0.5 rounded-full">
              Editor + Gráfica
            </span>
          </h1>
        </div>
      </div>

      {/* Selectores de Vista (Editor y Gráfica) */}
      <div className="hidden md:flex items-center bg-[#F5EFEB] border border-[#E2D9D2] p-1 rounded-xl">
        <button
          onClick={() => setViewMode('editor')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            viewMode === 'editor'
              ? 'bg-[#2F4156] text-[#F5EFEB] shadow-sm font-semibold'
              : 'text-[#2F4156]/80 hover:text-[#2F4156] hover:bg-white/60'
          }`}
        >
          <Edit3 size={14} />
          <span>Editor</span>
        </button>

        <button
          onClick={() => setViewMode('chart')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            viewMode === 'chart'
              ? 'bg-[#2F4156] text-[#F5EFEB] shadow-sm font-semibold'
              : 'text-[#2F4156]/80 hover:text-[#2F4156] hover:bg-white/60'
          }`}
        >
          <LineChart size={14} />
          <span>Gráfica</span>
        </button>

        <button
          onClick={() => setViewMode('split')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
            viewMode === 'split'
              ? 'bg-[#2F4156] text-[#F5EFEB] shadow-sm font-semibold'
              : 'text-[#2F4156]/80 hover:text-[#2F4156] hover:bg-white/60'
          }`}
        >
          <span>Dividido</span>
        </button>
      </div>

      {/* Acciones Rápidas Superior Derecha */}
      <div className="flex items-center gap-2">
        <button
          onClick={onResetDefault}
          className="p-2 sm:px-2.5 sm:py-1.5 text-xs bg-[#F5EFEB] hover:bg-[#E2D9D2] text-[#2F4156] font-medium border border-[#E2D9D2] rounded-xl flex items-center gap-1 transition-all"
          title="Restablecer tabla de ejemplo"
        >
          <RefreshCw size={14} />
          <span className="hidden sm:inline">Restablecer</span>
        </button>

        <button
          onClick={() => onDownload('pdf')}
          className="px-3.5 py-1.5 text-xs bg-[#2F4156] hover:bg-[#1f2d3d] text-white font-bold border border-[#2F4156] rounded-xl flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95"
          title="Descargar o guardar el reporte en PDF"
        >
          <FileText size={15} className="text-white" />
          <span>Reporte PDF</span>
        </button>
      </div>
    </header>
  );
}
