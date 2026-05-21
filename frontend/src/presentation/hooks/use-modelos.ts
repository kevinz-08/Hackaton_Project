'use client';
import { useEffect, useState } from 'react';
import { Categoria, Modelo } from '@/types';
import { ApiModeloRepository } from '@/infrastructure/repositories/api-modelo.repository';
import { GetModelosUseCase } from '@/application/use-cases/get-modelos.use-case';

const getModelos = new GetModelosUseCase(new ApiModeloRepository());

export function useModelos(categoria?: Categoria) {
  const [modelos, setModelos] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getModelos
      .execute(categoria)
      .then(setModelos)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [categoria]);

  return { modelos, loading, error };
}
