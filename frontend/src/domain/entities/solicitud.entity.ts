import { Categoria, Estado, ModeloEntity } from '@/types';

export interface SolicitudEntity {
  id: string;
  nombre: string;
  cedula: string;
  ciudad: string;
  correo: string;
  telefono: string;
  tipoMaterial: Categoria;
  modeloId: string;
  estado: Estado;
  fechaRegistro: string;
  modelo?: ModeloEntity;
}
