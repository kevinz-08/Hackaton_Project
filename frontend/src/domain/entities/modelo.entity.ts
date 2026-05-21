import { Categoria } from '@/types';

export interface ModeloEntity {
  id: string;
  nombre: string;
  categoria: Categoria;
  descripcion: string;
  archivoGlb: string;
  imagen: string;
}
