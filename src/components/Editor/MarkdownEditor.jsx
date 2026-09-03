import React, { useState } from 'react';
import { Clipboard, Copy, Sparkles, Check, FileText, Code, Camera } from 'lucide-react';

const AI_PROMPT_TEMPLATE = `Analiza la foto adjunta de mi tabla escrita a mano y transcribe sus datos en una tabla Markdown limpia con exactamente estas 3 columnas:

| Fecha | Visualizaciones | Likes |
| --- | --- | --- |

Instrucciones:
1. Transcribe las fechas y horas con precisión (ejemplo: 26/08 19:41).
2. Transcribe todos los valores numéricos de Visualizaciones y Likes.
3. Entrega ÚNICAMENTE el texto o bloque de código de la tabla Markdown (sin explicaciones extra).`;

export function MarkdownEditor({ activeFile, onContentChange }) {
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [pastedSuccess, setPastedSuccess] = useState(false);

  const content = activeFile ? activeFile.content : '';

  // Función para copiar el prompt especializado en fotos escritas a mano
  const handleCopyAiPrompt = async () => {
    try {
      await navigator.clipboard.writeText(AI_PROMPT_TEMPLATE);
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } catch (err) {
      console.error('Error al copiar el prompt:', err);
    }
  };

  // Función para pegar la tabla Markdown directamente desde el portapapeles
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        onContentChange(text);
        setPastedSuccess(true);
        setTimeout(() => setPastedSuccess(false), 2000);
      } else {
        alert('El portapapeles está vacío. Copia primero la tabla enviada por tu IA.');
      }
    } catch (err) {
      console.error('Error al pegar desde el portapapeles:', err);
      alert('Para pegar la tabla, usa el atajo Ctrl + V directamente en el cuadro de texto.');
    }
  };

  const lineCount = content.split('\n').length;
  const charCount = content.length;

  return (
    <div className="flex-1 flex flex-col h-full bg-white border-r border-[#E2D9D2] font-sans select-none overflow-hidden">
      {/* Encabezado del Editor */}
      <div className="h-12 bg-white border-b border-[#E2D9D2] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-[#3A75A4]" />
          <span className="text-xs font-bold text-[#2F4156]">
            Editor de Tabla Markdown
          </span>
        </div>

        {/* Botón Principal Destacado para Pegar Tabla */}
        <button
          onClick={handlePasteClipboard}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
            pastedSuccess
              ? 'bg-emerald-600 text-white'
              : 'bg-[#3A75A4] hover:bg-[#2e6088] text-white active:scale-95'
          }`}
          title="Pegar la tabla recién generada por la IA desde tu portapapeles"
        >
          {pastedSuccess ? <Check size={14} /> : <Clipboard size={14} />}
          <span>{pastedSuccess ? '¡Tabla Pegada!' : '📋 Pegar Tabla Markdown'}</span>
        </button>
      </div>

      {/* Banner Intuitivo: Prompt especializado para Fotos / Tablas Escritas a Mano */}
      <div className="p-3 bg-[#F5EFEB] border-b border-[#E2D9D2] space-y-2 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#2F4156]">
            <Camera size={15} className="text-[#E07A93]" />
            <span>Prompt para Fotos Escritas a Mano (ChatGPT / Claude):</span>
          </div>

          <button
            onClick={handleCopyAiPrompt}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer border ${
              copiedPrompt
                ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                : 'bg-white hover:bg-[#FFE1E6] text-[#2F4156] border-[#E2D9D2]'
            }`}
            title="Copiar prompt especializado para adjuntar fotos escritas a mano"
          >
            {copiedPrompt ? <Check size={12} /> : <Copy size={12} />}
            <span>{copiedPrompt ? '¡Prompt Copiado!' : 'Copiar Prompt para Fotos'}</span>
          </button>
        </div>

        {/* Muestra del Prompt de Visión para Fotos */}
        <div className="bg-white border border-[#E2D9D2] rounded-lg p-2.5 text-[11px] font-sans text-[#2F4156] leading-relaxed relative space-y-1">
          <p className="font-semibold text-[#3A75A4] flex items-center gap-1">
            <Sparkles size={13} />
            Instrucciones para la foto:
          </p>
          <p className="text-[10px] text-[#576B80] leading-normal font-mono bg-[#F5EFEB] p-1.5 rounded border border-[#E2D9D2]">
            "Analiza la foto adjunta de mi tabla escrita a mano y transcribe sus datos en una tabla Markdown limpia: | Fecha | Visualizaciones | Likes |"
          </p>
          <p className="text-[10px] text-[#2F4156]/80 pt-0.5">
            💡 Adjunta la foto en tu app de IA junto con este prompt, luego presiona el botón <strong>"Pegar Tabla Markdown"</strong>.
          </p>
        </div>
      </div>

      {/* Cuadro Textarea Principal de Edición */}
      <div className="flex-1 relative flex flex-col min-h-0 bg-white">
        <textarea
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={`Pega tu tabla Markdown aquí...\n\n| Fecha | Visualizaciones | Likes |\n| --- | --- | --- |\n| 26/08 19:41 | 102 | 13 |\n| 27/08 04:15 | 179 | 15 |`}
          className="flex-1 w-full p-4 font-mono text-xs text-[#2F4156] bg-white resize-none focus:outline-none leading-relaxed overflow-y-auto selection:bg-[#C8D9E6]"
          spellCheck={false}
        />

        {/* Barra de Estado Inferior del Editor */}
        <div className="h-7 bg-[#F5EFEB] border-t border-[#E2D9D2] px-3 flex items-center justify-between text-[10px] font-mono text-[#576B80] shrink-0">
          <div className="flex items-center gap-3">
            <span>{lineCount} líneas</span>
            <span>{charCount} caracteres</span>
          </div>

          <div className="flex items-center gap-1 text-[#2F4156] font-sans font-semibold">
            <Code size={12} />
            <span>Formato: | Fecha | Visualizaciones | Likes |</span>
          </div>
        </div>
      </div>
    </div>
  );
}
