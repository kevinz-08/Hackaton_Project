'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Modelo } from '@/types';
import { ApiModeloRepository } from '@/infrastructure/repositories/api-modelo.repository';
import { GetModeloByIdUseCase } from '@/application/use-cases/get-modelo-by-id.use-case';
import { SolicitudForm } from '@/presentation/components/SolicitudForm';
import { ModelViewer } from '@/presentation/components/ModelViewer';

const getModeloById = new GetModeloByIdUseCase(new ApiModeloRepository());

export default function SolicitudPage() {
  const params = useSearchParams();
  const modeloId = params.get('modeloId');
  const [modelo, setModelo] = useState<Modelo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!modeloId) { setError('No se indicó ningún modelo.'); setLoading(false); return; }
    getModeloById
      .execute(modeloId)
      .then(setModelo)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [modeloId]);

  if (loading) return <div className="max-w-2xl mx-auto p-8 animate-pulse h-96 bg-white rounded-xl mt-8" />;
  if (error || !modelo) return <div className="text-center py-16 text-red-500">{error ?? 'Modelo no encontrado.'}</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Solicitar recurso</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex flex-col gap-3">
          <div className="h-64 rounded-lg overflow-hidden">
            <ModelViewer src={modelo.archivoGlb} alt={modelo.nombre} />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{modelo.nombre}</h2>
            <p className="text-sm text-gray-500 mt-1">{modelo.descripcion}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Datos de la institución</h2>
          <SolicitudForm modelo={modelo} />
        </div>
      </div>
    </div>
  );
}
