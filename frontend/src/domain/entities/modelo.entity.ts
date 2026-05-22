import { Categoria } from '@/types';

export interface ModeloEntity {
  id:           string;
  codigoReal:   string;
  nombre:       string;
  categoria:    Categoria;
  descripcion:  string;
  costoBase:    number;
  calificacion: number | null;
  archivoGlb:   string;
  imagen:       string;
}
