# Plan de Trabajo MVP — ANDES Catálogo 3D
**Stack: Next.js + NestJS + PostgreSQL | Hackathon 21-22 Mayo 2026**

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────┐
│                    CLIENTE                          │
│              Next.js (puerto 3000)                  │
│   /          → Catálogo 3D público                  │
│   /solicitud → Formulario de registro               │
│   /admin     → Dashboard administrativo             │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (fetch / axios)
┌──────────────────────▼──────────────────────────────┐
│                   BACKEND                           │
│              NestJS API (puerto 4000)               │
│   GET  /modelos          → Listar catálogo          │
│   POST /solicitudes      → Crear solicitud          │
│   GET  /solicitudes      → Listar (admin)           │
│   PATCH /solicitudes/:id → Cambiar estado           │
└──────────────────────┬──────────────────────────────┘
                       │ Prisma ORM
┌──────────────────────▼──────────────────────────────┐
│                  BASE DE DATOS                      │
│         PostgreSQL (Supabase — cloud gratis)        │
└─────────────────────────────────────────────────────┘
```

---

## Stack Definitivo

| Capa | Tecnologia | Justificacion |
|---|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS | SSR + routing nativo |
| Visor 3D | `@google/model-viewer` (dynamic import) | Minimo setup en Next.js |
| Backend | NestJS + TypeScript | Modular, escalable, decoradores claros |
| ORM | Prisma | Schema as code, migraciones automaticas |
| Base de datos | PostgreSQL via Supabase | Cloud gratuito, sin instalar nada local |
| Deploy Frontend | Vercel | Deploy con `git push`, gratis |
| Deploy Backend | Railway | Deploy NestJS en minutos, gratis |

---

## Estructura de Carpetas

```
/andes-mvp
  /frontend                     ← Next.js
    /app
      /page.tsx                 ← Catálogo público
      /solicitud/page.tsx       ← Formulario
      /admin/page.tsx           ← Dashboard
    /components
      /ModelCard.tsx
      /ModelViewer.tsx          ← Wrapper de <model-viewer>
      /SolicitudForm.tsx
      /AdminTable.tsx
      /EstadoBadge.tsx
    /lib
      /api.ts                   ← Funciones fetch al backend
    /types
      /index.ts                 ← Tipos compartidos

  /backend                      ← NestJS
    /src
      /modelos
        /modelos.module.ts
        /modelos.controller.ts
        /modelos.service.ts
      /solicitudes
        /solicitudes.module.ts
        /solicitudes.controller.ts
        /solicitudes.service.ts
        /dto
          /create-solicitud.dto.ts
          /update-estado.dto.ts
      /app.module.ts
      /main.ts
    /prisma
      /schema.prisma
      /seed.ts
```

---

## Schema de Base de Datos (Prisma)

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
  id          String       @id @default(cuid())
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
  estado        Estado    @default(INTERESADO)
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

---

## DIA 1 — 21 de Mayo

### Bloque 1 | 0:00 – 1:30h — Setup del Proyecto
**Responsable:** Dev Backend (lider del setup)

```bash
# Frontend
npx create-next-app@latest frontend --typescript --tailwind --app

# Backend
npm i -g @nestjs/cli
nest new backend

# Backend: instalar dependencias clave
cd backend
npm install @prisma/client prisma @nestjs/config
npm install class-validator class-transformer
npx prisma init
```

- [ ] Configurar `.env` del backend con `DATABASE_URL` de Supabase
- [ ] Copiar el schema Prisma y ejecutar `npx prisma migrate dev --name init`
- [ ] Verificar conexion a PostgreSQL: `npx prisma studio`
- [ ] Habilitar CORS en NestJS (`main.ts`) apuntando a `localhost:3000`
- [ ] Configurar variable de entorno en Next.js: `NEXT_PUBLIC_API_URL=http://localhost:4000`
- [ ] Ambos servidores corriendo: `npm run dev` en cada carpeta

**Entregable:** `localhost:3000` y `localhost:4000` activos, DB conectada con tablas creadas.

---

### Bloque 2 | 1:30 – 3:30h — Backend: Modulos NestJS
**Responsable:** Dev Backend

**Modulo Modelos:**
```typescript
// GET /modelos
// GET /modelos/:id
```
- [ ] `ModelsModule`, `ModelsController`, `ModelsService`
- [ ] Inyectar `PrismaService` en el servicio
- [ ] Endpoint `GET /modelos` con filtro opcional por `?categoria=DIDACTICO`
- [ ] Endpoint `GET /modelos/:id`

**Modulo Solicitudes:**
```typescript
// POST /solicitudes       → crear
// GET  /solicitudes       → listar (admin) con ?ciudad= y ?estado=
// PATCH /solicitudes/:id  → actualizar estado
```
- [ ] `CreateSolicitudDto` con decoradores de validacion (`@IsEmail`, `@IsNotEmpty`, etc.)
- [ ] `UpdateEstadoDto` con enum de estados
- [ ] Validacion global con `ValidationPipe` en `main.ts`

**Seed de datos:**
- [ ] `prisma/seed.ts` con 5 modelos 3D y 10 solicitudes de prueba
- [ ] Agregar script en `package.json`: `"seed": "ts-node prisma/seed.ts"`

**Entregable:** Todos los endpoints funcionando, verificados con Postman o Thunder Client.

---

### Bloque 3 | 3:30 – 5:30h — Frontend: Catalogo 3D (page.tsx)
**Responsable:** Dev Frontend 1

**Wrapper de Model-Viewer (dynamic import obligatorio en Next.js):**
```typescript
// components/ModelViewer.tsx
'use client'
import dynamic from 'next/dynamic'

const ModelViewerComponent = dynamic(
  () => import('./ModelViewerInner'),
  { ssr: false }  // Model-Viewer es web component, no funciona en SSR
)
```

- [ ] Fetch a `GET /modelos` con `useEffect` o React Server Component
- [ ] Grid de tarjetas: imagen, nombre, categoría, botón "Ver en 3D"
- [ ] Modal con `<model-viewer>` rotable al hacer clic
- [ ] Tabs/filtro por categoría: Didáctico | Accesibilidad
- [ ] Botón "Solicitar" por tarjeta → navega a `/solicitud?modeloId=xxx`

**Entregable:** Catálogo mostrando modelos desde la API con visor 3D funcional.

---

### Bloque 4 | 5:30 – 7:30h — Frontend: Formulario de Registro
**Responsable:** Dev Frontend 2

- [ ] Leer `modeloId` de query params (`useSearchParams`)
- [ ] Mostrar preview del modelo seleccionado arriba del formulario
- [ ] Campos con validacion en cliente antes de enviar:

```typescript
// types/index.ts
interface CreateSolicitudPayload {
  nombre: string        // required
  cedula: string        // required, solo numeros
  ciudad: string        // select de ciudades
  correo: string        // formato email
  telefono: string      // 10 digitos
  tipoMaterial: 'DIDACTICO' | 'ACCESIBILIDAD'
  modeloId: string
}
```

- [ ] `POST /solicitudes` al enviar, manejar estado de carga
- [ ] Pantalla de exito tras envio exitoso
- [ ] Manejar error de cedula duplicada (409 del backend)

**Entregable:** Formulario completo guardando datos en PostgreSQL via NestJS.

---

### Bloque 5 | 7:30 – 8:00h — Revision Dia 1
**Todo el equipo**

- [ ] Flujo completo: Catálogo → clic modelo → formulario → datos en DB
- [ ] Verificar en Prisma Studio que los datos llegan correctamente
- [ ] Commit y push al repo

---

## DIA 2 — 22 de Mayo

### Bloque 6 | 0:00 – 3:00h — Dashboard Administrativo
**Responsable:** Dev Frontend 1 + Dev Backend

**Backend — verificar endpoint:**
```
GET /solicitudes?ciudad=Bucaramanga&estado=INTERESADO
```

**Frontend `/admin/page.tsx`:**
- [ ] Tabla con columnas: Nombre, Cédula, Ciudad, Correo, Teléfono, Material, Estado, Fecha
- [ ] Fetch a `GET /solicitudes` con React Server Component (o `useEffect`)
- [ ] Dropdown de **Ciudad** dinamico (extrae valores unicos de los datos)
- [ ] Dropdown de **Estado** con los 6 valores del enum
- [ ] Al cambiar filtros: re-fetch con nuevos query params
- [ ] Contador resumen en la parte superior:

```
Total: 45  |  Confirmó: 12  |  Interesado: 18  |  No interesado: 5  |  Pendientes: 10
```

- [ ] Badge de color por estado:

| Estado | Color |
|---|---|
| Confirmó | Verde |
| Interesado | Azul |
| Llamar después | Amarillo |
| No responde / No contestó | Naranja |
| No interesado | Rojo |

**Entregable:** Dashboard mostrando solicitudes reales con filtros funcionando.

---

### Bloque 7 | 3:00 – 4:30h — Gestion de Estados en Dashboard
**Responsable:** Dev Frontend 2 + Dev Backend

- [ ] Cada fila tiene un `<select>` con los 6 estados
- [ ] Al cambiar: llamar `PATCH /solicitudes/:id` con el nuevo estado
- [ ] Feedback visual inmediato: spinner mientras actualiza, badge cambia de color al confirmar
- [ ] Manejar error de red con mensaje amigable

```typescript
// lib/api.ts
export async function updateEstado(id: string, estado: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solicitudes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  })
  if (!res.ok) throw new Error('Error al actualizar estado')
  return res.json()
}
```

**Entregable:** Admin puede cambiar estados en vivo y se persisten en PostgreSQL.

---

### Bloque 8 | 4:30 – 5:30h — UI Polish y Responsive
**Responsable:** Todo el equipo

- [ ] Navbar consistente en las 3 paginas con logo de ANDES
- [ ] Breakpoints mobile en catalogo (1 columna) y dashboard (scroll horizontal en tabla)
- [ ] Loading skeletons mientras carga la API
- [ ] Estado vacio: mensaje cuando no hay solicitudes con los filtros aplicados
- [ ] Favicon y `<title>` correcto en cada pagina

---

### Bloque 9 | 5:30 – 6:30h — Pruebas de Integracion
**Responsable:** Todo el equipo

- [ ] Flujo completo de punta a punta en produccion (no localhost)
- [ ] Intentar enviar formulario con datos invalidos → debe rechazar
- [ ] Intentar duplicar cedula → debe mostrar error
- [ ] Cambiar estado de 3 solicitudes distintas y verificar en DB
- [ ] Probar visor 3D en mobile
- [ ] Revisar consola del navegador: cero errores criticos

---

### Bloque 10 | 6:30 – 8:00h — Deploy + Documentacion + Demo
**Responsable:** Todo el equipo

**Deploy:**
```bash
# Backend → Railway
# 1. Conectar repo a Railway
# 2. Agregar variable DATABASE_URL (Supabase)
# 3. Railway detecta NestJS automaticamente

# Frontend → Vercel
# 1. Conectar repo a Vercel
# 2. Agregar variable NEXT_PUBLIC_API_URL con URL de Railway
# 3. git push = deploy automatico
```

- [ ] Variables de entorno configuradas en ambos servicios
- [ ] URL publica de produccion funcionando
- [ ] `README.md` con: descripcion, arquitectura, endpoints de la API, instrucciones de setup

**Guion de demo (5 minutos):**
1. Problema de ANDES — gestion manual y dispersa (30 seg)
2. Catalogo 3D — rotar un modelo en vivo (1 min)
3. Formulario — registrar una solicitud en tiempo real (1 min)
4. Dashboard — ver la solicitud recien creada, cambiar su estado (1 min)
5. Stack tecnico + impacto social (30 seg)

---

## Distribucion de Roles (equipo de 4)

| Miembro | Rol | Bloques principales |
|---|---|---|
| Dev 1 | Backend Lead | Bloques 1, 2 — setup DB, NestJS modules |
| Dev 2 | Frontend Lead | Bloques 3, 6 — catalogo y dashboard |
| Dev 3 | Frontend + Integracion | Bloques 4, 7 — formulario y estados |
| Dev 4 | QA + Datos + Deploy | Seed, pruebas, deploy, documentacion |

---

## Riesgos y Mitigaciones

| Riesgo | Mitigacion |
|---|---|
| Setup lento de NestJS + Prisma | Bloque 1 prioritario, todos presentes para desbloquear rapido |
| `model-viewer` rompe SSR en Next.js | Usar `dynamic()` con `ssr: false` obligatorio |
| CORS bloqueando frontend→backend | Configurar `app.enableCors()` en `main.ts` el primer dia |
| PostgreSQL local dificil de instalar | Usar Supabase desde el inicio, zero instalacion local |
| Poco tiempo para el dashboard | Si hay retraso, simplificar tabla (quitar filtros primero, agregar despues) |

---

## Criterios de Evaluacion vs. Entregables del MVP

| Criterio | Como lo cubrimos |
|---|---|
| **Innovacion** | Visor 3D interactivo con `model-viewer`, experiencia visual unica |
| **Viabilidad tecnica** | Stack profesional Next.js + NestJS + PostgreSQL completamente funcional |
| **Impacto** | Dashboard centraliza toda la demanda social de ANDES en tiempo real |
| **Usabilidad** | Tailwind garantiza UI limpia, formulario con validacion clara |

---

> **Prioridad absoluta si el tiempo apremia:** Backend funcional + Formulario guardando en DB + Dashboard con tabla basica. El visor 3D y los filtros son el segundo nivel.
