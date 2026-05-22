'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { TIEMPOS } from '@/data/insumos';
import { Pagination } from './Pagination';

const PAGE_SIZE = 10;

export function TiemposProduccion() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'id' | 'tiempoTotalH' | 'tiempoLote5H'>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const maxTotal = Math.max(...TIEMPOS.map((t) => t.tiempoTotalH));

  const filtered = useMemo(() => {
    let items = [...TIEMPOS];
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (t) =>
          t.nombre.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.material.toLowerCase().includes(q),
      );
    }
    items.sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      return (a[sortBy] < b[sortBy] ? -1 : 1) * mul;
    });
    return items;
  }, [search, sortBy, sortDir]);

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const sortToggle = (key: typeof sortBy) => {
    if (sortBy === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(key); setSortDir('asc'); }
    setCurrentPage(1);
  };

  const horasPromedio = TIEMPOS.reduce((a, b) => a + b.tiempoTotalH, 0) / TIEMPOS.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mini KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Productos', value: TIEMPOS.length.toString(), color: '#7C3AED' },
          { label: 'Horas Promedio', value: `${horasPromedio.toFixed(1)} h`, color: '#3B82F6' },
          { label: 'Mayor Tiempo', value: `${maxTotal} h`, color: '#F59E0B' },
          { label: 'Suma Total', value: `${TIEMPOS.reduce((a, b) => a + b.tiempoTotalH, 0).toFixed(0)} h`, color: '#10B981' },
        ].map((kpi, i) => (
          <div
            key={i}
            className="rounded-xl p-4 border"
            style={{
              backgroundColor: '#111827',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: '#4B5563' }}>
              {kpi.label}
            </p>
            <p className="text-2xl font-bold" style={{ color: kpi.color }}>
              {kpi.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre, ID o material..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="w-full px-4 py-2 rounded-lg text-sm outline-none border transition-all"
          style={{
            backgroundColor: '#0A0F1C',
            color: '#F9FAFB',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        />
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-x-auto" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#0A0F1C' }}>
              <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider cursor-pointer select-none" style={{ color: '#4B5563' }} onClick={() => sortToggle('id')}>
                ID {sortBy === 'id' && (sortDir === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider" style={{ color: '#4B5563' }}>Recurso</th>
              <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider" style={{ color: '#4B5563' }}>Material</th>
              <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider" style={{ color: '#4B5563' }}>Impresión</th>
              <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider" style={{ color: '#4B5563' }}>Post-Proceso</th>
              <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider cursor-pointer select-none" style={{ color: '#4B5563' }} onClick={() => sortToggle('tiempoTotalH')}>
                Total {sortBy === 'tiempoTotalH' && (sortDir === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider" style={{ color: '#4B5563' }}>Barra</th>
              <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider cursor-pointer select-none" style={{ color: '#4B5563' }} onClick={() => sortToggle('tiempoLote5H')}>
                Lote 5 {sortBy === 'tiempoLote5H' && (sortDir === 'asc' ? '▲' : '▼')}
              </th>
              <th className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider" style={{ color: '#4B5563' }}>Vel.</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((t) => {
              const ratio = t.tiempoTotalH / maxTotal;
              return (
                <tr
                  key={t.id}
                  className="border-t transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                >
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#7C3AED' }}>{t.id}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#F9FAFB' }}>{t.nombre}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#1A2235', color: '#F59E0B' }}>
                      {t.material}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#D1D5DB' }}>{t.tiempoImpresionH}h</td>
                  <td className="px-4 py-3" style={{ color: '#D1D5DB' }}>{t.tiempoPostProcesoH}h</td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#F9FAFB' }}>{t.tiempoTotalH}h</td>
                  <td className="px-4 py-3 min-w-[120px]">
                    <div className="w-full h-3 rounded-full" style={{ backgroundColor: '#1A2235' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(ratio * 100).toFixed(0)}%`,
                          backgroundColor: ratio > 0.7 ? '#7C3AED' : ratio > 0.4 ? '#3B82F6' : '#10B981',
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#F9FAFB' }}>{t.tiempoLote5H}h</td>
                  <td className="px-4 py-3" style={{ color: '#6B7280' }}>{t.velocidadMmS} mm/s</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {paginated.length === 0 && (
          <div className="text-center py-10" style={{ color: '#4B5563' }}>
            No se encontraron productos
          </div>
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={PAGE_SIZE}
        onPageChange={setCurrentPage}
      />
    </motion.div>
  );
}
