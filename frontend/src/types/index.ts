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

export type Prioridad = 'ALTA' | 'MEDIA' | 'BAJA';

// ─── Nuevo: estado de modelos generados con IA ────────────────────────────────
export type EstadoGenerado = 'PROCESANDO' | 'COMPLETADO' | 'FALLIDO';

export const CATEGORIA_LABELS: Record<Categoria, string> = {
  ACCESIBILIDAD_VISUAL:      'Accesibilidad Visual',
  ACCESIBILIDAD_MOTRIZ:      'Accesibilidad Motriz',
  MATERIAL_DIDACTICO:        'Material Didáctico',
  COMUNICACION_AUMENTATIVA:  'Comunicación Aumentativa',
  FIGURAS_DIDACTICAS:        'Figuras Didácticas',
  ACCESORIOS_ACCESIBILIDAD:  'Accesorios de Accesibilidad',
};

export const ESTADO_LABELS: Record<Estado, string> = {
  RECIBIDA:            'Recibida',
  EN_PRODUCCION:       'En Producción',
  REVISION_CALIDAD:    'Revisión de Calidad',
  EMPAQUE_TRANSPORTE:  'Empaque y Transporte',
  ENTREGADA:           'Entregada',
};

export const ESTADO_COLORS: Record<Estado, string> = {
  RECIBIDA:            '#F59E0B',
  EN_PRODUCCION:       '#3B82F6',
  REVISION_CALIDAD:    '#8B5CF6',
  EMPAQUE_TRANSPORTE:  '#06B6D4',
  ENTREGADA:           '#10B981',
};

export const PRIORIDAD_LABELS: Record<Prioridad, string> = {
  ALTA:  'Alta',
  MEDIA: 'Media',
  BAJA:  'Baja',
};

export const PRIORIDAD_COLORS: Record<Prioridad, string> = {
  ALTA:  '#EF4444',
  MEDIA: '#F59E0B',
  BAJA:  '#6B7280',
};

export interface Modelo {
  id:          string;
  nombre:      string;
  categoria:   Categoria;
  descripcion: string;
  archivoGlb:  string;   // ruta local /public/modelos/ o URL S3
  imagen:      string;   // ruta local /public/thumbnails/ o URL S3
}

export interface Solicitud {
  id:           string;
  nombre:       string;
  cedula:       string;
  ciudad:       string;
  correo:       string;
  telefono:     string;
  tipoMaterial: Categoria;
  modeloId:     string;
  estado:       Estado;
  prioridad?:   Prioridad;
  responsable?: string;
  institucion?: string;
  cantidad?:    number;
  codigoReal?:  string;
  fechaRegistro: string;
  modelo?:      Modelo;
}

export interface CreateSolicitudPayload {
  nombre:       string;
  cedula:       string;
  ciudad:       string;
  correo:       string;
  telefono:     string;
  tipoMaterial: Categoria;
  modeloId:     string;
}

// ─── Modelo generado con IA + guardado en S3 ──────────────────────────────────
export interface ModeloGenerado {
  id:           string;
  taskId:       string;
  glbUrl:       string;   // URL permanente en S3/GBL/
  imagenUrl:    string;   // URL permanente en S3/img/
  nombre?:      string;
  estado:       EstadoGenerado;
  creadoEn:     string;
  actualizadoEn: string;
}
