'use client';
import { useState } from 'react';
import { Categoria, CATEGORIA_LABELS } from '@/types';
import { useModelos } from '@/presentation/hooks/use-modelos';
import { ModelCard } from '@/presentation/components/ModelCard';

const FILTROS: Array<{ label: string; value: Categoria | undefined }> = [
  { label: 'Todos', value: undefined },
  ...Object.entries(CATEGORIA_LABELS).map(([value, label]) => ({
    label,
    value: value as Categoria,
  })),
];

export default function CatalogoPage() {
  const [categoriaFiltro, setCategoriaFiltro] = useState<Categoria | undefined>();
  const { modelos, loading, error } = useModelos(categoriaFiltro);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Catálogo de Recursos 3D</h1>
        <p className="text-gray-500 mt-1">Materiales didácticos y de accesibilidad para instituciones educativas.</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {FILTROS.map(({ label, value }) => (
          <button
            key={label}
            onClick={() => setCategoriaFiltro(value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              categoriaFiltro === value
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-400'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-72 animate-pulse border border-gray-100" />
          ))}
        </div>
      )}

      {error && (
        <div className="text-center py-16 text-red-500">
          <p>Error al cargar el catálogo: {error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modelos.map((modelo) => (
            <ModelCard key={modelo.id} modelo={modelo} />
          ))}
        </div>
      )}
    </div>
  );
}
