import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { FileItem } from './FileItem';

export function FolderItem({
  folder,
  activeFileId,
  onSelectFile,
  onToggleFolder,
  onOpenCreateModal,
  onDelete,
  onRename
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(folder.name);

  const handleRenameSubmit = (e) => {
    e.stopPropagation();
    if (newName.trim()) {
      onRename(folder.id, newName.trim());
    }
    setIsEditing(false);
  };

  const handleCancel = (e) => {
    e.stopPropagation();
    setNewName(folder.name);
    setIsEditing(false);
  };

  return (
    <div className="space-y-0.5">
      <div
        onClick={() => onToggleFolder(folder.id)}
        className="group flex items-center justify-between px-2 py-1.5 rounded-lg cursor-pointer text-xs font-semibold text-[#2F4156] hover:bg-[#FFE1E6]/50 transition-colors"
      >
        <div className="flex items-center gap-1.5 overflow-hidden flex-1">
          <span className="text-[#2F4156]/60">
            {folder.isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
          <span className="text-[#E07A93]">
            {folder.isOpen ? <FolderOpen size={15} /> : <Folder size={15} />}
          </span>

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
              className="bg-white border border-[#E07A93] rounded px-1.5 py-0.5 text-xs text-[#2F4156] focus:outline-none w-full"
            />
          ) : (
            <span className="truncate">{folder.name}</span>
          )}
        </div>

        {/* Acciones de Carpeta */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {isEditing ? (
            <>
              <button
                onClick={handleRenameSubmit}
                className="p-1 hover:text-emerald-600 text-[#2F4156]/70 transition-colors"
                title="Guardar"
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
                  onOpenCreateModal(folder.id);
                }}
                className="p-1 hover:text-[#3A75A4] text-[#2F4156]/60 transition-colors"
                title="Agregar elemento a carpeta"
              >
                <Plus size={13} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="p-1 hover:text-[#E07A93] text-[#2F4156]/60 transition-colors"
                title="Renombrar carpeta"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm(`¿Eliminar la carpeta ${folder.name} y todo su contenido?`)) {
                    onDelete(folder.id);
                  }
                }}
                className="p-1 hover:text-[#E07A93] text-[#2F4156]/60 transition-colors"
                title="Eliminar carpeta"
              >
                <Trash2 size={12} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Archivos y subcarpetas dentro de la carpeta */}
      {folder.isOpen && (
        <div className="pl-4 space-y-0.5 border-l border-[#E2D9D2] ml-2.5">
          {folder.children && folder.children.length > 0 ? (
            folder.children.map((child) => (
              child.type === 'folder' ? (
                <FolderItem
                  key={child.id}
                  folder={child}
                  activeFileId={activeFileId}
                  onSelectFile={onSelectFile}
                  onToggleFolder={onToggleFolder}
                  onOpenCreateModal={onOpenCreateModal}
                  onDelete={onDelete}
                  onRename={onRename}
                />
              ) : (
                <FileItem
                  key={child.id}
                  file={child}
                  activeFileId={activeFileId}
                  onSelect={onSelectFile}
                  onDelete={onDelete}
                  onRename={onRename}
                />
              )
            ))
          ) : (
            <div className="text-[11px] text-[#2F4156]/50 italic py-1 px-2">Carpeta vacía</div>
          )}
        </div>
      )}
    </div>
  );
}
