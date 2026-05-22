'use client';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Categoria, CATEGORIA_LABELS } from '@/types';
import { useModelos } from '@/presentation/hooks/use-modelos';
import { ModelCard } from '@/presentation/components/ModelCard';
import { HeroSection } from '@/presentation/components/HeroSection';

const FILTROS: Array<{ label: string; value: Categoria | undefined }> = [
  { label: 'Todos', value: undefined },
  ...Object.entries(CATEGORIA_LABELS).map(([value, label]) => ({
    label,
    value: value as Categoria,
  })),
];

export default function CatalogoPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState<Categoria | undefined>();
  const [search, setSearch] = useState('');
  const { modelos, loading, error } = useModelos(categoriaFiltro);

  const filtered = useMemo(() => {
    if (!search.trim()) return modelos;
    const q = search.toLowerCase();
    return modelos.filter(
      m => m.nombre.toLowerCase().includes(q) || m.descripcion.toLowerCase().includes(q)
    );
  }, [modelos, search]);

  return (
    <>
      <HeroSection />

      {/* Catalog */}
      <section id="catalogo" className="bg-[#06020E] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4"
          >
            <div>
              <h2 className="text-2xl font-bold text-white/90">Catálogo completo</h2>
              <p className="text-white/30 text-sm mt-0.5 font-medium">
                {loading
                  ? 'Cargando modelos…'
                  : `${filtered.length} modelo${filtered.length !== 1 ? 's' : ''} disponible${filtered.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64">
              <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10 10l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Buscar modelos…"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white/[0.04] border border-white/[0.08] rounded-full text-white placeholder-white/25 focus:outline-none focus:border-[#6C3FCF]/60 focus:ring-2 focus:ring-[#6C3FCF]/20 transition-all"
              />
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {FILTROS.map(({ label, value }) => {
              const active = categoriaFiltro === value;
              return (
                <motion.button
                  key={label}
                  onClick={() => setCategoriaFiltro(value)}
                  whileTap={{ scale: 0.94 }}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    active
                      ? 'bg-[#6C3FCF] text-white shadow-lg shadow-[#6C3FCF]/30 border border-[#6C3FCF]'
                      : 'bg-white/[0.04] text-white/45 border border-white/[0.07] hover:border-[#6C3FCF]/40 hover:text-white/80'
                  }`}
                >
                  {label}
                </motion.button>
              );
            })}
          </motion.div>

          {/* Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[#0F0720] rounded-2xl border border-white/[0.06] overflow-hidden">
                  <div className="h-48 bg-white/[0.04] animate-pulse" />
                  <div className="p-4 flex flex-col gap-3">
                    <div className="h-3.5 w-20 bg-white/[0.06] rounded-full animate-pulse" />
                    <div className="h-4 w-3/4 bg-white/[0.05] rounded-lg animate-pulse" />
                    <div className="h-3.5 w-full bg-white/[0.04] rounded-lg animate-pulse" />
                    <div className="h-3.5 w-2/3 bg-white/[0.04] rounded-lg animate-pulse" />
                    <div className="h-10 bg-white/[0.04] rounded-xl animate-pulse mt-1" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="text-center py-16">
              <p className="text-red-400/70 text-sm">Error al cargar el catálogo: {error}</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-24"
            >
              <span className="text-5xl opacity-40">🔍</span>
              <p className="mt-5 text-white/30 text-sm">
                Ningún modelo coincide con tu búsqueda.
              </p>
              <button
                onClick={() => { setSearch(''); setCategoriaFiltro(undefined); }}
                className="mt-3 text-[#9B6DFF] text-sm font-semibold hover:underline transition-opacity"
              >
                Limpiar filtros
              </button>
            </motion.div>
          )}

          {/* Grid */}
          {!loading && !error && filtered.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((modelo, i) => (
                <ModelCard key={modelo.id} modelo={modelo} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
