import { Categoria } from '@prisma/client';

export class ModeloResponseDto {
  id: string;
  nombre: string;
  categoria: Categoria;
  descripcion: string;
  archivoGlb: string;
  imagen: string;
}
