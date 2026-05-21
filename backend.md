# Backend — ANDES Catálogo 3D
**NestJS + Prisma + PostgreSQL (Supabase) | Puerto 4000**

---

## Setup inicial

```bash
npm i -g @nestjs/cli
nest new backend --strict
cd backend

npm install @prisma/client prisma
npm install @nestjs/config
npm install class-validator class-transformer
npm install @nestjs/mapped-types

npx prisma init
```

---

## Variables de entorno

```env
# backend/.env
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
PORT=4000
FRONTEND_URL=http://localhost:3000
```

---

## Schema Prisma

```prisma
// backend/prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Modelo {
  id          String      @id @default(cuid())
  nombre      String
  categoria   Categoria
  descripcion String
  archivoGlb  String
  imagen      String
  solicitudes Solicitud[]
}

model Solicitud {
  id            String    @id @default(cuid())
  nombre        String
  cedula        String    @unique
  ciudad        String
  correo        String
  telefono      String
  tipoMaterial  Categoria
  modeloId      String
  estado        Estado    @default(RECIBIDA)
  fechaRegistro DateTime  @default(now())
  modelo        Modelo    @relation(fields: [modeloId], references: [id])
}

enum Categoria {
  ACCESIBILIDAD_VISUAL
  ACCESIBILIDAD_MOTRIZ
  MATERIAL_DIDACTICO
  COMUNICACION_AUMENTATIVA
  FIGURAS_DIDACTICAS
  ACCESORIOS_ACCESIBILIDAD
}

enum Estado {
  RECIBIDA
  EN_PRODUCCION
  REVISION_CALIDAD
  EMPAQUE_TRANSPORTE
  ENTREGADA
}
```

```bash
npx prisma migrate dev --name init
```

---

## Estructura de carpetas

```
backend/
  src/
    prisma/
      prisma.module.ts
      prisma.service.ts
    modelos/
      modelos.module.ts
      modelos.controller.ts
      modelos.service.ts
    solicitudes/
      solicitudes.module.ts
      solicitudes.controller.ts
      solicitudes.service.ts
      dto/
        create-solicitud.dto.ts
        update-estado.dto.ts
    app.module.ts
    main.ts
  prisma/
    schema.prisma
    seed.ts
  .env
```

---

## PrismaService

```typescript
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

```typescript
// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

---

## Módulo Modelos

```typescript
// src/modelos/modelos.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ModelosService } from './modelos.service';
import { Categoria } from '@prisma/client';

@Controller('modelos')
export class ModelosController {
  constructor(private readonly modelosService: ModelosService) {}

  @Get()
  findAll(@Query('categoria') categoria?: Categoria) {
    return this.modelosService.findAll(categoria);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modelosService.findOne(id);
  }
}
```

```typescript
// src/modelos/modelos.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Categoria } from '@prisma/client';

@Injectable()
export class ModelosService {
  constructor(private prisma: PrismaService) {}

  findAll(categoria?: Categoria) {
    return this.prisma.modelo.findMany({
      where: categoria ? { categoria } : undefined,
      orderBy: { nombre: 'asc' },
    });
  }

  async findOne(id: string) {
    const modelo = await this.prisma.modelo.findUnique({ where: { id } });
    if (!modelo) throw new NotFoundException(`Modelo ${id} no encontrado`);
    return modelo;
  }
}
```

```typescript
// src/modelos/modelos.module.ts
import { Module } from '@nestjs/common';
import { ModelosController } from './modelos.controller';
import { ModelosService } from './modelos.service';

@Module({
  controllers: [ModelosController],
  providers: [ModelosService],
})
export class ModelosModule {}
```

---

## DTOs — Solicitudes

```typescript
// src/solicitudes/dto/create-solicitud.dto.ts
import {
  IsEmail, IsEnum, IsNotEmpty, IsString, Matches, MinLength,
} from 'class-validator';
import { Categoria } from '@prisma/client';

export class CreateSolicitudDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @Matches(/^\d{6,10}$/, { message: 'Cédula debe tener entre 6 y 10 dígitos' })
  cedula: string;

  @IsNotEmpty()
  @IsString()
  ciudad: string;

  @IsEmail({}, { message: 'Correo inválido' })
  correo: string;

  @Matches(/^\d{10}$/, { message: 'Teléfono debe tener 10 dígitos' })
  telefono: string;

  @IsEnum(Categoria)
  tipoMaterial: Categoria;

  @IsNotEmpty()
  @IsString()
  modeloId: string;
}
```

```typescript
// src/solicitudes/dto/update-estado.dto.ts
import { IsEnum } from 'class-validator';
import { Estado } from '@prisma/client';

export class UpdateEstadoDto {
  @IsEnum(Estado)
  estado: Estado;
}
```

---

## Módulo Solicitudes

```typescript
// src/solicitudes/solicitudes.controller.ts
import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { SolicitudesService } from './solicitudes.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { Estado } from '@prisma/client';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(private readonly solicitudesService: SolicitudesService) {}

  @Post()
  create(@Body() dto: CreateSolicitudDto) {
    return this.solicitudesService.create(dto);
  }

  @Get()
  findAll(
    @Query('ciudad') ciudad?: string,
    @Query('estado') estado?: Estado,
  ) {
    return this.solicitudesService.findAll(ciudad, estado);
  }

  @Patch(':id')
  updateEstado(@Param('id') id: string, @Body() dto: UpdateEstadoDto) {
    return this.solicitudesService.updateEstado(id, dto);
  }
}
```

```typescript
// src/solicitudes/solicitudes.service.ts
import {
  ConflictException, Injectable, NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';
import { Estado } from '@prisma/client';

@Injectable()
export class SolicitudesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateSolicitudDto) {
    const existe = await this.prisma.solicitud.findUnique({
      where: { cedula: dto.cedula },
    });
    if (existe) {
      throw new ConflictException('Ya existe una solicitud con esa cédula');
    }

    // Verificar que el modelo existe antes de crear la solicitud
    const modelo = await this.prisma.modelo.findUnique({
      where: { id: dto.modeloId },
    });
    if (!modelo) {
      throw new NotFoundException(`Modelo ${dto.modeloId} no encontrado`);
    }

    return this.prisma.solicitud.create({ data: dto });
  }

  findAll(ciudad?: string, estado?: Estado) {
    return this.prisma.solicitud.findMany({
      where: {
        ...(ciudad ? { ciudad } : {}),
        ...(estado ? { estado } : {}),
      },
      include: { modelo: true },
      orderBy: { fechaRegistro: 'desc' },
    });
  }

  async updateEstado(id: string, dto: UpdateEstadoDto) {
    const existe = await this.prisma.solicitud.findUnique({ where: { id } });
    if (!existe) throw new NotFoundException(`Solicitud ${id} no encontrada`);

    return this.prisma.solicitud.update({
      where: { id },
      data: { estado: dto.estado },
    });
  }
}
```

```typescript
// src/solicitudes/solicitudes.module.ts
import { Module } from '@nestjs/common';
import { SolicitudesController } from './solicitudes.controller';
import { SolicitudesService } from './solicitudes.service';

@Module({
  controllers: [SolicitudesController],
  providers: [SolicitudesService],
})
export class SolicitudesModule {}
```

---

## AppModule

```typescript
// src/app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { ModelosModule } from './modelos/modelos.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ModelosModule,
    SolicitudesModule,
  ],
})
export class AppModule {}
```

---

## main.ts

```typescript
// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS — permite peticiones desde el frontend
  app.enableCors({
    origin: [
      process.env.FRONTEND_URL ?? 'http://localhost:3000',
      'https://*.vercel.app', // producción Vercel
    ],
    methods: ['GET', 'POST', 'PATCH'],
  });

  // Validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // elimina campos no declarados en el DTO
      forbidNonWhitelisted: true,
      transform: true,       // convierte strings a los tipos del DTO
    }),
  );

  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`Backend corriendo en http://localhost:${port}`);
}
bootstrap();
```

---

## Seed de datos

```typescript
// prisma/seed.ts
import { PrismaClient, Categoria, Estado } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.solicitud.deleteMany();
  await prisma.modelo.deleteMany();

  // Modelos reales del catálogo ANDES (insumos.xlsx)
  const modelosData = [
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

  const modelos: Record<string, string> = {};
  for (const data of modelosData) {
    const { id, ...rest } = data;
    const m = await prisma.modelo.create({ data: { id, ...rest } });
    modelos[id] = m.id;
  }

  // Solicitudes reales del Excel (Estados de Solicitudes)
  const solicitudesData = [
    { nombre: 'Escuela Normal Superior Barranquilla', cedula: '8001001001', ciudad: 'Barranquilla', correo: 'contacto@normalsup.edu.co', telefono: '3001000001', tipoMaterial: Categoria.ACCESIBILIDAD_VISUAL, modeloId: modelos['RD-001'], estado: Estado.ENTREGADA },
    { nombre: 'Instituto para Ciegos del Caribe', cedula: '8001002002', ciudad: 'Barranquilla', correo: 'ciegos@caribe.org', telefono: '3001000002', tipoMaterial: Categoria.ACCESIBILIDAD_VISUAL, modeloId: modelos['RD-004'], estado: Estado.ENTREGADA },
    { nombre: 'Colegio Distrital Las Nieves', cedula: '8001003003', ciudad: 'Barranquilla', correo: 'lasnieves@edu.co', telefono: '3001000003', tipoMaterial: Categoria.MATERIAL_DIDACTICO, modeloId: modelos['RD-002'], estado: Estado.ENTREGADA },
    { nombre: 'Fundación Manos Abiertas', cedula: '8001004004', ciudad: 'Barranquilla', correo: 'manosabiertas@fundacion.org', telefono: '3001000004', tipoMaterial: Categoria.COMUNICACION_AUMENTATIVA, modeloId: modelos['RD-006'], estado: Estado.EMPAQUE_TRANSPORTE },
    { nombre: 'Colegio Fe y Alegría No. 1', cedula: '8001005005', ciudad: 'Barranquilla', correo: 'feyalegria@edu.co', telefono: '3001000005', tipoMaterial: Categoria.MATERIAL_DIDACTICO, modeloId: modelos['RD-009'], estado: Estado.EMPAQUE_TRANSPORTE },
    { nombre: 'IED Simón Bolívar', cedula: '8001006006', ciudad: 'Barranquilla', correo: 'simonbolivar@ied.edu.co', telefono: '3001000006', tipoMaterial: Categoria.MATERIAL_DIDACTICO, modeloId: modelos['RD-003'], estado: Estado.REVISION_CALIDAD },
    { nombre: 'Hogar Infantil Comunitario El Prado', cedula: '8001007007', ciudad: 'Barranquilla', correo: 'elprado@hogar.org', telefono: '3001000007', tipoMaterial: Categoria.ACCESIBILIDAD_MOTRIZ, modeloId: modelos['RD-010'], estado: Estado.REVISION_CALIDAD },
    { nombre: 'Escuela Normal Superior Barranquilla', cedula: '8001008008', ciudad: 'Barranquilla', correo: 'normalsup2@edu.co', telefono: '3001000008', tipoMaterial: Categoria.MATERIAL_DIDACTICO, modeloId: modelos['RD-005'], estado: Estado.EN_PRODUCCION },
    { nombre: 'Instituto para Ciegos del Caribe', cedula: '8001009009', ciudad: 'Barranquilla', correo: 'ciegos2@caribe.org', telefono: '3001000009', tipoMaterial: Categoria.ACCESIBILIDAD_VISUAL, modeloId: modelos['RD-008'], estado: Estado.EN_PRODUCCION },
    { nombre: 'Colegio Distrital Las Nieves', cedula: '8001010010', ciudad: 'Barranquilla', correo: 'lasnieves2@edu.co', telefono: '3001000010', tipoMaterial: Categoria.MATERIAL_DIDACTICO, modeloId: modelos['RD-007'], estado: Estado.EN_PRODUCCION },
    { nombre: 'Colegio San José de la Salle', cedula: '8001016016', ciudad: 'Barranquilla', correo: 'sallecol@edu.co', telefono: '3001000016', tipoMaterial: Categoria.FIGURAS_DIDACTICAS, modeloId: modelos['RD-016'], estado: Estado.EN_PRODUCCION },
    { nombre: 'Universidad del Atlántico', cedula: '8001017017', ciudad: 'Barranquilla', correo: 'uatlantico@edu.co', telefono: '3001000017', tipoMaterial: Categoria.FIGURAS_DIDACTICAS, modeloId: modelos['RD-017'], estado: Estado.EN_PRODUCCION },
    { nombre: 'Fundación Manos Abiertas', cedula: '8001011011', ciudad: 'Barranquilla', correo: 'manosabiertas2@fundacion.org', telefono: '3001000011', tipoMaterial: Categoria.ACCESIBILIDAD_VISUAL, modeloId: modelos['RD-001'], estado: Estado.RECIBIDA },
    { nombre: 'Hogar Gerontológico El Carmen', cedula: '8001020020', ciudad: 'Barranquilla', correo: 'elcarmen@hogar.org', telefono: '3001000020', tipoMaterial: Categoria.ACCESORIOS_ACCESIBILIDAD, modeloId: modelos['RD-021'], estado: Estado.RECIBIDA },
    { nombre: 'Fundación Rehabilitar Caribe', cedula: '8001025025', ciudad: 'Barranquilla', correo: 'rehabilitar@caribe.org', telefono: '3001000025', tipoMaterial: Categoria.ACCESORIOS_ACCESIBILIDAD, modeloId: modelos['RD-021'], estado: Estado.RECIBIDA },
    { nombre: 'Fundación Manos Abiertas', cedula: '8001019019', ciudad: 'Barranquilla', correo: 'manosabiertas3@fundacion.org', telefono: '3001000019', tipoMaterial: Categoria.ACCESORIOS_ACCESIBILIDAD, modeloId: modelos['RD-023'], estado: Estado.RECIBIDA },
    { nombre: 'Escuela Normal Superior Barranquilla', cedula: '8001024024', ciudad: 'Barranquilla', correo: 'normalsup3@edu.co', telefono: '3001000024', tipoMaterial: Categoria.FIGURAS_DIDACTICAS, modeloId: modelos['RD-019'], estado: Estado.RECIBIDA },
  ];

  for (const data of solicitudesData) {
    await prisma.solicitud.create({ data });
  }

  console.log(`Seed completado: ${modelosData.length} modelos + ${solicitudesData.length} solicitudes`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Agregar en `package.json`:

```json
"scripts": {
  "seed": "ts-node prisma/seed.ts"
}
```

```bash
npm run seed
```

---

## Resumen de endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `GET` | `/modelos` | Listar todos. `?categoria=MATERIAL_DIDACTICO` para filtrar |
| `GET` | `/modelos/:id` | Obtener un modelo por ID |
| `POST` | `/solicitudes` | Crear solicitud (valida cédula única) |
| `GET` | `/solicitudes` | Listar todas. `?ciudad=X&estado=Y` para filtrar |
| `PATCH` | `/solicitudes/:id` | Actualizar estado de una solicitud |

### Respuestas de error esperadas

| Código | Cuándo |
|--------|--------|
| `400` | Campos inválidos en el DTO (ValidationPipe) |
| `404` | Modelo o solicitud no existe |
| `409` | Cédula ya registrada |

---

## Orden de arranque

```bash
# 1. Crear tablas en Supabase
npx prisma migrate dev --name init

# 2. Poblar con datos de prueba
npm run seed

# 3. Iniciar servidor de desarrollo
npm run start:dev
# → http://localhost:4000
```

---

## Deploy en Railway

```bash
# Variables de entorno a configurar en Railway:
DATABASE_URL   = [URL de Supabase]
PORT           = 4000
FRONTEND_URL   = https://[tu-proyecto].vercel.app
```

Railway detecta NestJS automáticamente desde `package.json` y ejecuta `npm run build && npm run start:prod`.

Asegurarse de que `tsconfig.json` incluya:

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```
