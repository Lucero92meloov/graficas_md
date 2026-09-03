import React from 'react';
import { Eye, Heart, Folder, FileText, LineChart, Sparkles } from 'lucide-react';

/**
 * Componente de Iconos Sólidos Animados adaptado al TEMA CLARO:
 * Beige (#F5EFEB), Navy (#2F4156), Sky Blue (#3A75A4), Azalea (#E07A93), Pale Pink (#FFE1E6)
 */
export function AnimatedIcon({ name, size = 18, className = '' }) {
  if (name === 'eye') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <span className="absolute inset-0 rounded-full bg-[#C8D9E6]/40 animate-ping opacity-40" />
        <Eye
          size={size}
          className="text-[#3A75A4] fill-[#C8D9E6] animate-eye-glow stroke-[2.2] drop-shadow-[0_2px_4px_rgba(58,117,164,0.4)]"
        />
      </div>
    );
  }

  if (name === 'heart') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <Heart
          size={size}
          className="text-[#E07A93] fill-[#F7C9D4] animate-heartbeat stroke-[2] drop-shadow-[0_2px_6px_rgba(224,122,147,0.5)]"
        />
      </div>
    );
  }

  if (name === 'folder') {
    return (
      <Folder
        size={size}
        className={`text-[#3A75A4] fill-[#C8D9E6]/60 transition-transform duration-300 group-hover:scale-110 ${className}`}
      />
    );
  }

  if (name === 'chart') {
    return (
      <LineChart
        size={size}
        className={`text-[#3A75A4] animate-float stroke-[2.2] ${className}`}
      />
    );
  }

  return <Sparkles size={size} className={`text-[#E07A93] animate-spin ${className}`} />;
}
