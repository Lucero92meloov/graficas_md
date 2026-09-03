import React from 'react';
import { Package, Award, Sparkles, CheckCircle2, Clock } from 'lucide-react';

export const PACKAGES = [
  { id: '2k', label: '2K Vistas + 100 Likes', views: 2000, likes: 100, chip: '2K / 100' },
  { id: '5k', label: '5K Vistas + 200 Likes', views: 5000, likes: 200, chip: '5K / 200' },
  { id: '10k', label: '10K Vistas + 300 Likes', views: 10000, likes: 300, chip: '10K / 300' },
  { id: '20k', label: '20K Vistas + 1K Likes', views: 20000, likes: 1000, chip: '20K / 1K' },
  { id: '50k', label: '50K Vistas + 1K Likes', views: 50000, likes: 1000, chip: '50K / 1K' },
  { id: '100k', label: '100K Vistas + 1.2K Likes', views: 100000, likes: 1200, chip: '100K / 1.2K' },
  { id: '500k', label: '500K Vistas + 3K Likes', views: 500000, likes: 3000, chip: '500K / 3K' },
  { id: '1m', label: '1M Vistas + 4K Likes', views: 1000000, likes: 4000, chip: '1M / 4K' }
];

export function PackageSelector({ selectedPackage, onSelectPackage, maxPrimary, maxSecondary }) {
  const activePkg = PACKAGES.find((p) => p.id === selectedPackage);

  const formatNum = (num) => new Intl.NumberFormat('es-MX').format(num || 0);

  let viewsPct = 0;
  let likesPct = 0;
  let viewsMissing = 0;
  let likesMissing = 0;
  let viewsExtra = 0;
  let likesExtra = 0;
  let isViewsComplete = false;
  let isLikesComplete = false;

  if (activePkg) {
    viewsPct = ((maxPrimary / activePkg.views) * 100).toFixed(1);
    likesPct = ((maxSecondary / activePkg.likes) * 100).toFixed(1);

    isViewsComplete = maxPrimary >= activePkg.views;
    isLikesComplete = maxSecondary >= activePkg.likes;

    viewsMissing = activePkg.views - maxPrimary;
    likesMissing = activePkg.likes - maxSecondary;

    viewsExtra = maxPrimary - activePkg.views;
    likesExtra = maxSecondary - activePkg.likes;
  }

  return (
    <div className="bg-white border border-[#E2D9D2] rounded-xl p-3 shadow-xs space-y-2.5 font-sans">
      {/* Encabezado */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold text-[#2F4156] flex items-center gap-1.5">
          <Package size={15} className="text-[#3A75A4]" />
          Filtro por Paquete Adquirido
        </span>

        {selectedPackage && (
          <button
            onClick={() => onSelectPackage(null)}
            className="text-[11px] font-semibold text-[#E07A93] hover:underline cursor-pointer"
          >
            Quitar Filtro
          </button>
        )}
      </div>

      {/* Chips de Selección de Paquete */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onSelectPackage(null)}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer border ${
            !selectedPackage
              ? 'bg-[#2F4156] text-white border-[#2F4156] shadow-xs'
              : 'bg-[#F5EFEB] text-[#2F4156] border-[#E2D9D2] hover:bg-white'
          }`}
        >
          Todos
        </button>

        {PACKAGES.map((pkg) => {
          const isSelected = selectedPackage === pkg.id;
          return (
            <button
              key={pkg.id}
              onClick={() => onSelectPackage(pkg.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-[#3A75A4] text-white border-[#3A75A4] shadow-xs scale-[1.02]'
                  : 'bg-[#F5EFEB] text-[#2F4156] border-[#E2D9D2] hover:bg-white'
              }`}
            >
              {pkg.chip}
            </button>
          );
        })}
      </div>

      {/* Resultado de Cumplimiento / Cantidad Faltante */}
      {activePkg && (
        <div className="pt-1 space-y-2 text-xs font-sans">
          <div className="flex items-center justify-between font-bold text-[#2F4156]">
            <span className="flex items-center gap-1.5">
              <Award size={14} className="text-[#3A75A4]" />
              Evaluación de Paquete: <span className="text-[#3A75A4]">{activePkg.label}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Tarjeta Visualizaciones */}
            <div className="bg-[#F5EFEB] border border-[#9fbcd2] p-2.5 rounded-xl shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#3A75A4]">🔵 Visualizaciones</span>
                <span className="font-mono font-bold text-[#2F4156]">
                  {formatNum(maxPrimary)} / {formatNum(activePkg.views)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-sm font-bold font-mono text-[#3A75A4]">
                  {viewsPct}%
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    isViewsComplete
                      ? 'bg-[#C8D9E6] text-[#2F4156]'
                      : 'bg-[#FFE1E6] text-[#E07A93]'
                  }`}
                >
                  {isViewsComplete ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {isViewsComplete
                    ? `+${formatNum(viewsExtra)} extra (+${(viewsPct - 100).toFixed(1)}% 🎉)`
                    : `Faltan ${formatNum(viewsMissing)} vistas (${(100 - viewsPct).toFixed(1)}%)`}
                </span>
              </div>
            </div>

            {/* Tarjeta Likes */}
            <div className="bg-[#F5EFEB] border border-[#e8a3b4] p-2.5 rounded-xl shadow-xs space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-[#E07A93]">🩷 Likes</span>
                <span className="font-mono font-bold text-[#2F4156]">
                  {formatNum(maxSecondary)} / {formatNum(activePkg.likes)}
                </span>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-sm font-bold font-mono text-[#E07A93]">
                  {likesPct}%
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    isLikesComplete
                      ? 'bg-[#F7C9D4] text-[#2F4156]'
                      : 'bg-[#FFE1E6] text-[#E07A93]'
                  }`}
                >
                  {isLikesComplete ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  {isLikesComplete
                    ? `+${formatNum(likesExtra)} extra (+${(likesPct - 100).toFixed(1)}% 🎉)`
                    : `Faltan ${formatNum(likesMissing)} likes (${(100 - likesPct).toFixed(1)}%)`}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
