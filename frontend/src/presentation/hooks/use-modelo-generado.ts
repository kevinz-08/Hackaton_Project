'use client';
import { useEffect, useState } from 'react';
import { ModeloGenerado } from '@/types';
import { ApiModeloGeneradoRepository } from '@/infrastructure/repositories/api-modelo-generado.repository';

// ─── Hook para guardar progreso de generación ────────────────────────────────
export function useModeloGenerado() {
  const guardarInicio = async (
    taskId: string,
    imagenUrl: string,
    nombre?: string,
  ) => {
    await ApiModeloGeneradoRepository.crear({ taskId, imagenUrl, nombre });
  };

  const guardarResultado = async (taskId: string, glbUrl: string) => {
    await ApiModeloGeneradoRepository.actualizar(taskId, {
      glbUrl,
      estado: 'COMPLETADO',
    });
  };

  const marcarFallido = async (taskId: string) => {
    await ApiModeloGeneradoRepository.actualizar(taskId, { estado: 'FALLIDO' });
  };

  return { guardarInicio, guardarResultado, marcarFallido };
}

// ─── Hook para listar modelos generados (galería) ────────────────────────────
export function useModelosGenerados() {
  const [modelos,  setModelos]  = useState<ModeloGenerado[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    ApiModeloGeneradoRepository.listar()
      .then(setModelos)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  // Solo los que están completados con .glb disponible
  const completados = modelos.filter(m => m.estado === 'COMPLETADO' && m.glbUrl);

  return { modelos, completados, loading, error };
}
