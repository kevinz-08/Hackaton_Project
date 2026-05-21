'use client';
import { useState } from 'react';
import { Estado, ESTADO_LABELS } from '@/types';
import { useSolicitudes } from '@/presentation/hooks/use-solicitudes';
import { AdminTable } from '@/presentation/components/AdminTable';
import { EstadoBadge } from '@/presentation/components/EstadoBadge';

const ESTADOS = Object.keys(ESTADO_LABELS) as Estado[];

export default function AdminPage() {
  const [ciudadFiltro, setCiudadFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<Estado | undefined>();
  const { solicitudes, loading, error, updateLocalEstado } = useSolicitudes(
    ciudadFiltro || undefined,
    estadoFiltro,
  );

  const ciudades = [...new Set(solicitudes.map((s) => s.ciudad))].sort();

  const contadores = ESTADOS.reduce<Record<string, number>>(
    (acc, e) => ({ ...acc, [e]: solicitudes.filter((s) => s.estado === e).length }),
    {},
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-500 mt-1">Gestión de solicitudes de producción ANDES.</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{solicitudes.length}</p>
          <p className="text-xs text-gray-500 mt-0.5">Total</p>
        </div>
        {ESTADOS.map((e) => (
          <div key={e} className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-gray-900">{contadores[e] ?? 0}</p>
            <div className="mt-1 flex justify-center"><EstadoBadge estado={e} /></div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={ciudadFiltro}
          onChange={(e) => setCiudadFiltro(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todas las ciudades</option>
          {ciudades.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select
          value={estadoFiltro ?? ''}
          onChange={(e) => setEstadoFiltro((e.target.value as Estado) || undefined)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Todos los estados</option>
          {ESTADOS.map((e) => (
            <option key={e} value={e}>{ESTADO_LABELS[e]}</option>
          ))}
        </select>
      </div>

      {loading && <div className="h-64 bg-white animate-pulse rounded-xl border border-gray-100" />}
      {error && <div className="text-center py-16 text-red-500">{error}</div>}
      {!loading && !error && (
        <AdminTable solicitudes={solicitudes} onEstadoChange={updateLocalEstado} />
      )}
    </div>
  );
}
