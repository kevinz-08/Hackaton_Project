# ANDES — Catálogo 3D de Recursos Educativos y de Accesibilidad

MVP desarrollado en el Hackathon Talento Tech Oriente (21–22 Mayo 2026, Bucaramanga).

Plataforma web que centraliza la gestión del catálogo social de ANDES: permite a beneficiarios explorar 25 recursos didácticos y de accesibilidad en 3D interactivo, registrar solicitudes, y al equipo administrativo gestionar el pipeline completo desde un dashboard en tiempo real.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 14 (App Router + API Routes) |
| Visor 3D | `@google/model-viewer` |
| ORM | Prisma 5 |
| Base de datos | PostgreSQL via Supabase |
| Estilos | Tailwind CSS |
| Deploy | Vercel |

---

## Arquitectura

Todo el código de la aplicación vive en `frontend/`. No hay backend separado — las API Routes de Next.js sirven como capa de servidor.

```
frontend/src/
├── app/
│   ├── page.tsx                  → Catálogo 3D público
│   ├── solicitud/page.tsx        → Formulario de registro
│   ├── solicitud/exito/page.tsx  → Confirmación de envío
│   ├── admin/page.tsx            → Dashboard administrativo
│   └── api/
│       ├── modelos/route.ts      → GET (lista + filtro categoría)
│       ├── modelos/[id]/route.ts → GET por ID
│       ├── solicitudes/route.ts  → GET (filtros) + POST
│       └── solicitudes/[id]/route.ts → PATCH estado
├── domain/           → Entidades e interfaces de repositorio
├── application/      → Use cases
├── infrastructure/   → Repositorios HTTP + api-client
├── presentation/     → Componentes React + hooks
├── services/         → Lógica de DB llamada desde API routes
└── lib/              → Prisma singleton + manejo de errores
```

**Flujo de datos:**

- **Servidor:** `app/api/*/route.ts` → `services/*.service.ts` → `lib/prisma.ts`
- **Cliente:** `presentation/hooks/` → `infrastructure/repositories/` → API routes

---

## Requisitos previos

- Node.js 18 o superior
- Cuenta en [Supabase](https://supabase.com) con el proyecto creado

---

## Setup local

### 1. Clonar el repositorio

```bash
git clone <url-del-repo>
cd Hackaton/frontend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear `frontend/.env` con las credenciales de Supabase:

```env
# Conexión con pooling — para queries en runtime
DATABASE_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Conexión directa — para migraciones y Prisma Studio
DIRECT_URL="postgresql://postgres.[PROJECT-ID]:[PASSWORD]@aws-1-us-east-2.pooler.supabase.com:5432/postgres"
```

> Pedir los valores reales de `[PROJECT-ID]` y `[PASSWORD]` al líder del equipo.

### 4. Crear las tablas en Supabase

```bash
npx prisma db push
```

### 5. Poblar la base de datos

```bash
npm run seed
```

Inserta 25 modelos (RD-001–RD-025) y 25 solicitudes (SOL-001–SOL-025) con datos reales de ANDES.

### 6. Levantar el servidor de desarrollo

```bash
npm run dev
# Aplicación en http://localhost:3000
```

---

## Comandos disponibles

Todos desde `frontend/`:

```bash
npm run dev          # Servidor de desarrollo (localhost:3000)
npm run build        # Build de producción
npm run lint         # ESLint
npm run seed         # Poblar DB con 25 modelos + 25 solicitudes
npx prisma db push   # Sincronizar schema con Supabase
npx prisma studio    # GUI visual de la base de datos (localhost:5555)
npx prisma generate  # Regenerar cliente Prisma tras cambios en schema
```

---

## API Routes

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/modelos` | Lista modelos. Acepta `?categoria=MATERIAL_DIDACTICO` |
| `GET` | `/api/modelos/[id]` | Obtiene un modelo por ID |
| `POST` | `/api/solicitudes` | Crea solicitud (valida cédula única) |
| `GET` | `/api/solicitudes` | Lista solicitudes. Acepta `?ciudad=X&estado=Y` |
| `PATCH` | `/api/solicitudes/[id]` | Actualiza el estado de una solicitud |

**Códigos de error:**

| Código | Cuándo |
|---|---|
| `400` | Campos inválidos o faltantes |
| `404` | Recurso no encontrado |
| `409` | Cédula ya registrada |

---

## Modelo de datos

### Estados de solicitud

**Fase CRM** (seguimiento de contacto — requerido por ficha técnica):
`INTERESADO` · `CONFIRMO` · `LLAMAR_DESPUES` · `NO_RESPONDE` · `NO_CONTESTO` · `NO_INTERESADO`

**Fase Producción** (pipeline real de ANDES):
`RECIBIDA` · `EN_PRODUCCION` · `REVISION_CALIDAD` · `EMPAQUE_TRANSPORTE` · `ENTREGADA`

### Categorías de producto

`ACCESIBILIDAD_VISUAL` · `ACCESIBILIDAD_MOTRIZ` · `MATERIAL_DIDACTICO` · `COMUNICACION_AUMENTATIVA` · `FIGURAS_DIDACTICAS` · `ACCESORIOS_ACCESIBILIDAD`

---

## Archivos 3D

Los modelos `.glb` se sirven desde `frontend/public/modelos/` y los thumbnails desde `frontend/public/thumbnails/`.

El seed referencia los 25 archivos por nombre (ej. `abecedario_braille.glb`). Si un archivo no existe, el visor simplemente no carga ese modelo — la app no se rompe.

---

## Solución de problemas comunes

**`P1001: Can't reach database server`**
El proyecto de Supabase puede estar pausado (free tier). Ir al [dashboard de Supabase](https://supabase.com/dashboard) y hacer clic en "Restore project".

**`prisma db push` se cuelga sin respuesta**
Ocurre cuando se usa `prisma migrate dev` con el pooler de Supabase. Usar siempre `prisma db push` para este proyecto.

**El visor 3D no renderiza**
Verificar que el archivo `.glb` exista en `public/modelos/` con el nombre exacto que tiene el campo `archivoGlb` en la DB. Confirmar en Prisma Studio.

**Cambios en `schema.prisma` no se reflejan**
Correr `npx prisma db push` y luego `npx prisma generate`.
