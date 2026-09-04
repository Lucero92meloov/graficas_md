import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/UI/Navbar';
import { MarkdownEditor } from './components/Editor/MarkdownEditor';
import { LineChartViewer } from './components/Chart/LineChartViewer';
import { ChartStats } from './components/Chart/ChartStats';
import { Edit3, LineChart } from 'lucide-react';

const DEFAULT_MARKDOWN = `# Reporte de Rendimiento

Pega tu tabla Markdown aquí abajo para actualizar la gráfica instantáneamente.

| Fecha | Visualizaciones | Likes |
| --- | --- | --- |
| 26/08 19:41 | 102 | 13 |
| 27/08 04:15 | 179 | 15 |
| 27/08 18:57 | 205 | 19 |
| 28/08 02:30 | 230 | 22 |
| 28/08 15:07 | 307 | 26 |
| 28/08 22:40 | 315 | 32 |
| 29/08 08:40 | 358 | 40 |
| 29/08 19:20 | 486 | 56 |
| 30/08 06:06 | 563 | 62 |
| 30/08 14:10 | 691 | 71 |
| 31/08 00:03 | 845 | 71 |
| 31/08 11:30 | 973 | 71 |
| 31/08 21:40 | 1049 | 75 |
| 01/09 09:15 | 1382 | 80 |
| 01/09 20:00 | 1792 | 85 |
| 02/09 10:57 | 1997 | 97 |
| 02/09 18:30 | 2074 | 101 |
| 03/09 08:00 | 2330 | 117 |
| 03/09 11:00 | 2560 | 118 |
`;

const STORAGE_KEY = 'graficas_md_simple_content_v3';

export default function App() {
  const [markdownContent, setMarkdownContent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved || DEFAULT_MARKDOWN;
    } catch {
      return DEFAULT_MARKDOWN;
    }
  });

  const [viewMode, setViewMode] = useState('chart'); // 'chart' | 'editor' | 'split'

  const exportHandlerRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, markdownContent);
    } catch (e) {
      console.error('Error al guardar en LocalStorage:', e);
    }
  }, [markdownContent]);

  const handleResetDefault = () => {
    setMarkdownContent(DEFAULT_MARKDOWN);
  };

  const handleTriggerDownload = (format = 'png') => {
    if (exportHandlerRef.current) {
      exportHandlerRef.current(format);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#F5EFEB] text-[#2F4156] overflow-hidden">
      {/* Navbar Superior */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        onDownload={handleTriggerDownload}
        onResetDefault={handleResetDefault}
      />

      {/* Área Principal de Contenido (Editor y Gráfica) */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Editor Markdown (Izquierda) */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className={`${viewMode === 'split' ? 'w-full md:w-1/2 h-full' : 'w-full h-full'} flex flex-col`}>
            <MarkdownEditor
              activeFile={{ name: 'tabla-grafica.md', content: markdownContent }}
              onContentChange={(content) => setMarkdownContent(content)}
            />
          </div>
        )}

        {/* Panel de Gráfica Lineal (Derecha) */}
        {(viewMode === 'split' || viewMode === 'chart') && (
          <div className={`${viewMode === 'split' ? 'w-full md:w-1/2 h-full' : 'w-full h-full'} flex flex-col overflow-y-auto bg-[#F5EFEB]`}>
            <ChartStats markdownContent={markdownContent} />

            <LineChartViewer
              markdownContent={markdownContent}
              exportHandlerRef={exportHandlerRef}
            />
          </div>
        )}
      </main>

      {/* Barra de Navegación Inferior Móvil (< md): Únicamente Editor y Gráfica */}
      <nav className="md:hidden h-14 bg-white border-t border-[#E2D9D2] flex items-center justify-around px-4 z-30 shrink-0">
        <button
          onClick={() => setViewMode('editor')}
          className={`flex-1 py-2 flex flex-col items-center justify-center text-xs font-semibold rounded-xl transition-all ${
            viewMode === 'editor' ? 'text-[#2F4156] bg-[#C8D9E6]/50 font-bold shadow-xs' : 'text-[#2F4156]/70'
          }`}
        >
          <Edit3 size={18} className="mb-0.5" />
          <span>Editor</span>
        </button>

        <button
          onClick={() => setViewMode('chart')}
          className={`flex-1 py-2 flex flex-col items-center justify-center text-xs font-semibold rounded-xl transition-all ${
            viewMode === 'chart' ? 'text-[#2F4156] bg-[#F7C9D4]/50 font-bold shadow-xs' : 'text-[#2F4156]/70'
          }`}
        >
          <LineChart size={18} className="mb-0.5" />
          <span>Gráfica</span>
        </button>
      </nav>
    </div>
  );
}
