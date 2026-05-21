import { Categoria, Estado } from '@prisma/client';

export class SolicitudEntity {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly cedula: string,
    public readonly ciudad: string,
    public readonly correo: string,
    public readonly telefono: string,
    public readonly tipoMaterial: Categoria,
    public readonly modeloId: string,
    public readonly estado: Estado,
    public readonly fechaRegistro: Date,
    public readonly modelo?: {
      id: string;
      nombre: string;
      categoria: Categoria;
      descripcion: string;
      archivoGlb: string;
      imagen: string;
    },
  ) {}
}
