import { useState, useEffect } from 'react';
import { INITIAL_FILESYSTEM } from '../utils/sampleData';

const STORAGE_KEY = 'graficas_md_filesystem_v1';
const ACTIVE_FILE_KEY = 'graficas_md_active_file_id';

export function useFileSystem() {
  const [fileTree, setFileTree] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_FILESYSTEM;
    } catch {
      return INITIAL_FILESYSTEM;
    }
  });

  const [activeFileId, setActiveFileId] = useState(() => {
    try {
      const saved = localStorage.getItem(ACTIVE_FILE_KEY);
      return saved || 'file-vistas-principales';
    } catch {
      return 'file-vistas-principales';
    }
  });

  // Guardar en LocalStorage cada vez que cambie
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fileTree));
    } catch (e) {
      console.error('Error al guardar filesystem:', e);
    }
  }, [fileTree]);

  useEffect(() => {
    if (activeFileId) {
      try {
        localStorage.setItem(ACTIVE_FILE_KEY, activeFileId);
      } catch (e) {
        console.error('Error al guardar activeFileId:', e);
      }
    }
  }, [activeFileId]);

  // Buscar un archivo recursivamente
  const findFileById = (items, id) => {
    for (const item of items) {
      if (item.id === id) return item;
      if (item.type === 'folder' && item.children) {
        const found = findFileById(item.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const activeFile = findFileById(fileTree, activeFileId);

  // Actualizar contenido de un archivo
  const updateFileContent = (fileId, newContent) => {
    const updateRecursive = (items) => {
      return items.map(item => {
        if (item.id === fileId) {
          return { ...item, content: newContent };
        }
        if (item.type === 'folder' && item.children) {
          return { ...item, children: updateRecursive(item.children) };
        }
        return item;
      });
    };
    setFileTree(prev => updateRecursive(prev));
  };

  // Alternar apertura/cierre de carpeta
  const toggleFolder = (folderId) => {
    const toggleRecursive = (items) => {
      return items.map(item => {
        if (item.id === folderId) {
          return { ...item, isOpen: !item.isOpen };
        }
        if (item.type === 'folder' && item.children) {
          return { ...item, children: toggleRecursive(item.children) };
        }
        return item;
      });
    };
    setFileTree(prev => toggleRecursive(prev));
  };

  // Crear archivo o carpeta
  const createItem = (parentId, name, type) => {
    const newItem = {
      id: `${type}-${Date.now()}`,
      name: type === 'file' && !name.endsWith('.md') ? `${name}.md` : name,
      type,
      ...(type === 'folder' ? { isOpen: true, children: [] } : { content: `# ${name}\n\n| Fecha | Ojo | Corazón |\n| --- | --- | --- |\n| 01/09 | 100 | 10 |\n| 02/09 | 250 | 25 |\n` })
    };

    if (!parentId || parentId === 'root') {
      setFileTree(prev => [...prev, newItem]);
    } else {
      const addToFolder = (items) => {
        return items.map(item => {
          if (item.id === parentId && item.type === 'folder') {
            return {
              ...item,
              isOpen: true,
              children: [...(item.children || []), newItem]
            };
          }
          if (item.type === 'folder' && item.children) {
            return { ...item, children: addToFolder(item.children) };
          }
          return item;
        });
      };
      setFileTree(prev => addToFolder(prev));
    }

    if (type === 'file') {
      setActiveFileId(newItem.id);
    }
  };

  // Eliminar elemento
  const deleteItem = (itemId) => {
    const deleteRecursive = (items) => {
      return items
        .filter(item => item.id !== itemId)
        .map(item => {
          if (item.type === 'folder' && item.children) {
            return { ...item, children: deleteRecursive(item.children) };
          }
          return item;
        });
    };
    setFileTree(prev => deleteRecursive(prev));
    if (activeFileId === itemId) {
      setActiveFileId(null);
    }
  };

  // Renombrar elemento
  const renameItem = (itemId, newName) => {
    const renameRecursive = (items) => {
      return items.map(item => {
        if (item.id === itemId) {
          const finalName = item.type === 'file' && !newName.endsWith('.md') ? `${newName}.md` : newName;
          return { ...item, name: finalName };
        }
        if (item.type === 'folder' && item.children) {
          return { ...item, children: renameRecursive(item.children) };
        }
        return item;
      });
    };
    setFileTree(prev => renameRecursive(prev));
  };

  // Restablecer a muestras
  const resetToSamples = () => {
    setFileTree(INITIAL_FILESYSTEM);
    setActiveFileId('file-vistas-principales');
  };

  return {
    fileTree,
    activeFile,
    activeFileId,
    setActiveFileId,
    updateFileContent,
    toggleFolder,
    createItem,
    deleteItem,
    renameItem,
    resetToSamples
  };
}
