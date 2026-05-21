import { PrismaClient, Categoria, Estado } from '@prisma/client';

const prisma = new PrismaClient();

const MODELOS: Array<{
  id: string; nombre: string; categoria: Categoria;
  descripcion: string; archivoGlb: string; imagen: string;
}> = [
  { id: 'RD-001', nombre: 'Abecedario Braille Modular', categoria: Categoria.ACCESIBILIDAD_VISUAL, descripcion: 'Letras del alfabeto en relieve con sistema braille integrado, piezas individuales ensamblables.', archivoGlb: '/modelos/abecedario_braille_v2.glb', imagen: '/imagenes/abecedario_braille.jpg' },
  { id: 'RD-002', nombre: 'Figuras Geométricas Táctiles', categoria: Categoria.MATERIAL_DIDACTICO, descripcion: 'Set de 10 figuras geométricas con textura diferenciada por forma, para enseñanza táctil.', archivoGlb: '/modelos/geometrias_tactiles.glb', imagen: '/imagenes/geometrias_tactiles.jpg' },
  { id: 'RD-003', nombre: 'Mapa de Colombia Relieve', categoria: Categoria.MATERIAL_DIDACTICO, descripcion: 'Mapa físico de Colombia con departamentos en relieve, escala 1:2.500.000.', archivoGlb: '/modelos/mapa_colombia_relieve.glb', imagen: '/imagenes/mapa_colombia.jpg' },
  { id: 'RD-004', nombre: 'Teclado Braille Portátil', categoria: Categoria.ACCESIBILIDAD_VISUAL, descripcion: 'Dispositivo de práctica de escritura braille de 6 puntos, compatible con papel normal.', archivoGlb: '/modelos/teclado_braille_v3.glb', imagen: '/imagenes/teclado_braille.jpg' },
  { id: 'RD-005', nombre: 'Átomos y Moléculas Kit', categoria: Categoria.MATERIAL_DIDACTICO, descripcion: 'Esferas y conectores para armar modelos moleculares, 60 piezas. Química básica y media.', archivoGlb: '/modelos/kit_moleculas.glb', imagen: '/imagenes/kit_moleculas.jpg' },
  { id: 'RD-006', nombre: 'Tablero Comunicación AAC', categoria: Categoria.COMUNICACION_AUMENTATIVA, descripcion: 'Panel de comunicación aumentativa y alternativa con pictogramas imprimibles en relieve.', archivoGlb: '/modelos/tablero_aac.glb', imagen: '/imagenes/tablero_aac.jpg' },
  { id: 'RD-007', nombre: 'Rompecabezas Mapa Mundi', categoria: Categoria.MATERIAL_DIDACTICO, descripcion: 'Planisferio desmontable por continentes, imprimible en piezas, coloreables.', archivoGlb: '/modelos/mapa_mundi_puzzle.glb', imagen: '/imagenes/mapa_mundi.jpg' },
  { id: 'RD-008', nombre: 'Regla Táctil con Braille', categoria: Categoria.ACCESIBILIDAD_VISUAL, descripcion: 'Regla de 30 cm con marcas en relieve y equivalentes en braille cada 5 mm.', archivoGlb: '/modelos/regla_tactil.glb', imagen: '/imagenes/regla_tactil.jpg' },
  { id: 'RD-009', nombre: 'Fracciones Montessori', categoria: Categoria.MATERIAL_DIDACTICO, descripcion: 'Círculos fraccionarios de 1/1 a 1/10, con ranura de ensamble y soporte base.', archivoGlb: '/modelos/fracciones_montessori.glb', imagen: '/imagenes/fracciones.jpg' },
  { id: 'RD-010', nombre: 'Agarre Lápiz Adaptado', categoria: Categoria.ACCESIBILIDAD_MOTRIZ, descripcion: 'Adaptador ergonómico de lápiz para personas con dificultad motriz fina, 3 tallas.', archivoGlb: '/modelos/agarre_lapiz_adaptado.glb', imagen: '/imagenes/agarre_lapiz.jpg' },
  { id: 'RD-016', nombre: 'Figura Anatómica Corazón Humano', categoria: Categoria.FIGURAS_DIDACTICAS, descripcion: 'Modelo anatómico del corazón seccionado en dos mitades ensamblables, escala real.', archivoGlb: '/modelos/corazon_anatomico_v2.glb', imagen: '/imagenes/corazon.jpg' },
  { id: 'RD-017', nombre: 'Figura Sistema Solar Escala', categoria: Categoria.FIGURAS_DIDACTICAS, descripcion: 'Set de 8 planetas del sistema solar a escala relativa, con soporte de anillo para exhibición.', archivoGlb: '/modelos/sistema_solar_set.glb', imagen: '/imagenes/sistema_solar.jpg' },
  { id: 'RD-019', nombre: 'Figura Esqueleto Humano Articulado', categoria: Categoria.FIGURAS_DIDACTICAS, descripcion: 'Esqueleto humano a escala 1:6 con articulaciones móviles en hombros, codos, caderas y rodillas.', archivoGlb: '/modelos/esqueleto_articulado_1_6.glb', imagen: '/imagenes/esqueleto.jpg' },
  { id: 'RD-021', nombre: 'Accesorio Portavasos Silla de Ruedas', categoria: Categoria.ACCESORIOS_ACCESIBILIDAD, descripcion: 'Portavasos con clip de sujeción universal para sillas de ruedas estándar.', archivoGlb: '/modelos/portavasos_silla_ruedas.glb', imagen: '/imagenes/portavasos.jpg' },
  { id: 'RD-023', nombre: 'Accesorio Abrepuertas de Muñeca', categoria: Categoria.ACCESORIOS_ACCESIBILIDAD, descripcion: 'Gancho ergonómico para abrir palancas y manijas sin usar los dedos.', archivoGlb: '/modelos/abrepuertas_muneca.glb', imagen: '/imagenes/abrepuertas.jpg' },
];

const SOLICITUDES = [
  { nombre: 'Escuela Normal Superior Barranquilla', cedula: '8001001001', ciudad: 'Barranquilla', correo: 'contacto@normalsup.edu.co', telefono: '3001000001', tipoMaterial: Categoria.ACCESIBILIDAD_VISUAL, modeloRef: 'RD-001', estado: Estado.ENTREGADA },
  { nombre: 'Instituto para Ciegos del Caribe', cedula: '8001002002', ciudad: 'Barranquilla', correo: 'ciegos@caribe.org', telefono: '3001000002', tipoMaterial: Categoria.ACCESIBILIDAD_VISUAL, modeloRef: 'RD-004', estado: Estado.ENTREGADA },
  { nombre: 'Colegio Distrital Las Nieves', cedula: '8001003003', ciudad: 'Barranquilla', correo: 'lasnieves@edu.co', telefono: '3001000003', tipoMaterial: Categoria.MATERIAL_DIDACTICO, modeloRef: 'RD-002', estado: Estado.ENTREGADA },
  { nombre: 'Fundación Manos Abiertas', cedula: '8001004004', ciudad: 'Barranquilla', correo: 'manosabiertas@fundacion.org', telefono: '3001000004', tipoMaterial: Categoria.COMUNICACION_AUMENTATIVA, modeloRef: 'RD-006', estado: Estado.EMPAQUE_TRANSPORTE },
  { nombre: 'Colegio Fe y Alegría No. 1', cedula: '8001005005', ciudad: 'Barranquilla', correo: 'feyalegria@edu.co', telefono: '3001000005', tipoMaterial: Categoria.MATERIAL_DIDACTICO, modeloRef: 'RD-009', estado: Estado.EMPAQUE_TRANSPORTE },
  { nombre: 'IED Simón Bolívar', cedula: '8001006006', ciudad: 'Barranquilla', correo: 'simonbolivar@ied.edu.co', telefono: '3001000006', tipoMaterial: Categoria.MATERIAL_DIDACTICO, modeloRef: 'RD-003', estado: Estado.REVISION_CALIDAD },
  { nombre: 'Hogar Infantil Comunitario El Prado', cedula: '8001007007', ciudad: 'Barranquilla', correo: 'elprado@hogar.org', telefono: '3001000007', tipoMaterial: Categoria.ACCESIBILIDAD_MOTRIZ, modeloRef: 'RD-010', estado: Estado.REVISION_CALIDAD },
  { nombre: 'Escuela Normal Superior (sede 2)', cedula: '8001008008', ciudad: 'Barranquilla', correo: 'normalsup2@edu.co', telefono: '3001000008', tipoMaterial: Categoria.MATERIAL_DIDACTICO, modeloRef: 'RD-005', estado: Estado.EN_PRODUCCION },
  { nombre: 'Instituto para Ciegos del Caribe (sede 2)', cedula: '8001009009', ciudad: 'Barranquilla', correo: 'ciegos2@caribe.org', telefono: '3001000009', tipoMaterial: Categoria.ACCESIBILIDAD_VISUAL, modeloRef: 'RD-008', estado: Estado.EN_PRODUCCION },
  { nombre: 'Colegio Distrital Las Nieves (sede 2)', cedula: '8001010010', ciudad: 'Barranquilla', correo: 'lasnieves2@edu.co', telefono: '3001000010', tipoMaterial: Categoria.MATERIAL_DIDACTICO, modeloRef: 'RD-007', estado: Estado.EN_PRODUCCION },
  { nombre: 'Colegio San José de la Salle', cedula: '8001016016', ciudad: 'Barranquilla', correo: 'sallecol@edu.co', telefono: '3001000016', tipoMaterial: Categoria.FIGURAS_DIDACTICAS, modeloRef: 'RD-016', estado: Estado.EN_PRODUCCION },
  { nombre: 'Universidad del Atlántico', cedula: '8001017017', ciudad: 'Barranquilla', correo: 'uatlantico@edu.co', telefono: '3001000017', tipoMaterial: Categoria.FIGURAS_DIDACTICAS, modeloRef: 'RD-017', estado: Estado.EN_PRODUCCION },
  { nombre: 'Fundación Manos Abiertas (solicitud 2)', cedula: '8001011011', ciudad: 'Barranquilla', correo: 'manosabiertas2@fundacion.org', telefono: '3001000011', tipoMaterial: Categoria.ACCESIBILIDAD_VISUAL, modeloRef: 'RD-001', estado: Estado.RECIBIDA },
  { nombre: 'Hogar Gerontológico El Carmen', cedula: '8001020020', ciudad: 'Barranquilla', correo: 'elcarmen@hogar.org', telefono: '3001000020', tipoMaterial: Categoria.ACCESORIOS_ACCESIBILIDAD, modeloRef: 'RD-021', estado: Estado.RECIBIDA },
  { nombre: 'Fundación Rehabilitar Caribe', cedula: '8001025025', ciudad: 'Barranquilla', correo: 'rehabilitar@caribe.org', telefono: '3001000025', tipoMaterial: Categoria.ACCESORIOS_ACCESIBILIDAD, modeloRef: 'RD-021', estado: Estado.RECIBIDA },
  { nombre: 'Fundación Manos Abiertas (solicitud 3)', cedula: '8001019019', ciudad: 'Barranquilla', correo: 'manosabiertas3@fundacion.org', telefono: '3001000019', tipoMaterial: Categoria.ACCESORIOS_ACCESIBILIDAD, modeloRef: 'RD-023', estado: Estado.RECIBIDA },
  { nombre: 'Escuela Normal Superior (sede 3)', cedula: '8001024024', ciudad: 'Barranquilla', correo: 'normalsup3@edu.co', telefono: '3001000024', tipoMaterial: Categoria.FIGURAS_DIDACTICAS, modeloRef: 'RD-019', estado: Estado.RECIBIDA },
];

async function main() {
  await prisma.solicitud.deleteMany();
  await prisma.modelo.deleteMany();

  for (const data of MODELOS) {
    await prisma.modelo.upsert({
      where: { id: data.id },
      update: data,
      create: data,
    });
  }

  const modeloIds = Object.fromEntries(MODELOS.map((m) => [m.id, m.id]));

  for (const { modeloRef, ...rest } of SOLICITUDES) {
    await prisma.solicitud.create({
      data: { ...rest, modeloId: modeloIds[modeloRef] },
    });
  }

  console.log(`Seed: ${MODELOS.length} modelos + ${SOLICITUDES.length} solicitudes`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
