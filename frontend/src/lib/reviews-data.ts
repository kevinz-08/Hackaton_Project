export interface Review {
  id: string;
  autor: string;
  tipo: 'Institución' | 'Docente' | 'Cuidador' | 'Beneficiario';
  calificacion: number;
  comentario: string;
}

export const REVIEWS_BY_CODIGO: Record<string, Review[]> = {
  'RD-001': [
    {
      id: 'EVL-001',
      autor: 'Escuela Normal Superior Barranquilla',
      tipo: 'Institución',
      calificacion: 4.8,
      comentario: 'Los estudiantes aprendieron más rápido con el material táctil. Excelente acabado.',
    },
    {
      id: 'CL-001',
      autor: 'Patricia Suárez',
      tipo: 'Docente',
      calificacion: 5.0,
      comentario: 'Mis estudiantes con discapacidad visual aprenden mucho más rápido. Es un recurso transformador.',
    },
  ],
  'RD-002': [
    {
      id: 'EVL-003',
      autor: 'Colegio Distrital Las Nieves',
      tipo: 'Institución',
      calificacion: 4.5,
      comentario: 'La textura diferenciada es clave para los estudiantes con baja visión.',
    },
  ],
  'RD-003': [
    {
      id: 'EVL-006',
      autor: 'IED Simón Bolívar',
      tipo: 'Institución',
      calificacion: 4.3,
      comentario: 'El mapa es muy preciso. El tiempo de entrega fue un poco mayor al esperado.',
    },
    {
      id: 'CL-013',
      autor: 'Teresa Gutiérrez',
      tipo: 'Docente',
      calificacion: 5.0,
      comentario: 'Los estudiantes identifican los departamentos mucho más fácilmente con el mapa táctil.',
    },
  ],
  'RD-004': [
    {
      id: 'EVL-002',
      autor: 'Instituto para Ciegos del Caribe',
      tipo: 'Institución',
      calificacion: 4.8,
      comentario: 'Material muy sólido. Los jóvenes lo usan a diario. Pediremos más unidades.',
    },
    {
      id: 'CL-012',
      autor: 'Darío Escobar',
      tipo: 'Beneficiario',
      calificacion: 4.7,
      comentario: 'Practico mi lectoescritura braille todos los días. El dispositivo es sólido y cómodo.',
    },
  ],
  'RD-005': [
    {
      id: 'EVL-008',
      autor: 'Escuela Normal Superior Barranquilla',
      tipo: 'Institución',
      calificacion: 4.3,
      comentario: 'Muy útil para las clases de química. Los conectores son resistentes y precisos.',
    },
  ],
  'RD-006': [
    {
      id: 'EVL-004',
      autor: 'Fundación Manos Abiertas',
      tipo: 'Institución',
      calificacion: 4.8,
      comentario: 'Transformó la comunicación de varios de nuestros beneficiarios. Muy recomendado.',
    },
    {
      id: 'CL-014',
      autor: 'Iván Darío Pérez',
      tipo: 'Cuidador',
      calificacion: 5.0,
      comentario: 'Mi hijo con TEA logró comunicarse con nosotros usando el tablero. Fue un día muy especial.',
    },
  ],
  'RD-007': [
    {
      id: 'EVL-010',
      autor: 'Colegio Distrital Las Nieves',
      tipo: 'Institución',
      calificacion: 3.8,
      comentario: 'Buena iniciativa aunque las piezas de océanos podrían ser más robustas.',
    },
  ],
  'RD-008': [
    {
      id: 'EVL-009',
      autor: 'Instituto para Ciegos del Caribe',
      tipo: 'Institución',
      calificacion: 5.0,
      comentario: 'Herramienta indispensable. La precisión de las marcas en relieve es perfecta.',
    },
  ],
  'RD-009': [
    {
      id: 'EVL-005',
      autor: 'Colegio Fe y Alegría No. 1',
      tipo: 'Institución',
      calificacion: 4.8,
      comentario: 'Fácil de usar en el salón. Los niños entienden mejor las fracciones con el material físico.',
    },
    {
      id: 'CL-003',
      autor: 'Luisa Fernanda Ríos',
      tipo: 'Docente',
      calificacion: 4.7,
      comentario: 'Los niños entienden las fracciones mucho mejor con el material físico que con el tablero.',
    },
  ],
  'RD-010': [
    {
      id: 'EVL-007',
      autor: 'Hogar Infantil Comunitario El Prado',
      tipo: 'Institución',
      calificacion: 4.8,
      comentario: 'Varios niños con dificultades motrices lograron escribir por primera vez con este agarre.',
    },
    {
      id: 'CL-002',
      autor: 'Ricardo Montoya',
      tipo: 'Cuidador',
      calificacion: 5.0,
      comentario: 'Mi hijo pudo escribir solo por primera vez. No tengo palabras para describir ese momento.',
    },
  ],
  'RD-016': [
    {
      id: 'EVL-011',
      autor: 'Colegio San José de la Salle',
      tipo: 'Institución',
      calificacion: 4.8,
      comentario: 'El nivel de detalle del corazón superó nuestras expectativas. Los estudiantes quedaron impresionados.',
    },
  ],
  'RD-017': [
    {
      id: 'EVL-012',
      autor: 'Universidad del Atlántico',
      tipo: 'Institución',
      calificacion: 4.8,
      comentario: 'Excelente herramienta para astronomía. Las proporciones son correctas y el material es sólido.',
    },
    {
      id: 'CL-005',
      autor: 'Gloria Inés Pardo',
      tipo: 'Docente',
      calificacion: 4.3,
      comentario: 'Los estudiantes se fascinaron con las proporciones reales. Mucho mejor que las imágenes digitales.',
    },
  ],
  'RD-018': [
    {
      id: 'EVL-013',
      autor: 'IED Olaya Herrera',
      tipo: 'Institución',
      calificacion: 4.5,
      comentario: 'Los orgánulos extraíbles facilitan mucho la enseñanza. Muy útil para evaluaciones prácticas.',
    },
    {
      id: 'CL-007',
      autor: 'Natalia Ospina',
      tipo: 'Docente',
      calificacion: 4.7,
      comentario: 'Cada orgánulo es extraíble y los estudiantes pueden armar la célula como rompecabezas.',
    },
  ],
  'RD-019': [
    {
      id: 'EVL-019',
      autor: 'Escuela Normal Superior Barranquilla',
      tipo: 'Institución',
      calificacion: 4.5,
      comentario: 'El esqueleto articulado es impresionante. Tardó un poco más de lo esperado pero valió la pena.',
    },
    {
      id: 'CL-011',
      autor: 'Margarita Leal',
      tipo: 'Docente',
      calificacion: 5.0,
      comentario: 'El esqueleto articulado permite explicar movimiento y anatomía de forma intuitiva. Excelente acabado.',
    },
  ],
  'RD-020': [
    {
      id: 'EVL-018',
      autor: 'Colegio Distrital Las Américas',
      tipo: 'Institución',
      calificacion: 4.5,
      comentario: 'Muy buena para explicar fenómenos geológicos. Podría tener colores diferenciados por capa.',
    },
    {
      id: 'CL-009',
      autor: 'Sandra Milena Cruz',
      tipo: 'Docente',
      calificacion: 4.0,
      comentario: 'Buena calidad, aunque sugeriría pintar las capas con colores diferenciados desde fábrica.',
    },
  ],
  'RD-021': [
    {
      id: 'EVL-020',
      autor: 'Fundación Rehabilitar Caribe',
      tipo: 'Institución',
      calificacion: 4.8,
      comentario: 'Accesorio práctico y muy bien pensado. Los usuarios lo adoptaron inmediatamente.',
    },
    {
      id: 'CL-010',
      autor: 'Humberto Flórez',
      tipo: 'Cuidador',
      calificacion: 5.0,
      comentario: 'Mi esposa ya no tiene que pedirme que le sostenga el vaso. Un pequeño accesorio, gran diferencia.',
    },
  ],
  'RD-022': [
    {
      id: 'EVL-015',
      autor: 'Hogar Gerontológico El Carmen',
      tipo: 'Institución',
      calificacion: 4.3,
      comentario: 'Los adultos mayores lo usan a diario para videollamadas. El agarre es firme y seguro.',
    },
    {
      id: 'CL-006',
      autor: 'Jorge Eliécer Vega',
      tipo: 'Cuidador',
      calificacion: 4.7,
      comentario: 'Mi madre usa la tablet para videollamadas familiares sin ayuda. El soporte es muy estable.',
    },
  ],
  'RD-023': [
    {
      id: 'EVL-014',
      autor: 'Fundación Manos Abiertas',
      tipo: 'Institución',
      calificacion: 5.0,
      comentario: 'Cambió la vida de varios de nuestros beneficiarios. La autonomía que genera es invaluable.',
    },
    {
      id: 'CL-004',
      autor: 'Andrés Carmona',
      tipo: 'Beneficiario',
      calificacion: 5.0,
      comentario: 'Recuperé parte de mi independencia. Ahora abro puertas solo. Sencillo pero muy efectivo.',
    },
  ],
  'RD-024': [
    {
      id: 'EVL-016',
      autor: 'IED Concentración Cevillar',
      tipo: 'Institución',
      calificacion: 4.5,
      comentario: 'La sección interior genera mucha curiosidad e interacción en el aula. Muy recomendado.',
    },
    {
      id: 'CL-015',
      autor: 'Claudia Morales',
      tipo: 'Docente',
      calificacion: 4.7,
      comentario: 'La sección interior genera mucho debate en clase. Los estudiantes quieren saber más sobre Egipto.',
    },
  ],
  'RD-025': [
    {
      id: 'EVL-017',
      autor: 'Instituto para Ciegos del Caribe',
      tipo: 'Institución',
      calificacion: 5.0,
      comentario: 'Herramienta fundamental para la independencia lectora. La precisión del agarre es perfecta.',
    },
    {
      id: 'CL-008',
      autor: 'Camilo Bermúdez',
      tipo: 'Beneficiario',
      calificacion: 5.0,
      comentario: 'Ahora leo libros completos sin pedir ayuda. La calidad del material es excelente.',
    },
  ],
};
