'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { MATERIALES, MaterialInsumo } from '@/data/insumos';
import { Pagination } from './Pagination';

const PAGE_SIZE = 10;

export function InventarioMateriales() {
  const [materiales, setMateriales] = useState<MaterialInsumo[]>(MATERIALES);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'TODOS' | 'OK' | 'Stock Bajo'>('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addKg, setAddKg] = useState('');

  const filtered = useMemo(() => {
    let items = materiales;
    if (filter !== 'TODOS') items = items.filter((m) => m.estado === filter);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (m) =>
          m.nombre.toLowerCase().includes(q) ||
          m.tipo.toLowerCase().includes(q) ||
          m.color.toLowerCase().includes(q) ||
          m.proveedor.toLowerCase().includes(q),
      );
    }
    return items;
  }, [materiales, search, filter]);

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const totalStock = materiales.reduce((a, b) => a + b.stockKg, 0);
  const bajoStock = materiales.filter((m) => m.estado === 'Stock Bajo').length;

  const handleAddStock = () => {
    if (!editingId || !addKg) return;
    const kg = parseFloat(addKg);
    if (isNaN(kg) || kg <= 0) return;
    setMateriales((prev) =>
      prev.map((m) =>
        m.id === editingId
          ? {
              ...m,
              stockKg: Math.round((m.stockKg + kg) * 100) / 100,
              estado: m.stockKg + kg >= m.stockMinKg ? 'OK' : 'Stock Bajo',
            }
          : m,
      ),
    );
    setEditingId(null);
    setAddKg('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mini KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Material', value: `${totalStock.toFixed(1)} kg`, color: '#7C3AED' },
          { label: 'Tipos de Material', value: materiales.length.toString(), color: '#3B82F6' },
          { label: 'Stock Bajo', value: bajoStock.toString(), color: '#EF4444' },
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

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar material, tipo, color, proveedor..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
          className="flex-1 px-4 py-2 rounded-lg text-sm outline-none border transition-all"
          style={{
            backgroundColor: '#0A0F1C',
            color: '#F9FAFB',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
        />
        <div className="flex gap-2">
          {(['TODOS', 'OK', 'Stock Bajo'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: filter === f ? '#7C3AED' : '#1A2235',
                color: filter === f ? '#F9FAFB' : '#4B5563',
              }}
            >
              {f === 'TODOS' ? 'Todos' : f === 'OK' ? 'OK' : 'Stock Bajo'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-x-auto" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#0A0F1C' }}>
              {['Material', 'Tipo', 'Color', 'Stock', 'Barra', 'Mín', 'Máx', 'Proveedor', 'Estado', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider" style={{ color: '#4B5563' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((m) => {
              const ratio = Math.min(m.stockKg / m.stockMaxKg, 1);
              return (
                <tr
                  key={m.id}
                  className="border-t transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                >
                  <td className="px-4 py-3 font-medium" style={{ color: '#F9FAFB' }}>{m.nombre}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#1A2235', color: '#7C3AED' }}>
                      {m.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#D1D5DB' }}>{m.color}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#F9FAFB' }}>{m.stockKg} kg</td>
                  <td className="px-4 py-3 min-w-[100px]">
                    <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#1A2235' }}>
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(ratio * 100).toFixed(0)}%`,
                          backgroundColor: m.estado === 'Stock Bajo' ? '#EF4444' : '#7C3AED',
                        }}
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#6B7280' }}>{m.stockMinKg} kg</td>
                  <td className="px-4 py-3" style={{ color: '#6B7280' }}>{m.stockMaxKg} kg</td>
                  <td className="px-4 py-3" style={{ color: '#D1D5DB' }}>{m.proveedor}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: m.estado === 'OK' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        color: m.estado === 'OK' ? '#10B981' : '#EF4444',
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: m.estado === 'OK' ? '#10B981' : '#EF4444' }}
                      />
                      {m.estado === 'OK' ? 'OK' : 'Stock Bajo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setEditingId(m.id)}
                      className="p-1.5 rounded-lg transition-all text-xs font-medium"
                      style={{ color: '#7C3AED', backgroundColor: 'rgba(124,58,237,0.1)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.1)'; }}
                    >
                      +kg
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {paginated.length === 0 && (
          <div className="text-center py-10" style={{ color: '#4B5563' }}>
            No se encontraron materiales
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

      {/* Modal add stock */}
      {editingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => { setEditingId(null); setAddKg(''); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-xl p-6 w-full max-w-sm mx-4 border"
            style={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-1" style={{ color: '#F9FAFB' }}>
              Agregar stock
            </h3>
            <p className="text-sm mb-4" style={{ color: '#4B5563' }}>
              {materiales.find((m) => m.id === editingId)?.nombre}
              <br />
              <span style={{ color: '#94A3B8' }}>
                Stock actual: {materiales.find((m) => m.id === editingId)?.stockKg} kg
              </span>
            </p>
            <input
              type="number"
              step="0.1"
              min="0"
              placeholder=" kg a agregar..."
              autoFocus
              value={addKg}
              onChange={(e) => setAddKg(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddStock(); }}
              className="w-full px-4 py-2 rounded-lg text-sm outline-none border mb-4 transition-all"
              style={{
                backgroundColor: '#0A0F1C',
                color: '#F9FAFB',
                borderColor: 'rgba(255,255,255,0.08)',
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setEditingId(null); setAddKg(''); }}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ backgroundColor: '#1A2235', color: '#94A3B8' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleAddStock}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ backgroundColor: '#7C3AED', color: '#F9FAFB' }}
              >
                Agregar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
