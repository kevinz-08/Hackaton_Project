export interface MaterialInsumo {
  id: string;
  nombre: string;
  tipo: string;
  color: string;
  stockKg: number;
  stockMinKg: number;
  stockMaxKg: number;
  proveedor: string;
  estado: 'OK' | 'Stock Bajo';
}

export interface TiempoProduccion {
  id: string;
  nombre: string;
  material: string;
  tiempoImpresionH: number;
  tiempoPostProcesoH: number;
  tiempoTotalH: number;
  velocidadMmS: number;
  piezasPorUnidad: number;
  tiempoLote5H: number;
}

export interface ProductoInventario {
  id: string;
  nombre: string;
  categoria: string;
  unidadesProducidas: number;
  unidadesEntregadas: number;
  unidadesDisponibles: number;
  enProduccion: number;
  reservadas: number;
  estado: 'Disponible' | 'Stock Bajo';
}

export const MATERIALES: MaterialInsumo[] = [
  { id: 'MAT-001', nombre: 'Filamento PLA Blanco', tipo: 'PLA', color: 'Blanco', stockKg: 4.2, stockMinKg: 1, stockMaxKg: 10, proveedor: 'Filamentos3D Colombia', estado: 'OK' },
  { id: 'MAT-002', nombre: 'Filamento PLA Amarillo', tipo: 'PLA', color: 'Amarillo', stockKg: 2.8, stockMinKg: 1, stockMaxKg: 8, proveedor: 'Filamentos3D Colombia', estado: 'OK' },
  { id: 'MAT-003', nombre: 'Filamento PLA Rojo', tipo: 'PLA', color: 'Rojo', stockKg: 1.5, stockMinKg: 1, stockMaxKg: 8, proveedor: 'PrintMaster Bogotá', estado: 'OK' },
  { id: 'MAT-004', nombre: 'Filamento PLA Azul', tipo: 'PLA', color: 'Azul', stockKg: 3, stockMinKg: 1, stockMaxKg: 8, proveedor: 'Filamentos3D Colombia', estado: 'OK' },
  { id: 'MAT-005', nombre: 'Filamento PLA Verde', tipo: 'PLA', color: 'Verde', stockKg: 0.7, stockMinKg: 1, stockMaxKg: 6, proveedor: 'PrintMaster Bogotá', estado: 'Stock Bajo' },
  { id: 'MAT-006', nombre: 'Filamento PLA Negro', tipo: 'PLA', color: 'Negro', stockKg: 5, stockMinKg: 1.5, stockMaxKg: 10, proveedor: 'Filamentos3D Colombia', estado: 'OK' },
  { id: 'MAT-007', nombre: 'Filamento PLA+ Natural', tipo: 'PLA+', color: 'Natural', stockKg: 2.1, stockMinKg: 1, stockMaxKg: 8, proveedor: '3DXTech Colombia', estado: 'OK' },
  { id: 'MAT-008', nombre: 'Filamento PETG Transparente', tipo: 'PETG', color: 'Transparente', stockKg: 1.8, stockMinKg: 1, stockMaxKg: 6, proveedor: '3DXTech Colombia', estado: 'OK' },
  { id: 'MAT-009', nombre: 'Filamento PETG Blanco', tipo: 'PETG', color: 'Blanco', stockKg: 2.5, stockMinKg: 1, stockMaxKg: 6, proveedor: '3DXTech Colombia', estado: 'OK' },
  { id: 'MAT-010', nombre: 'Filamento TPU Flexible 95A', tipo: 'TPU', color: 'Negro', stockKg: 1.2, stockMinKg: 0.5, stockMaxKg: 4, proveedor: 'NinjaTek Colombia', estado: 'OK' },
  { id: 'MAT-011', nombre: 'Filamento TPU Flexible 95A', tipo: 'TPU', color: 'Blanco', stockKg: 0.4, stockMinKg: 0.5, stockMaxKg: 4, proveedor: 'NinjaTek Colombia', estado: 'Stock Bajo' },
  { id: 'MAT-012', nombre: 'Resina LCD Standard', tipo: 'Resina', color: 'Gris', stockKg: 0.8, stockMinKg: 0.5, stockMaxKg: 3, proveedor: 'Anycubic Colombia', estado: 'OK' },
  { id: 'MAT-013', nombre: 'Filamento PLA Azul Cielo', tipo: 'PLA', color: 'Azul Cielo', stockKg: 1.5, stockMinKg: 1, stockMaxKg: 6, proveedor: 'Filamentos3D Colombia', estado: 'OK' },
  { id: 'MAT-014', nombre: 'Filamento PETG Gris', tipo: 'PETG', color: 'Gris', stockKg: 2, stockMinKg: 1, stockMaxKg: 6, proveedor: '3DXTech Colombia', estado: 'OK' },
  { id: 'MAT-015', nombre: 'Filamento ABS Negro', tipo: 'ABS', color: 'Negro', stockKg: 1, stockMinKg: 1, stockMaxKg: 5, proveedor: 'PrintMaster Bogotá', estado: 'OK' },
  { id: 'MAT-016', nombre: 'Filamento PLA+ Naranja', tipo: 'PLA+', color: 'Naranja', stockKg: 0.6, stockMinKg: 1, stockMaxKg: 5, proveedor: 'Filamentos3D Colombia', estado: 'Stock Bajo' },
];

export const TIEMPOS: TiempoProduccion[] = [
  { id: 'RD-001', nombre: 'Abecedario Braille Modular', material: 'PLA', tiempoImpresionH: 5, tiempoPostProcesoH: 1, tiempoTotalH: 6, velocidadMmS: 55, piezasPorUnidad: 27, tiempoLote5H: 30 },
  { id: 'RD-002', nombre: 'Figuras Geométricas Táctiles', material: 'TPU', tiempoImpresionH: 3.5, tiempoPostProcesoH: 0.5, tiempoTotalH: 4, velocidadMmS: 35, piezasPorUnidad: 10, tiempoLote5H: 20 },
  { id: 'RD-003', nombre: 'Mapa de Colombia Relieve', material: 'PLA+', tiempoImpresionH: 8, tiempoPostProcesoH: 2, tiempoTotalH: 10, velocidadMmS: 50, piezasPorUnidad: 3, tiempoLote5H: 50 },
  { id: 'RD-004', nombre: 'Teclado Braille Portátil', material: 'PETG', tiempoImpresionH: 6, tiempoPostProcesoH: 1.5, tiempoTotalH: 7.5, velocidadMmS: 45, piezasPorUnidad: 2, tiempoLote5H: 37.5 },
  { id: 'RD-005', nombre: 'Átomos y Moléculas Kit', material: 'PLA', tiempoImpresionH: 4.5, tiempoPostProcesoH: 0.5, tiempoTotalH: 5, velocidadMmS: 60, piezasPorUnidad: 60, tiempoLote5H: 25 },
  { id: 'RD-006', nombre: 'Tablero Comunicación AAC', material: 'PLA+', tiempoImpresionH: 5.5, tiempoPostProcesoH: 1.5, tiempoTotalH: 7, velocidadMmS: 50, piezasPorUnidad: 1, tiempoLote5H: 35 },
  { id: 'RD-007', nombre: 'Rompecabezas Mapa Mundi', material: 'PLA', tiempoImpresionH: 6, tiempoPostProcesoH: 1, tiempoTotalH: 7, velocidadMmS: 55, piezasPorUnidad: 7, tiempoLote5H: 35 },
  { id: 'RD-008', nombre: 'Regla Táctil con Braille', material: 'PETG', tiempoImpresionH: 1.5, tiempoPostProcesoH: 0.5, tiempoTotalH: 2, velocidadMmS: 50, piezasPorUnidad: 1, tiempoLote5H: 10 },
  { id: 'RD-009', nombre: 'Fracciones Montessori', material: 'PLA', tiempoImpresionH: 4, tiempoPostProcesoH: 0.5, tiempoTotalH: 4.5, velocidadMmS: 55, piezasPorUnidad: 11, tiempoLote5H: 22.5 },
  { id: 'RD-010', nombre: 'Agarre Lápiz Adaptado', material: 'TPU', tiempoImpresionH: 0.8, tiempoPostProcesoH: 0.2, tiempoTotalH: 1, velocidadMmS: 30, piezasPorUnidad: 3, tiempoLote5H: 5 },
  { id: 'RD-011', nombre: 'Letras Mayúsculas Táctiles', material: 'PLA', tiempoImpresionH: 4.5, tiempoPostProcesoH: 1, tiempoTotalH: 5.5, velocidadMmS: 55, piezasPorUnidad: 27, tiempoLote5H: 27.5 },
  { id: 'RD-012', nombre: 'Reloj Didáctico Desmontable', material: 'PLA+', tiempoImpresionH: 3.5, tiempoPostProcesoH: 0.8, tiempoTotalH: 4.3, velocidadMmS: 50, piezasPorUnidad: 14, tiempoLote5H: 21.5 },
  { id: 'RD-013', nombre: 'Protractor Táctil', material: 'PETG', tiempoImpresionH: 2, tiempoPostProcesoH: 0.5, tiempoTotalH: 2.5, velocidadMmS: 50, piezasPorUnidad: 1, tiempoLote5H: 12.5 },
  { id: 'RD-014', nombre: 'Tablero de Ábaco', material: 'PLA', tiempoImpresionH: 5, tiempoPostProcesoH: 0.8, tiempoTotalH: 5.8, velocidadMmS: 55, piezasPorUnidad: 22, tiempoLote5H: 29 },
  { id: 'RD-015', nombre: 'Soporte Libro Manos Libres', material: 'PETG', tiempoImpresionH: 7, tiempoPostProcesoH: 1, tiempoTotalH: 8, velocidadMmS: 50, piezasPorUnidad: 4, tiempoLote5H: 40 },
  { id: 'RD-016', nombre: 'Figura Anatómica Corazón Humano', material: 'PLA+', tiempoImpresionH: 7, tiempoPostProcesoH: 1.5, tiempoTotalH: 8.5, velocidadMmS: 45, piezasPorUnidad: 2, tiempoLote5H: 42.5 },
  { id: 'RD-017', nombre: 'Figura Sistema Solar Escala', material: 'PLA', tiempoImpresionH: 9.5, tiempoPostProcesoH: 2, tiempoTotalH: 11.5, velocidadMmS: 55, piezasPorUnidad: 8, tiempoLote5H: 57.5 },
  { id: 'RD-018', nombre: 'Figura Célula Animal Desmontable', material: 'PLA+', tiempoImpresionH: 8, tiempoPostProcesoH: 2, tiempoTotalH: 10, velocidadMmS: 50, piezasPorUnidad: 9, tiempoLote5H: 50 },
  { id: 'RD-019', nombre: 'Figura Esqueleto Humano Articulado', material: 'PETG', tiempoImpresionH: 12, tiempoPostProcesoH: 3, tiempoTotalH: 15, velocidadMmS: 45, piezasPorUnidad: 22, tiempoLote5H: 75 },
  { id: 'RD-020', nombre: 'Figura Volcán en Corte', material: 'PLA', tiempoImpresionH: 5.5, tiempoPostProcesoH: 1, tiempoTotalH: 6.5, velocidadMmS: 55, piezasPorUnidad: 3, tiempoLote5H: 32.5 },
  { id: 'RD-021', nombre: 'Accesorio Silla de Ruedas Portavasos', material: 'PETG', tiempoImpresionH: 2, tiempoPostProcesoH: 0.5, tiempoTotalH: 2.5, velocidadMmS: 50, piezasPorUnidad: 1, tiempoLote5H: 12.5 },
  { id: 'RD-022', nombre: 'Accesorio Soporte Tablet Cama', material: 'PETG', tiempoImpresionH: 4.5, tiempoPostProcesoH: 1, tiempoTotalH: 5.5, velocidadMmS: 50, piezasPorUnidad: 3, tiempoLote5H: 27.5 },
  { id: 'RD-023', nombre: 'Accesorio Abrepuertas de Muñeca', material: 'TPU', tiempoImpresionH: 1, tiempoPostProcesoH: 0.3, tiempoTotalH: 1.3, velocidadMmS: 30, piezasPorUnidad: 1, tiempoLote5H: 6.5 },
  { id: 'RD-024', nombre: 'Figura Pirámide de Giza Seccionada', material: 'PLA', tiempoImpresionH: 6, tiempoPostProcesoH: 1.5, tiempoTotalH: 7.5, velocidadMmS: 55, piezasPorUnidad: 2, tiempoLote5H: 37.5 },
  { id: 'RD-025', nombre: 'Accesorio Sujetador de Páginas', material: 'TPU', tiempoImpresionH: 0.8, tiempoPostProcesoH: 0.2, tiempoTotalH: 1, velocidadMmS: 30, piezasPorUnidad: 1, tiempoLote5H: 5 },
];

export const PRODUCTOS: ProductoInventario[] = [
  { id: 'RD-001', nombre: 'Abecedario Braille Modular', categoria: 'Accesibilidad Visual', unidadesProducidas: 45, unidadesEntregadas: 38, unidadesDisponibles: 5, enProduccion: 3, reservadas: 2, estado: 'Disponible' },
  { id: 'RD-002', nombre: 'Figuras Geométricas Táctiles', categoria: 'Material Didáctico', unidadesProducidas: 30, unidadesEntregadas: 22, unidadesDisponibles: 6, enProduccion: 4, reservadas: 2, estado: 'Disponible' },
  { id: 'RD-003', nombre: 'Mapa de Colombia Relieve', categoria: 'Material Didáctico', unidadesProducidas: 18, unidadesEntregadas: 12, unidadesDisponibles: 5, enProduccion: 2, reservadas: 1, estado: 'Disponible' },
  { id: 'RD-004', nombre: 'Teclado Braille Portátil', categoria: 'Accesibilidad Visual', unidadesProducidas: 22, unidadesEntregadas: 18, unidadesDisponibles: 2, enProduccion: 5, reservadas: 2, estado: 'Stock Bajo' },
  { id: 'RD-005', nombre: 'Átomos y Moléculas Kit', categoria: 'Material Didáctico', unidadesProducidas: 16, unidadesEntregadas: 10, unidadesDisponibles: 6, enProduccion: 2, reservadas: 0, estado: 'Disponible' },
  { id: 'RD-006', nombre: 'Tablero Comunicación AAC', categoria: 'Comunicación Aumentativa', unidadesProducidas: 12, unidadesEntregadas: 9, unidadesDisponibles: 2, enProduccion: 2, reservadas: 1, estado: 'Stock Bajo' },
  { id: 'RD-007', nombre: 'Rompecabezas Mapa Mundi', categoria: 'Material Didáctico', unidadesProducidas: 25, unidadesEntregadas: 20, unidadesDisponibles: 3, enProduccion: 3, reservadas: 2, estado: 'Stock Bajo' },
  { id: 'RD-008', nombre: 'Regla Táctil con Braille', categoria: 'Accesibilidad Visual', unidadesProducidas: 60, unidadesEntregadas: 52, unidadesDisponibles: 4, enProduccion: 8, reservadas: 4, estado: 'Disponible' },
  { id: 'RD-009', nombre: 'Fracciones Montessori', categoria: 'Material Didáctico', unidadesProducidas: 28, unidadesEntregadas: 22, unidadesDisponibles: 4, enProduccion: 4, reservadas: 2, estado: 'Disponible' },
  { id: 'RD-010', nombre: 'Agarre Lápiz Adaptado', categoria: 'Accesibilidad Motriz', unidadesProducidas: 80, unidadesEntregadas: 68, unidadesDisponibles: 7, enProduccion: 10, reservadas: 5, estado: 'Disponible' },
  { id: 'RD-011', nombre: 'Letras Mayúsculas Táctiles', categoria: 'Accesibilidad Visual', unidadesProducidas: 20, unidadesEntregadas: 14, unidadesDisponibles: 5, enProduccion: 3, reservadas: 1, estado: 'Disponible' },
  { id: 'RD-012', nombre: 'Reloj Didáctico Desmontable', categoria: 'Material Didáctico', unidadesProducidas: 15, unidadesEntregadas: 10, unidadesDisponibles: 4, enProduccion: 2, reservadas: 1, estado: 'Disponible' },
  { id: 'RD-013', nombre: 'Protractor Táctil', categoria: 'Accesibilidad Visual', unidadesProducidas: 18, unidadesEntregadas: 14, unidadesDisponibles: 3, enProduccion: 2, reservadas: 1, estado: 'Stock Bajo' },
  { id: 'RD-014', nombre: 'Tablero de Ábaco', categoria: 'Material Didáctico', unidadesProducidas: 22, unidadesEntregadas: 16, unidadesDisponibles: 5, enProduccion: 3, reservadas: 1, estado: 'Disponible' },
  { id: 'RD-015', nombre: 'Soporte Libro Manos Libres', categoria: 'Accesibilidad Motriz', unidadesProducidas: 14, unidadesEntregadas: 10, unidadesDisponibles: 3, enProduccion: 2, reservadas: 1, estado: 'Stock Bajo' },
  { id: 'RD-016', nombre: 'Figura Anatómica Corazón Humano', categoria: 'Figuras Didácticas', unidadesProducidas: 10, unidadesEntregadas: 6, unidadesDisponibles: 2, enProduccion: 4, reservadas: 2, estado: 'Stock Bajo' },
  { id: 'RD-017', nombre: 'Figura Sistema Solar Escala', categoria: 'Figuras Didácticas', unidadesProducidas: 8, unidadesEntregadas: 4, unidadesDisponibles: 3, enProduccion: 2, reservadas: 1, estado: 'Stock Bajo' },
  { id: 'RD-018', nombre: 'Figura Célula Animal Desmontable', categoria: 'Figuras Didácticas', unidadesProducidas: 10, unidadesEntregadas: 6, unidadesDisponibles: 2, enProduccion: 3, reservadas: 2, estado: 'Stock Bajo' },
  { id: 'RD-019', nombre: 'Figura Esqueleto Humano Articulado', categoria: 'Figuras Didácticas', unidadesProducidas: 6, unidadesEntregadas: 2, unidadesDisponibles: 3, enProduccion: 2, reservadas: 1, estado: 'Stock Bajo' },
  { id: 'RD-020', nombre: 'Figura Volcán en Corte', categoria: 'Figuras Didácticas', unidadesProducidas: 12, unidadesEntregadas: 8, unidadesDisponibles: 3, enProduccion: 3, reservadas: 1, estado: 'Stock Bajo' },
  { id: 'RD-021', nombre: 'Accesorio Silla de Ruedas Portavasos', categoria: 'Accesorios de Accesibilidad', unidadesProducidas: 20, unidadesEntregadas: 12, unidadesDisponibles: 5, enProduccion: 6, reservadas: 3, estado: 'Disponible' },
  { id: 'RD-022', nombre: 'Accesorio Soporte Tablet Cama', categoria: 'Accesorios de Accesibilidad', unidadesProducidas: 14, unidadesEntregadas: 8, unidadesDisponibles: 4, enProduccion: 4, reservadas: 2, estado: 'Disponible' },
  { id: 'RD-023', nombre: 'Accesorio Abrepuertas de Muñeca', categoria: 'Accesorios de Accesibilidad', unidadesProducidas: 50, unidadesEntregadas: 38, unidadesDisponibles: 8, enProduccion: 10, reservadas: 4, estado: 'Disponible' },
  { id: 'RD-024', nombre: 'Figura Pirámide de Giza Seccionada', categoria: 'Figuras Didácticas', unidadesProducidas: 10, unidadesEntregadas: 6, unidadesDisponibles: 3, enProduccion: 2, reservadas: 1, estado: 'Stock Bajo' },
  { id: 'RD-025', nombre: 'Accesorio Sujetador de Páginas', categoria: 'Accesorios de Accesibilidad', unidadesProducidas: 60, unidadesEntregadas: 48, unidadesDisponibles: 7, enProduccion: 12, reservadas: 5, estado: 'Disponible' },
];
