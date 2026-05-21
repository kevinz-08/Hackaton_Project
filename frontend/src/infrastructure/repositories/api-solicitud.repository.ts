import { CreateSolicitudPayload, Estado } from '@/types';
import { SolicitudEntity } from '@/domain/entities/solicitud.entity';
import { SolicitudRepository } from '@/domain/repositories/solicitud.repository';
import { apiClient } from '../http/api-client';

export class ApiSolicitudRepository implements SolicitudRepository {
  create(data: CreateSolicitudPayload): Promise<SolicitudEntity> {
    return apiClient.post<SolicitudEntity>('/solicitudes', data);
  }

  findAll(ciudad?: string, estado?: Estado): Promise<SolicitudEntity[]> {
    const params = new URLSearchParams();
    if (ciudad) params.set('ciudad', ciudad);
    if (estado) params.set('estado', estado);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<SolicitudEntity[]>(`/solicitudes${query}`);
  }

  updateEstado(id: string, estado: Estado): Promise<SolicitudEntity> {
    return apiClient.patch<SolicitudEntity>(`/solicitudes/${id}`, { estado });
  }
}
