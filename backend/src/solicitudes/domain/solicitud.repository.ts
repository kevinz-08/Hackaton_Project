import { Categoria, Estado } from '@prisma/client';
import { SolicitudEntity } from './solicitud.entity';

export interface CreateSolicitudInput {
  nombre: string;
  cedula: string;
  ciudad: string;
  correo: string;
  telefono: string;
  tipoMaterial: Categoria;
  modeloId: string;
}

export abstract class SolicitudRepository {
  abstract create(data: CreateSolicitudInput): Promise<SolicitudEntity>;
  abstract findAll(ciudad?: string, estado?: Estado): Promise<SolicitudEntity[]>;
  abstract findById(id: string): Promise<SolicitudEntity | null>;
  abstract findByCedula(cedula: string): Promise<SolicitudEntity | null>;
  abstract updateEstado(id: string, estado: Estado): Promise<SolicitudEntity>;
}
