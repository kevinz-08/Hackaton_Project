import { CreateSolicitudPayload, Estado } from '@/types';
import { SolicitudEntity } from '../entities/solicitud.entity';

export interface SolicitudRepository {
  create(data: CreateSolicitudPayload): Promise<SolicitudEntity>;
  findAll(ciudad?: string, estado?: Estado): Promise<SolicitudEntity[]>;
  updateEstado(id: string, estado: Estado): Promise<SolicitudEntity>;
}
