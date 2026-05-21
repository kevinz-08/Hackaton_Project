import { Categoria } from '@prisma/client';

export class ModeloEntity {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly categoria: Categoria,
    public readonly descripcion: string,
    public readonly archivoGlb: string,
    public readonly imagen: string,
  ) {}
}
