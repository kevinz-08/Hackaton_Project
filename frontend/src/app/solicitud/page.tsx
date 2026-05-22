'use client';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Modelo } from '@/types';
import { ApiModeloRepository } from '@/infrastructure/repositories/api-modelo.repository';
import { GetModeloByIdUseCase } from '@/application/use-cases/get-modelo-by-id.use-case';
import { SolicitudForm } from '@/presentation/components/SolicitudForm';
import { ModelViewer } from '@/presentation/components/ModelViewer';
import { ReviewsSection } from '@/presentation/components/ReviewsSection';
import { useCart } from '@/presentation/context/CartContext';
import Link from 'next/link';

const getModeloById = new GetModeloByIdUseCase(new ApiModeloRepository());

function SolicitudContent() {
  const params = useSearchParams();
  const modeloId = params.get('modeloId');
  const { items } = useCart();
  const [modelo, setModelo] = useState<Modelo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = modeloId || (items.length === 1 ? items[0].modelo.id : null);

    if (!id) {
      setError('No se indicó ningún modelo.');
      setLoading(false);
      return;
    }

    if (modelo?.id === id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    getModeloById
      .execute(id)
      .then(setModelo)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [modeloId, items, modelo?.id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-[400px] rounded-2xl animate-pulse" style={{ backgroundColor: '#1A2235' }} />
          <div className="space-y-4">
            <div className="h-8 w-48 rounded-lg animate-pulse" style={{ backgroundColor: '#1A2235' }} />
            <div className="h-64 rounded-2xl animate-pulse" style={{ backgroundColor: '#1A2235' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !modelo) {
    if (items.length > 1 && !modeloId) {
      return <ModeloSelector modelos={items.map((i) => i.modelo)} />;
    }

    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
          style={{ backgroundColor: '#1A2235' }}
        >
          📋
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: '#F9FAFB' }}>
          {items.length === 0 ? 'Selecciona un modelo primero' : 'No se indicó ningún modelo'}
        </h2>
        <p className="text-sm mb-6" style={{ color: '#4B5563' }}>
          {items.length === 0
            ? 'Explora el catálogo y elige un modelo para solicitar.'
            : 'Ve al carrito y selecciona un modelo específico.'}
        </p>
        <Link
          href="/"
          className="inline-flex px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ backgroundColor: '#7C3AED', color: '#F9FAFB' }}
        >
          Ir al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Viewer card — fondo claro para contraste con el modelo 3D */}
        <div
          className="rounded-2xl border overflow-hidden flex flex-col gap-4"
          style={{
            backgroundColor: '#E8E8F0',
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <div className="h-72 lg:h-96 overflow-hidden">
            <ModelViewer src={modelo.archivoGlb} alt={modelo.nombre} />
          </div>
          <div className="px-5 pb-5">
            <h2 className="text-lg font-bold" style={{ color: '#111827' }}>{modelo.nombre}</h2>
            <p className="text-sm mt-1 leading-relaxed" style={{ color: '#4B5563' }}>{modelo.descripcion}</p>
          </div>
        </div>

        {/* Form card */}
        <div
          className="rounded-2xl border p-6"
          style={{
            backgroundColor: '#111827',
            borderColor: 'rgba(255,255,255,0.06)',
          }}
        >
          <h2 className="text-lg font-bold mb-5" style={{ color: '#F9FAFB' }}>
            Datos de la institución
          </h2>
          <SolicitudForm modelo={modelo} />
        </div>
      </div>

      {/* Reviews section — full width below the grid */}
      <ReviewsSection codigoReal={modelo.codigoReal} />
    </div>
  );
}

function ModeloSelector({ modelos }: { modelos: Modelo[] }) {
  const [selected, setSelected] = useState(modelos[0]?.id ?? '');

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-16 text-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-4"
        style={{ backgroundColor: '#1A2235' }}
      >
        🎯
      </div>
      <h2 className="text-xl font-bold mb-2" style={{ color: '#F9FAFB' }}>
        Tienes {modelos.length} modelos seleccionados
      </h2>
      <p className="text-sm mb-6" style={{ color: '#4B5563' }}>
        Elige cuál quieres solicitar ahora.
      </p>
      <div className="flex flex-col items-center gap-4">
        <select
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          className="w-full max-w-xs rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: '#111827',
            color: '#F9FAFB',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {modelos.map((m) => (
            <option key={m.id} value={m.id}>{m.nombre}</option>
          ))}
        </select>
        <Link
          href={`/solicitud?modeloId=${selected}`}
          className="inline-flex px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{ backgroundColor: '#7C3AED', color: '#F9FAFB' }}
        >
          Solicitar este modelo
        </Link>
      </div>
    </div>
  );
}

export default function SolicitudPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-[400px] rounded-2xl animate-pulse" style={{ backgroundColor: '#1A2235' }} />
            <div className="space-y-4">
              <div className="h-8 w-48 rounded-lg animate-pulse" style={{ backgroundColor: '#1A2235' }} />
              <div className="h-64 rounded-2xl animate-pulse" style={{ backgroundColor: '#1A2235' }} />
            </div>
          </div>
        </div>
      }
    >
      <SolicitudContent />
    </Suspense>
  );
}
