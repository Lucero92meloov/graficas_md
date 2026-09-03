import React, { useState } from 'react';
import { FolderPlus, FilePlus, RefreshCw, HardDriveUpload, X, FolderTree } from 'lucide-react';
import { FolderItem } from './FolderItem';
import { FileItem } from './FileItem';
import { CreateModal } from './CreateModal';

export function Sidebar({
  fileTree,
  activeFileId,
  onSelectFile,
  onToggleFolder,
  onCreateItem,
  onDeleteItem,
  onRenameItem,
  onResetSamples,
  isOpen,
  onClose
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [targetParentId, setTargetParentId] = useState('root');

  const handleOpenModal = (parentId = 'root') => {
    setTargetParentId(parentId);
    setModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      if (file.name.endsWith('.md') || file.type.includes('markdown') || file.type.includes('text')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          onCreateItem('root', file.name, 'file');
        };
        reader.readAsText(file);
      }
    });
  };

  const handleSelectFileMobile = (fileId) => {
    onSelectFile(fileId);
    // En pantallas móviles cerramos automáticamente el drawer al seleccionar un archivo
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay oscuro para pantallas móviles */}
      {isOpen && (
        <div
          onClick={onClose}
          className="md:hidden fixed inset-0 bg-[#2F4156]/40 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Panel / Drawer Lateral */}
      <aside
        className={`fixed md:relative inset-y-0 left-0 z-40 w-72 md:w-64 bg-[#FAF5F2] border-r border-[#E2D9D2] flex flex-col h-full select-none transition-transform duration-300 ease-in-out shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Header del Explorador de Archivos */}
        <div className="p-3 border-b border-[#E2D9D2] flex items-center justify-between bg-[#F5EFEB]">
          <div className="flex items-center gap-2 font-semibold text-xs text-[#2F4156] uppercase tracking-wider">
            <FolderTree size={16} className="text-[#3A75A4]" />
            <span>Explorador .MD</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => handleOpenModal('root')}
              className="p-1.5 text-[#2F4156] hover:bg-[#C8D9E6]/50 rounded-md transition-colors"
              title="Crear en raíz"
            >
              <FilePlus size={15} />
            </button>

            <label className="p-1.5 text-[#2F4156] hover:bg-[#C8D9E6]/50 rounded-md cursor-pointer transition-colors" title="Subir archivo .md">
              <HardDriveUpload size={15} />
              <input type="file" accept=".md,.txt" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={onResetSamples}
              className="p-1.5 text-[#2F4156] hover:text-[#E07A93] hover:bg-[#FFE1E6]/60 rounded-md transition-colors"
              title="Restablecer muestras"
            >
              <RefreshCw size={14} />
            </button>

            <button
              onClick={onClose}
              className="md:hidden p-1.5 text-[#2F4156] hover:bg-[#E2D9D2] rounded-md transition-colors ml-1"
              title="Cerrar panel"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Árbol de archivos y carpetas */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {fileTree && fileTree.length > 0 ? (
            fileTree.map((item) => (
              item.type === 'folder' ? (
                <FolderItem
                  key={item.id}
                  folder={item}
                  activeFileId={activeFileId}
                  onSelectFile={handleSelectFileMobile}
                  onToggleFolder={onToggleFolder}
                  onOpenCreateModal={handleOpenModal}
                  onDelete={onDeleteItem}
                  onRename={onRenameItem}
                />
              ) : (
                <FileItem
                  key={item.id}
                  file={item}
                  activeFileId={activeFileId}
                  onSelect={handleSelectFileMobile}
                  onDelete={onDeleteItem}
                  onRename={onRenameItem}
                />
              )
            ))
          ) : (
            <div className="text-center py-8 px-4">
              <p className="text-xs text-[#2F4156]/60 mb-3">No hay archivos en el explorador.</p>
              <button
                onClick={() => handleOpenModal('root')}
                className="px-3 py-1.5 text-xs bg-[#C8D9E6] border border-[#9fbcd2] text-[#2F4156] font-semibold rounded-lg hover:bg-[#b5cadb] transition-all inline-flex items-center gap-1.5"
              >
                <FilePlus size={14} /> Crear primer archivo
              </button>
            </div>
          )}
        </div>

        {/* Footer de información */}
        <div className="p-2.5 border-t border-[#E2D9D2] bg-[#F5EFEB] text-[11px] text-[#2F4156]/70 flex justify-between items-center">
          <span>Mobile Responsive</span>
          <span className="text-[#3A75A4] font-mono font-semibold">.MD Studio</span>
        </div>

        {/* Modal para crear carpetas / archivos */}
        <CreateModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onCreate={onCreateItem}
          parentId={targetParentId}
        />
      </aside>
    </>
  );
}
