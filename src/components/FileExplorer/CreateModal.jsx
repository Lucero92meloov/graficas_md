import React, { useState } from 'react';
import { FolderPlus, FilePlus, X } from 'lucide-react';

export function CreateModal({ isOpen, onClose, onCreate, parentId }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('file');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate(parentId, name.trim(), type);
    setName('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2F4156]/40 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#E2D9D2] rounded-xl w-full max-w-md shadow-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#2F4156]/60 hover:text-[#2F4156] p-1 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>

        <h3 className="text-lg font-semibold text-[#2F4156] mb-4 flex items-center gap-2">
          {type === 'file' ? <FilePlus className="text-[#3A75A4]" size={20} /> : <FolderPlus className="text-[#E07A93]" size={20} />}
          Crear Nuevo {type === 'file' ? 'Archivo Markdown' : 'Carpeta'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#2F4156]/80 uppercase tracking-wider mb-2">
              Tipo de Elemento
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setType('file')}
                className={`py-2 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  type === 'file'
                    ? 'bg-[#C8D9E6] border-[#3A75A4] text-[#2F4156] font-semibold'
                    : 'border-[#E2D9D2] bg-[#F5EFEB] text-[#2F4156]/70 hover:bg-[#FFE1E6]/40'
                }`}
              >
                <FilePlus size={16} /> Archivo (.md)
              </button>
              <button
                type="button"
                onClick={() => setType('folder')}
                className={`py-2 px-3 rounded-lg border text-sm font-medium flex items-center justify-center gap-2 transition-all ${
                  type === 'folder'
                    ? 'bg-[#F7C9D4] border-[#E07A93] text-[#2F4156] font-semibold'
                    : 'border-[#E2D9D2] bg-[#F5EFEB] text-[#2F4156]/70 hover:bg-[#FFE1E6]/40'
                }`}
              >
                <FolderPlus size={16} /> Carpeta
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#2F4156]/80 uppercase tracking-wider mb-1">
              Nombre {type === 'file' ? 'del Archivo' : 'de la Carpeta'}
            </label>
            <input
              type="text"
              autoFocus
              placeholder={type === 'file' ? 'ej. metricas-ventas' : 'ej. Reportes 2026'}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#F5EFEB] border border-[#E2D9D2] focus:border-[#3A75A4] focus:outline-none rounded-lg px-3 py-2 text-sm text-[#2F4156] placeholder-[#2F4156]/40 transition-colors"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-[#2F4156]/80 hover:text-[#2F4156] bg-transparent rounded-lg hover:bg-[#F5EFEB] transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 text-sm font-medium text-[#F5EFEB] bg-[#2F4156] hover:bg-[#3d526a] disabled:opacity-50 rounded-lg shadow-md font-semibold transition-all"
            >
              Crear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
