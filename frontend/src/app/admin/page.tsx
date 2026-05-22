'use client';
import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Estado, Prioridad, Solicitud, ESTADO_LABELS } from '@/types';
import { useSolicitudes } from '@/presentation/hooks/use-solicitudes';
import { KpiCards } from '@/presentation/components/admin/KpiCards';
import { FilterBar } from '@/presentation/components/admin/FilterBar';
import { ExportButton } from '@/presentation/components/admin/ExportButton';
import { Pagination } from '@/presentation/components/admin/Pagination';
import { AdminTable } from '@/presentation/components/AdminTable';

const ESTADOS = Object.keys(ESTADO_LABELS) as Estado[];
const PAGE_SIZE = 10;

export default function AdminPage() {
  const [ciudadFiltro, setCiudadFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<Estado | undefined>();
  const [prioridadFiltro, setPrioridadFiltro] = useState<Prioridad | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { solicitudes, loading, error, refresh, updateLocalEstado } = useSolicitudes(
    ciudadFiltro || undefined,
    estadoFiltro,
  );

  const filtered = useMemo(() => {
    let result = solicitudes;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.nombre.toLowerCase().includes(q) ||
          s.cedula.includes(q) ||
          s.correo.toLowerCase().includes(q) ||
          s.telefono.includes(q) ||
          s.ciudad.toLowerCase().includes(q),
      );
    }

    if (prioridadFiltro) {
      result = result.filter((s) => (s.prioridad ?? 'MEDIA') === prioridadFiltro);
    }

    return result;
  }, [solicitudes, searchQuery, prioridadFiltro]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const contadores = useMemo(
    () =>
      ESTADOS.reduce<Record<string, number>>(
        (acc, e) => ({ ...acc, [e]: filtered.filter((s) => s.estado === e).length }),
        {},
      ),
    [filtered],
  );

  const handleFilterChange = useCallback(() => {
    setCurrentPage(1);
  }, []);

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#06020E' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <div className="flex items-center gap-2 text-xs mb-1" style={{ color: '#4B5563' }}>
              <span>ANDES 3D</span>
              <span>/</span>
              <span style={{ color: '#7C3AED' }}>Admin</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#F9FAFB' }}>
              Panel de producción
            </h1>
            <p className="text-sm mt-1" style={{ color: '#4B5563' }}>
              {filtered.length} solicitud{filtered.length !== 1 ? 'es' : ''}{' '}
              {searchQuery || prioridadFiltro ? 'coincidentes' : 'registradas'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ExportButton data={filtered} />
            <button
              onClick={refresh}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                backgroundColor: '#1A2235',
                color: '#F9FAFB',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1E2D45'; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#1A2235'; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23 4 23 10 17 10" />
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
              </svg>
              Sincronizar
            </button>
          </div>
        </motion.div>

        {/* KPIs */}
        {!loading && !error && (
          <div className="mb-6">
            <KpiCards total={filtered.length} contadores={contadores} />
          </div>
        )}

        {/* Filters */}
        <div className="mb-4">
          <FilterBar
            solicitudes={solicitudes}
            searchQuery={searchQuery}
            onSearchChange={(q) => { setSearchQuery(q); handleFilterChange(); }}
            ciudadFiltro={ciudadFiltro}
            onCiudadChange={(c) => { setCiudadFiltro(c); handleFilterChange(); }}
            estadoFiltro={estadoFiltro}
            onEstadoChange={(e) => { setEstadoFiltro(e); handleFilterChange(); }}
            prioridadFiltro={prioridadFiltro}
            onPrioridadChange={(p) => { setPrioridadFiltro(p); handleFilterChange(); }}
          />
        </div>

        {/* Content */}
        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 rounded-xl animate-pulse"
                style={{ backgroundColor: '#111827' }}
              />
            ))}
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 gap-4"
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl"
              style={{ backgroundColor: '#1A2235' }}
            >
              ⚠️
            </div>
            <p className="text-lg font-medium" style={{ color: '#EF4444' }}>
              Error al cargar solicitudes
            </p>
            <p className="text-sm" style={{ color: '#4B5563' }}>{error}</p>
            <button
              onClick={refresh}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                backgroundColor: '#7C3AED',
                color: '#F9FAFB',
              }}
            >
              Reintentar
            </button>
          </motion.div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
          >
            <AdminTable
              solicitudes={paginated}
              onEstadoChange={updateLocalEstado}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filtered.length}
              pageSize={PAGE_SIZE}
              onPageChange={setCurrentPage}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
