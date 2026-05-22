# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ANDES Catálogo 3D — a hackathon MVP for managing 3D-printed educational and accessibility materials. Built for ANDES organization to replace manual request tracking with a web app.

**Stack:** Next.js 14 (App Router) · Prisma 5 · PostgreSQL (Supabase) · Tailwind CSS · `@google/model-viewer` · Vercel

All application code lives in the `frontend/` subdirectory.

## Commands

All commands must be run from `frontend/`:

```bash
cd frontend

npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run seed         # Seed DB with 25 modelos + 25 solicitudes (uses tsx)
npx prisma migrate dev --name <name>  # Create and apply a migration
npx prisma studio    # Open Prisma Studio GUI
npx prisma generate  # Regenerate Prisma client after schema changes
```

## Architecture

The codebase follows a layered DDD-style architecture inside `frontend/src/`:

```
domain/          → Entities and repository interfaces (pure TypeScript, no deps)
application/     → Use cases that orchestrate domain logic
infrastructure/  → Concrete repository implementations + HTTP client
presentation/    → React hooks and components
app/             → Next.js App Router pages and API routes
lib/             → Shared utilities (prisma singleton, error handling)
services/        → Server-side DB service functions called from API routes
```

### Data flow

**Server side (API routes):** `app/api/*/route.ts` → `services/*.service.ts` → `lib/prisma.ts` (singleton PrismaClient)

**Client side:** `presentation/hooks/` → `infrastructure/repositories/api-*.repository.ts` → `infrastructure/http/api-client.ts` → API routes

The `api-client.ts` base URL defaults to `/api` but can be overridden with `NEXT_PUBLIC_API_URL`.

### Key API routes

| Method | Route | Purpose |
|--------|-------|---------|
| GET | `/api/modelos` | List all models; `?categoria=` filter |
| GET | `/api/modelos/[id]` | Get single model |
| GET | `/api/solicitudes` | List requests; `?ciudad=` and `?estado=` filters |
| POST | `/api/solicitudes` | Create new request |
| PATCH | `/api/solicitudes/[id]` | Update request estado |

### Domain model

Two Prisma models: `Modelo` (25 products, RD-001–RD-025) and `Solicitud` (requests, SOL-001–SOL-025 in seed).

`Estado` enum has two phases:
- **CRM phase:** `INTERESADO`, `NO_INTERESADO`, `CONFIRMO`, `LLAMAR_DESPUES`, `NO_RESPONDE`, `NO_CONTESTO`
- **Production phase:** `RECIBIDA`, `EN_PRODUCCION`, `REVISION_CALIDAD`, `EMPAQUE_TRANSPORTE`, `ENTREGADA`

`Categoria` enum: `ACCESIBILIDAD_VISUAL`, `ACCESIBILIDAD_MOTRIZ`, `MATERIAL_DIDACTICO`, `COMUNICACION_AUMENTATIVA`, `FIGURAS_DIDACTICAS`, `ACCESORIOS_ACCESIBILIDAD`

### 3D model viewer

`ModelViewer.tsx` wraps `ModelViewerInner.tsx` using `next/dynamic` with `ssr: false` because `@google/model-viewer` registers a Web Component that requires the browser. The inner component renders the `<model-viewer>` element with `auto-rotate` and `camera-controls`. GLB files are served from `public/modelos/` and thumbnails from `public/thumbnails/`.

## Environment

Copy `.env.example` to `.env.local` and set:

```
DATABASE_URL=<Supabase pooling URL with ?pgbouncer=true&connection_limit=1>
DIRECT_URL=<Supabase direct URL without pooling — required for migrations>
NEXT_PUBLIC_API_URL=   # Leave empty to use relative /api paths
```

For Vercel deploy, add `"postinstall": "prisma generate"` to `package.json` scripts if Prisma client isn't generated during build.

## UI conventions

- Brand color: `#6C3FCF` (purple) — use for primary buttons and accents
- `EstadoBadge` component in `presentation/components/` centralizes estado color mapping — always use it instead of inline badge colors
- Responsive breakpoints: `sm:grid-cols-2 lg:grid-cols-3` for catalog grid, `overflow-x-auto` on admin table
- Skeleton loading uses `animate-pulse bg-gray-200 rounded-2xl`
