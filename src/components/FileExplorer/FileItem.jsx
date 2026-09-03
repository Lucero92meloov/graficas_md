import React, { useState } from 'react';
import { FileText, Trash2, Edit2, Check, X } from 'lucide-react';

export function FileItem({ file, activeFileId, onSelect, onDelete, onRename }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(file.name);

  const isActive = activeFileId === file.id;

  const handleRenameSubmit = (e) => {
    e.stopPropagation();
    if (newName.trim()) {
      onRename(file.id, newName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setNewName(file.name);
    setIsEditing(false);
  };

  return (
    <div
      onClick={() => onSelect(file.id)}
      className={`group flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer text-xs font-medium transition-all ${
        isActive
          ? 'bg-white text-[#2F4156] border border-[#C8D9E6] shadow-xs font-semibold'
          : 'text-[#2F4156]/90 hover:bg-[#FFE1E6]/40 hover:text-[#2F4156] border border-transparent'
      }`}
    >
      <div className="flex items-center gap-2 overflow-hidden flex-1">
        <FileText size={14} className={isActive ? 'text-[#3A75A4] shrink-0' : 'text-[#2F4156]/50 shrink-0'} />
        
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRenameSubmit(e);
              if (e.key === 'Escape') handleCancel(e);
            }}
            autoFocus
            className="bg-white border border-[#3A75A4] rounded px-1.5 py-0.5 text-xs text-[#2F4156] focus:outline-none w-full"
          />
        ) : (
          <span className="truncate">{file.name}</span>
        )}
      </div>

      {/* Acciones flotantes */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {isEditing ? (
          <>
            <button
              onClick={handleRenameSubmit}
              className="p-1 hover:text-emerald-600 text-[#2F4156]/70 transition-colors"
              title="Guardar nombre"
            >
              <Check size={12} />
            </button>
            <button
              onClick={handleCancel}
              className="p-1 hover:text-rose-600 text-[#2F4156]/70 transition-colors"
              title="Cancelar"
            >
              <X size={12} />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="p-1 hover:text-[#3A75A4] text-[#2F4156]/60 transition-colors"
              title="Renombrar"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (confirm(`¿Eliminar ${file.name}?`)) onDelete(file.id);
              }}
              className="p-1 hover:text-[#E07A93] text-[#2F4156]/60 transition-colors"
              title="Eliminar"
            >
              <Trash2 size={12} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
