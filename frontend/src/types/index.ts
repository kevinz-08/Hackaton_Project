export type Categoria =
  | 'ACCESIBILIDAD_VISUAL'
  | 'ACCESIBILIDAD_MOTRIZ'
  | 'MATERIAL_DIDACTICO'
  | 'COMUNICACION_AUMENTATIVA'
  | 'FIGURAS_DIDACTICAS'
  | 'ACCESORIOS_ACCESIBILIDAD';

export type Estado =
  | 'RECIBIDA'
  | 'EN_PRODUCCION'
  | 'REVISION_CALIDAD'
  | 'EMPAQUE_TRANSPORTE'
  | 'ENTREGADA';

export const CATEGORIA_LABELS: Record<Categoria, string> = {
  ACCESIBILIDAD_VISUAL: 'Accesibilidad Visual',
  ACCESIBILIDAD_MOTRIZ: 'Accesibilidad Motriz',
  MATERIAL_DIDACTICO: 'Material Didáctico',
  COMUNICACION_AUMENTATIVA: 'Comunicación Aumentativa',
  FIGURAS_DIDACTICAS: 'Figuras Didácticas',
  ACCESORIOS_ACCESIBILIDAD: 'Accesorios de Accesibilidad',
};

export const ESTADO_LABELS: Record<Estado, string> = {
  RECIBIDA: 'Recibida',
  EN_PRODUCCION: 'En Producción',
  REVISION_CALIDAD: 'Revisión de Calidad',
  EMPAQUE_TRANSPORTE: 'Empaque y Transporte',
  ENTREGADA: 'Entregada',
};

export const ESTADO_COLORS: Record<Estado, string> = {
  RECIBIDA: 'bg-gray-100 text-gray-700',
  EN_PRODUCCION: 'bg-blue-100 text-blue-700',
  REVISION_CALIDAD: 'bg-yellow-100 text-yellow-700',
  EMPAQUE_TRANSPORTE: 'bg-orange-100 text-orange-700',
  ENTREGADA: 'bg-green-100 text-green-700',
};

export interface Modelo {
  id: string;
  nombre: string;
  categoria: Categoria;
  descripcion: string;
  archivoGlb: string;
  imagen: string;
}

export interface Solicitud {
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
  modelo?: Modelo;
}

export interface CreateSolicitudPayload {
  nombre: string;
  cedula: string;
  ciudad: string;
  correo: string;
  telefono: string;
  tipoMaterial: Categoria;
  modeloId: string;
}
