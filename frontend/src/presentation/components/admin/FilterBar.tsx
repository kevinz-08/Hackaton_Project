'use client';
import { useMemo } from 'react';
import { Estado, ESTADO_LABELS, Prioridad, PRIORIDAD_LABELS, Solicitud } from '@/types';

interface FilterBarProps {
  solicitudes: Solicitud[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  ciudadFiltro: string;
  onCiudadChange: (c: string) => void;
  estadoFiltro: Estado | undefined;
  onEstadoChange: (e: Estado | undefined) => void;
  prioridadFiltro: Prioridad | undefined;
  onPrioridadChange: (p: Prioridad | undefined) => void;
}

const ESTADOS = Object.keys(ESTADO_LABELS) as Estado[];
const PRIORIDADES = Object.keys(PRIORIDAD_LABELS) as Prioridad[];

export function FilterBar({
  solicitudes,
  searchQuery,
  onSearchChange,
  ciudadFiltro,
  onCiudadChange,
  estadoFiltro,
  onEstadoChange,
  prioridadFiltro,
  onPrioridadChange,
}: FilterBarProps) {
  const ciudades = useMemo(
    () => [...new Set(solicitudes.map((s) => s.ciudad))].sort(),
    [solicitudes],
  );

  const hasActiveFilters = searchQuery || ciudadFiltro || estadoFiltro || prioridadFiltro;

  const activePills: { label: string; onClear: () => void }[] = [];
  if (ciudadFiltro) activePills.push({ label: `Ciudad: ${ciudadFiltro}`, onClear: () => onCiudadChange('') });
  if (estadoFiltro) activePills.push({ label: `Estado: ${ESTADO_LABELS[estadoFiltro]}`, onClear: () => onEstadoChange(undefined) });
  if (prioridadFiltro) activePills.push({ label: `Prioridad: ${PRIORIDAD_LABELS[prioridadFiltro]}`, onClear: () => onPrioridadChange(undefined) });

  const selectBase = 'w-full sm:w-auto bg-[#111827] border border-white/10 rounded-lg px-3 py-2 text-sm text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED] transition-all appearance-none cursor-pointer';

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: '#4B5563' }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por nombre, cédula, correo..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#111827] border border-white/10 rounded-lg pl-10 pr-3 py-2 text-sm text-[#F9FAFB] placeholder-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#7C3AED]/50 focus:border-[#7C3AED] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#4B5563] hover:text-[#94A3B8] transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={ciudadFiltro}
          onChange={(e) => onCiudadChange(e.target.value)}
          className={selectBase}
        >
          <option value="">Todas las ciudades</option>
          {ciudades.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={estadoFiltro ?? ''}
          onChange={(e) => onEstadoChange((e.target.value as Estado) || undefined)}
          className={selectBase}
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
          ))}
        </select>

        <select
          value={prioridadFiltro ?? ''}
          onChange={(e) => onPrioridadChange((e.target.value as Prioridad) || undefined)}
          className={selectBase}
        >
          <option value="">Todas las prioridades</option>
          {PRIORIDADES.map((p) => (
            <option key={p} value={p}>{PRIORIDAD_LABELS[p]}</option>
          ))}
        </select>
      </div>

      {activePills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {activePills.map((pill) => (
            <button
              key={pill.label}
              onClick={pill.onClear}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all hover:brightness-125"
              style={{
                backgroundColor: '#7C3AED20',
                color: '#C4A8FF',
                border: '1px solid #7C3AED40',
              }}
            >
              {pill.label}
              <span className="text-[#7C3AED] hover:text-white transition-colors">✕</span>
            </button>
          ))}
          <button
            onClick={() => { onSearchChange(''); onCiudadChange(''); onEstadoChange(undefined); onPrioridadChange(undefined); }}
            className="text-xs px-2 py-1 rounded-full transition-colors"
            style={{ color: '#4B5563' }}
          >
            Limpiar todo
          </button>
        </div>
      )}
    </div>
  );
}
