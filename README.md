# ANDES — Catálogo 3D de Recursos Educativos

Plataforma web para que instituciones educativas y sociales soliciten recursos didácticos impresos en 3D. Permite explorar un catálogo interactivo con visor 3D, registrar solicitudes y gestionar el pipeline de producción desde un panel administrativo.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Visor 3D | `@google/model-viewer` |
| Backend | NestJS + TypeScript |
| ORM | Prisma |
| Base de datos | PostgreSQL via Supabase |

---

## Arquitectura

```
┌─────────────────────────────────────┐
│        Next.js — puerto 3000        │
│  /           → Catálogo 3D          │
│  /solicitud  → Formulario           │
│  /admin      → Dashboard admin      │
└──────────────┬──────────────────────┘
               │ HTTP fetch
┌──────────────▼──────────────────────┐
│        NestJS API — puerto 4000     │
│  GET    /modelos                    │
│  GET    /modelos/:id                │
│  POST   /solicitudes                │
│  GET    /solicitudes                │
│  PATCH  /solicitudes/:id            │
└──────────────┬──────────────────────┘
               │ Prisma ORM
┌──────────────▼──────────────────────┐
│     PostgreSQL (Supabase cloud)     │
└─────────────────────────────────────┘
```

---

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Cuenta en [Supabase](https://supabase.com) (el proyecto ya existe, pedir credenciales al líder del equipo)

---

## Setup local (paso a paso)

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd Hackaton
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear el archivo `backend/.env` (pedir los valores reales al líder del equipo):

```env
DATABASE_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
PORT=4000
FRONTEND_URL=http://localhost:3000
```

> El archivo `backend/.env.example` tiene la estructura exacta. Solo reemplazar `[PROJECT-ID]` y `[PASSWORD]`.

Inicializar la base de datos:

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run seed
```

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

Crear el archivo `frontend/.env`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Levantar el proyecto

Abrir **dos terminales** en paralelo:

**Terminal 1 — Backend:**
```bash
cd backend
npm run start:dev
# Servidor en http://localhost:4000
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
# Servidor en http://localhost:3000
```

Abrir el navegador en `http://localhost:3000`.

---

## Verificar que la base de datos esté conectada

```bash
cd backend
npx prisma studio
# Abre http://localhost:5555 con interfaz visual de la BD
```

Deberías ver las tablas `Modelo` (15 registros) y `Solicitud` (17 registros) con datos.

---

## Endpoints de la API

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/modelos` | Lista todos los modelos. Acepta `?categoria=MATERIAL_DIDACTICO` |
| `GET` | `/modelos/:id` | Obtiene un modelo por ID |
| `POST` | `/solicitudes` | Crea una solicitud (valida cédula única) |
| `GET` | `/solicitudes` | Lista todas. Acepta `?ciudad=X&estado=Y` |
| `PATCH` | `/solicitudes/:id` | Actualiza el estado de una solicitud |

**Errores esperados:**

| Código | Cuándo |
|---|---|
| `400` | Campos inválidos en el body |
| `404` | Modelo o solicitud no existe |
| `409` | Cédula ya registrada |

---

## Estructura del proyecto

```
Hackaton/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma       ← Modelos de BD
│   │   └── seed.ts             ← Datos de prueba
│   ├── src/
│   │   ├── modelos/            ← Módulo catálogo
│   │   ├── solicitudes/        ← Módulo solicitudes
│   │   ├── shared/prisma/      ← PrismaService global
│   │   ├── app.module.ts
│   │   └── main.ts             ← CORS + ValidationPipe
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/                ← Páginas (App Router)
│   │   │   ├── page.tsx        ← Catálogo público
│   │   │   ├── solicitud/      ← Formulario de registro
│   │   │   └── admin/          ← Dashboard administrativo
│   │   ├── presentation/
│   │   │   └── components/     ← ModelCard, ModelViewer, AdminTable...
│   │   └── infrastructure/     ← API client (fetch al backend)
│   └── .env.example
└── README.md
```

---

## Solución de problemas comunes

**Error `P1001: Can't reach database server`**
El proyecto de Supabase puede estar pausado (free tier). Ir a [supabase.com/dashboard](https://supabase.com/dashboard), entrar al proyecto y hacer clic en "Restore project".

**Error `next.config.ts is not supported`**
Asegurarse de usar `next.config.mjs`. El archivo `.ts` no es compatible con Next.js 14.

**CORS bloqueando el frontend**
Verificar que `FRONTEND_URL` en `backend/.env` sea `http://localhost:3000` y que el backend esté corriendo antes del frontend.

**Cambios en `schema.prisma` no se reflejan**
Correr `npx prisma generate` y reiniciar el backend.
