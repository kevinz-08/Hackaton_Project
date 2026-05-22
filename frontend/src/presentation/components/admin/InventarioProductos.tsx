'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { PRODUCTOS, ProductoInventario } from '@/data/insumos';
import { Pagination } from './Pagination';

const PAGE_SIZE = 10;

export function InventarioProductos() {
  const [productos, setProductos] = useState<ProductoInventario[]>(PRODUCTOS);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'TODOS' | 'Disponible' | 'Stock Bajo'>('TODOS');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ProductoInventario>>({});

  const filtered = useMemo(() => {
    let items = productos;
    if (filter !== 'TODOS') items = items.filter((p) => p.estado === filter);
    if (search) {
      const q = search.toLowerCase();
      items = items.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q),
      );
    }
    return items;
  }, [productos, search, filter]);

  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);

  const totalProducidas = productos.reduce((a, b) => a + b.unidadesProducidas, 0);
  const totalEntregadas = productos.reduce((a, b) => a + b.unidadesEntregadas, 0);

  const openEdit = (p: ProductoInventario) => {
    setEditingId(p.id);
    setEditForm({
      unidadesProducidas: p.unidadesProducidas,
      unidadesEntregadas: p.unidadesEntregadas,
      enProduccion: p.enProduccion,
      reservadas: p.reservadas,
    });
  };

  const handleSave = () => {
    if (!editingId) return;
    const { unidadesProducidas, unidadesEntregadas, enProduccion, reservadas } = editForm;
    if (
      unidadesProducidas === undefined ||
      unidadesEntregadas === undefined ||
      enProduccion === undefined ||
      reservadas === undefined
    ) return;
    const disponibles = unidadesProducidas - unidadesEntregadas - enProduccion - reservadas;
    setProductos((prev) =>
      prev.map((p) =>
        p.id === editingId
          ? {
              ...p,
              unidadesProducidas,
              unidadesEntregadas,
              enProduccion,
              reservadas,
              unidadesDisponibles: Math.max(0, disponibles),
              estado: disponibles > 0 ? 'Disponible' : 'Stock Bajo',
            }
          : p,
      ),
    );
    setEditingId(null);
    setEditForm({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Mini KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Producidas', value: totalProducidas.toString(), color: '#7C3AED' },
          { label: 'Entregadas', value: totalEntregadas.toString(), color: '#10B981' },
          { label: 'En Producción', value: productos.reduce((a, b) => a + b.enProduccion, 0).toString(), color: '#3B82F6' },
          { label: 'Reservadas', value: productos.reduce((a, b) => a + b.reservadas, 0).toString(), color: '#F59E0B' },
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
          placeholder="Buscar producto, ID o categoría..."
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
          {(['TODOS', 'Disponible', 'Stock Bajo'] as const).map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setCurrentPage(1); }}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                backgroundColor: filter === f ? '#7C3AED' : '#1A2235',
                color: filter === f ? '#F9FAFB' : '#4B5563',
              }}
            >
              {f === 'TODOS' ? 'Todos' : f === 'Disponible' ? 'Disponible' : 'Stock Bajo'}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border overflow-x-auto" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ backgroundColor: '#0A0F1C' }}>
              {['ID', 'Producto', 'Categoría', 'Producidas', 'Entregadas', 'Progreso', 'Disponibles', 'En Prod.', 'Reserv.', 'Estado', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-medium text-xs uppercase tracking-wider" style={{ color: '#4B5563' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((p) => {
              const entregadasRatio = p.unidadesProducidas > 0 ? p.unidadesEntregadas / p.unidadesProducidas : 0;
              const dispRatio = p.unidadesProducidas > 0 ? p.unidadesDisponibles / p.unidadesProducidas : 0;
              return (
                <tr
                  key={p.id}
                  className="border-t transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(124,58,237,0.05)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = ''; }}
                >
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: '#7C3AED' }}>{p.id}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#F9FAFB' }}>{p.nombre}</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2 py-0.5 rounded text-xs font-medium" style={{ backgroundColor: '#1A2235', color: '#3B82F6' }}>
                      {p.categoria}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#F9FAFB' }}>{p.unidadesProducidas}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: '#10B981' }}>{p.unidadesEntregadas}</td>
                  <td className="px-4 py-3 min-w-[100px]">
                    <div className="flex items-center gap-2">
                      <div className="w-full h-2 rounded-full" style={{ backgroundColor: '#1A2235' }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${(entregadasRatio * 100).toFixed(0)}%`,
                            backgroundColor: '#10B981',
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium" style={{ color: '#4B5563' }}>
                        {Math.round(entregadasRatio * 100)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-medium" style={{ color: '#F9FAFB' }}>{p.unidadesDisponibles}</span>
                      <div className="w-12 h-1.5 rounded-full" style={{ backgroundColor: '#1A2235' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${(dispRatio * 100).toFixed(0)}%`,
                            backgroundColor: '#7C3AED',
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: '#F59E0B' }}>{p.enProduccion}</td>
                  <td className="px-4 py-3" style={{ color: '#D1D5DB' }}>{p.reservadas}</td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: p.estado === 'Disponible' ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                        color: p.estado === 'Disponible' ? '#10B981' : '#EF4444',
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ backgroundColor: p.estado === 'Disponible' ? '#10B981' : '#EF4444' }}
                      />
                      {p.estado === 'Disponible' ? 'Disp.' : 'Stock Bajo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openEdit(p)}
                      className="p-1.5 rounded-lg transition-all text-xs font-medium"
                      style={{ color: '#3B82F6', backgroundColor: 'rgba(59,130,246,0.1)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(59,130,246,0.1)'; }}
                    >
                      ✎
                    </button>
                  </td>
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

      {/* Modal edit producto */}
      {editingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
          onClick={() => { setEditingId(null); }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-xl p-6 w-full max-w-sm mx-4 border"
            style={{ backgroundColor: '#111827', borderColor: 'rgba(255,255,255,0.08)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold mb-1" style={{ color: '#F9FAFB' }}>
              Editar inventario
            </h3>
            <p className="text-sm mb-4" style={{ color: '#4B5563' }}>
              {productos.find((p) => p.id === editingId)?.nombre}
            </p>
            {([
              { key: 'unidadesProducidas', label: 'Producidas' },
              { key: 'unidadesEntregadas', label: 'Entregadas' },
              { key: 'enProduccion', label: 'En Producción' },
              { key: 'reservadas', label: 'Reservadas' },
            ] as const).map((field) => (
              <div key={field.key} className="mb-3">
                <label className="text-xs font-medium mb-1 block" style={{ color: '#4B5563' }}>
                  {field.label}
                </label>
                <input
                  type="number"
                  min="0"
                  value={editForm[field.key] ?? 0}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      [field.key]: parseInt(e.target.value) || 0,
                    }))
                  }
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
            ))}
            <div className="flex gap-2 justify-end mt-4">
              <button
                onClick={() => setEditingId(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ backgroundColor: '#1A2235', color: '#94A3B8' }}
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ backgroundColor: '#7C3AED', color: '#F9FAFB' }}
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
