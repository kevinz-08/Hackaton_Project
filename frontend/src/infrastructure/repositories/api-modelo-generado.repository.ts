import { apiClient } from '@/infrastructure/http/api-client';
import { ModeloGenerado } from '@/types';

export const ApiModeloGeneradoRepository = {
  // Crear registro inicial (estado PROCESANDO)
  crear: (data: { taskId: string; imagenUrl: string; nombre?: string }) =>
    apiClient.post<ModeloGenerado>('/modelos-generados', data),

  // Actualizar estado + URLs cuando Hitem3D termina
  actualizar: (taskId: string, data: { glbUrl?: string; estado?: string }) =>
    apiClient.patch<ModeloGenerado>('/modelos-generados', { taskId, ...data }),

  // Listar todos los modelos generados (para galería)
  listar: () =>
    apiClient.get<ModeloGenerado[]>('/modelos-generados'),
};
