'use client';
import { useCallback, useEffect, useState } from 'react';
import { Estado, Solicitud } from '@/types';
import { ApiSolicitudRepository } from '@/infrastructure/repositories/api-solicitud.repository';
import { GetSolicitudesUseCase } from '@/application/use-cases/get-solicitudes.use-case';

const getSolicitudes = new GetSolicitudesUseCase(new ApiSolicitudRepository());

export function useSolicitudes(ciudad?: string, estado?: Estado) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    setLoading(true);
    setError(null);
    getSolicitudes
      .execute(ciudad, estado)
      .then(setSolicitudes)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [ciudad, estado]);

  useEffect(() => { fetch(); }, [fetch]);

  const updateLocalEstado = useCallback((id: string, nuevoEstado: Estado) => {
    setSolicitudes((prev) =>
      prev.map((s) => (s.id === id ? { ...s, estado: nuevoEstado } : s)),
    );
  }, []);

  return { solicitudes, loading, error, refresh: fetch, updateLocalEstado };
}
