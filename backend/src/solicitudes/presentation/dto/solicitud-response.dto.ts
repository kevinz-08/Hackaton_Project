import { Categoria, Estado } from '@prisma/client';

export class SolicitudResponseDto {
  id: string;
  nombre: string;
  cedula: string;
  ciudad: string;
  correo: string;
  telefono: string;
  tipoMaterial: Categoria;
  modeloId: string;
  estado: Estado;
  fechaRegistro: Date;
  modelo?: {
    id: string;
    nombre: string;
    categoria: Categoria;
    descripcion: string;
    archivoGlb: string;
    imagen: string;
  };
}
