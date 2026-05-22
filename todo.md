# ANDES Catálogo 3D — MVP Backlog
**Stack:** Next.js 14 (App Router + API Routes) · Prisma 5 · PostgreSQL (Supabase) · Tailwind CSS · `@google/model-viewer` · Vercel
**Hackathon:** 21–22 Mayo 2026 · 16 horas · Equipo de 4

> **Fuente de datos:** `insumos.xlsx` — 25 productos reales, 25 solicitudes reales, 16 materiales de inventario, 35 evaluaciones de satisfacción.

---

## Estado actual del proyecto

| Capa | Estado |
|---|---|
| Schema Prisma + DB Supabase | ✅ Listo |
| Seed (25 modelos + 25 solicitudes) | ✅ Listo (pendiente ejecutar `npm run seed`) |
| API Routes (modelos + solicitudes) | ✅ Listo |
| Páginas (/, /solicitud, /admin) | ✅ Listo |
| Componentes (Card, Visor, Form, Table, Badge) | ✅ Listo |
| Hooks + Clean Architecture | ✅ Listo |
| Archivos GLB en `/public/modelos/` | ❌ BLOQUEADOR |
| Thumbnails en `/public/thumbnails/` | ❌ BLOQUEADOR |
| QA end-to-end | ⏳ Pendiente |
| Deploy Vercel | ⏳ Pendiente |

---

## Criterios de MVP (Definition of Done global)

- [ ] Seed ejecutado — 25 modelos y 25 solicitudes en Supabase
- [ ] Al menos 6 archivos `.glb` en `/public/modelos/` (visor 3D funcional)
- [ ] Thumbnails en `/public/thumbnails/` para las cards del catálogo
- [ ] Flujo completo funciona en localhost: catálogo → formulario → dashboard
- [ ] Deploy público en Vercel con URL funcional
- [ ] Demo fluye en menos de 5 minutos sin errores visibles

---

## BLOQUEADOR CRÍTICO — Archivos 3D y Thumbnails

> Sin estos archivos el visor 3D no muestra nada y las cards del catálogo quedan rotas.
> Esta es la tarea más urgente antes de continuar con QA.

- [ ] [Assets] Conseguir archivos GLB y thumbnails

  **Descripción:** Descargar modelos 3D en formato `.glb` y sus imágenes thumbnail. No es necesario tener los 25 — con 6 representativos (uno por categoría) la demo queda impactante.

  **Dónde conseguirlos gratis:**
  - [Sketchfab](https://sketchfab.com) → buscar "braille", "heart anatomy", "solar system", "skeleton" → descargar en formato GLB
  - [Google Poly Archive](https://poly.pizza) → modelos simples listos en GLB
  - [Thingiverse](https://thingiverse.com) → convertir STL a GLB con [convert.io](https://convert.io) o Blender

  **Nombres de archivo exactos que espera el seed (mínimo recomendado — 1 por categoría):**

  | Archivo GLB | Categoría | Prioridad demo |
  |---|---|---|
  | `abecedario_braille.glb` | ACCESIBILIDAD_VISUAL | Alta |
  | `agarre_lapiz_adaptado.glb` | ACCESIBILIDAD_MOTRIZ | Alta |
  | `fracciones_montessori.glb` | MATERIAL_DIDACTICO | Alta |
  | `tablero_aac.glb` | COMUNICACION_AUMENTATIVA | Media |
  | `corazon_anatomico.glb` | FIGURAS_DIDACTICAS | Alta |
  | `portavasos_silla_ruedas.glb` | ACCESORIOS_ACCESIBILIDAD | Media |

  **Ruta de destino:** `frontend/public/modelos/<nombre>.glb`
  **Ruta thumbnails:** `frontend/public/thumbnails/RD-001.jpg` … `RD-025.jpg`

  **Fallback rápido si no hay tiempo:** Usar cualquier `.glb` de ejemplo para todos los modelos (el visor funciona igual, solo el modelo visual cambia). Un cubo o esfera genérica es mejor que un visor roto.

  **Criterios de aceptación:**
  - `<model-viewer>` muestra al menos 1 modelo rotando sin errores en consola
  - Las cards del catálogo muestran imagen (no broken image icon)

---

## SPRINT 1 — Fundación ✅ COMPLETADO

- [x] [DB] Setup Next.js + Prisma + Supabase — `frontend/prisma/schema.prisma` con 2 modelos, 3 enums
- [x] [DB] `.env` configurado con `DATABASE_URL` (pooling) y `DIRECT_URL` (directo)
- [x] [DB] `npx prisma db push` ejecutado — tablas creadas en Supabase
- [x] [DB] `frontend/prisma/seed.ts` creado con 25 modelos y 25 solicitudes reales
- [x] [Backend] `GET /api/modelos` con filtro por categoría
- [x] [Backend] `GET /api/modelos/[id]`
- [x] [Backend] `POST /api/solicitudes` con validación
- [x] [Backend] `GET /api/solicitudes` con filtros ciudad y estado
- [x] [Backend] `PATCH /api/solicitudes/[id]` para cambio de estado
- [x] [Backend] `lib/prisma.ts` singleton
- [x] [Backend] `services/modelos.service.ts` y `services/solicitudes.service.ts`

**Pendiente del Sprint 1:**
- [ ] Ejecutar seed: `cd frontend && npm run seed`

---

## SPRINT 2 — Features Core ✅ COMPLETADO

- [x] [Frontend] `presentation/components/ModelCard.tsx`
- [x] [Frontend] `presentation/components/ModelViewer.tsx` + `ModelViewerInner.tsx` (dynamic import, ssr: false)
- [x] [Frontend] `presentation/components/EstadoBadge.tsx` con colores por estado
- [x] [Frontend] `presentation/components/SolicitudForm.tsx`
- [x] [Frontend] `presentation/components/AdminTable.tsx`
- [x] [Frontend] `presentation/components/Navbar.tsx`
- [x] [Frontend] `src/app/page.tsx` — catálogo con grid y filtros
- [x] [Frontend] `src/app/solicitud/page.tsx` — formulario de registro
- [x] [Frontend] `src/app/solicitud/exito/page.tsx` — pantalla de éxito
- [x] [Frontend] `src/app/admin/page.tsx` — dashboard administrativo
- [x] [Frontend] `presentation/hooks/use-modelos.ts`
- [x] [Frontend] `presentation/hooks/use-solicitudes.ts`
- [x] [Frontend] Clean Architecture: domain entities, repository interfaces, use cases, infraestructura HTTP

---

## SPRINT 3 — Polish, QA y Deploy ⏳ EN CURSO

### QA

- [ ] [QA] Ejecutar seed y verificar datos en Prisma Studio

  **Comando:**
  ```bash
  cd frontend
  npm run seed
  npx prisma studio
  ```
  **Verificar:** 25 filas en Modelo, 25 filas en Solicitud, distribución correcta de estados.

---

- [ ] [QA] Prueba de integración end-to-end en localhost

  **Descripción:** Flujo completo antes de hacer deploy.

  **Script de prueba manual:**
  1. `npm run dev` → abrir `localhost:3000`
  2. Verificar que el catálogo carga modelos desde `/api/modelos`
  3. Hacer clic en "Ver en 3D" → modal abre y modelo rota
  4. Hacer clic en "Solicitar" → navega a `/solicitud?modeloId=xxx`
  5. Llenar formulario con datos válidos → submit → pantalla de éxito
  6. Abrir `localhost:3000/admin` → nueva solicitud aparece con estado INTERESADO
  7. Cambiar estado a "Confirmó" → badge cambia de color inmediatamente

  **Validaciones a probar:**
  - Formulario con campos vacíos → NO debe hacer POST, debe mostrar errores
  - Misma cédula dos veces → debe mostrar "Cédula ya registrada"
  - Filtros del dashboard por ciudad y estado → tabla se actualiza

  **Criterios de aceptación:**
  - Cero errores en consola del navegador durante el flujo
  - Cambio de estado persiste en Supabase (verificar en Prisma Studio)

---

- [ ] [Frontend] Verificar responsive y UI polish

  **Checklist:**
  - [ ] Catálogo: grid de 1 columna en mobile (375px), 3 en desktop
  - [ ] Cards: hover eleva con sombra, badge de categoría visible
  - [ ] Dashboard: tabla con `overflow-x-auto` en mobile
  - [ ] KPIs del dashboard: muestran números reales calculados desde los datos
  - [ ] EstadoBadge: todos los 11 estados tienen color asignado
  - [ ] Ningún texto desbordado o cortado en viewport 375px

---

### Deploy

- [ ] [Infra] Deploy en Vercel

  **Pasos:**
  1. Push del repo a GitHub (asegurarse que `frontend/.env` está en `.gitignore`)
  2. Ir a vercel.com → New Project → importar repo → **Root Directory: `frontend`**
  3. Agregar variables de entorno en Vercel:
     - `DATABASE_URL` → pooling URL de Supabase
     - `DIRECT_URL` → URL directa de Supabase
  4. Agregar en `frontend/package.json` scripts:
     ```json
     "postinstall": "prisma generate"
     ```
  5. Deploy → verificar URL pública
  6. Ejecutar seed apuntando a producción si la DB de prod está vacía

  **Criterios de aceptación:**
  - URL pública abre el catálogo sin error 500
  - API routes responden en producción
  - Formulario guarda en la DB de Supabase

---

- [ ] [QA] Checklist pre-demo (30 min antes)

  **FUNCIONAL:**
  - [ ] URL de Vercel carga catálogo con modelos
  - [ ] Al menos 2 modelos GLB rotan en el visor
  - [ ] Formulario guarda nueva solicitud en DB
  - [ ] Dashboard muestra las 25 solicitudes del seed
  - [ ] Cambio de estado funciona en producción

  **VISUAL:**
  - [ ] Badges de estado con colores correctos
  - [ ] KPIs muestran números coherentes
  - [ ] Sin texto desbordado en desktop

  **GUIÓN DE DEMO (5 min):**
  1. [30s] "ANDES gestiona solicitudes de material 3D manualmente. Esto lo reemplazamos en 16 horas."
  2. [60s] Abrir catálogo → rotar modelo en 3D → "El beneficiario ve el producto antes de pedirlo."
  3. [60s] Clic en Solicitar → llenar formulario en vivo → submit → pantalla de éxito
  4. [90s] Abrir dashboard → mostrar solicitud recién creada → cambiar estado a Confirmó → badge verde
  5. [30s] "Stack: Next.js + Prisma + Supabase. 25 productos reales, 14 instituciones, satisfacción 4.7/5."

---

## Datos reales del Excel — Resumen para la demo

| Dato | Valor |
|---|---|
| Productos en catálogo | 25 |
| Categorías | 6 |
| Solicitudes activas | 25 (13 Recibidas, 5 En Producción, 3 Entregadas) |
| Instituciones atendidas | 14 |
| Satisfacción general | 4.7 / 5 |
| Satisfacción utilidad pedagógica | 4.9 / 5 |
| Materiales con stock bajo | 3 (PLA Verde, TPU Blanco, PLA+ Naranja) |

## Estados — Referencia rápida

### Fase CRM (requerido por la ficha técnica)
| Enum en DB | Label en UI | Color Badge |
|---|---|---|
| `INTERESADO` | Interesado | Azul |
| `CONFIRMO` | Confirmó | Verde |
| `LLAMAR_DESPUES` | Llamar después | Amarillo |
| `NO_RESPONDE` | No responde | Naranja |
| `NO_CONTESTO` | No contestó | Gris |
| `NO_INTERESADO` | No interesado | Rojo |

### Fase Producción (datos reales del Excel)
| Enum en DB | Label en UI | Color Badge |
|---|---|---|
| `RECIBIDA` | Recibida | Índigo |
| `EN_PRODUCCION` | En Producción | Cian |
| `REVISION_CALIDAD` | Revisión de Calidad | Violeta |
| `EMPAQUE_TRANSPORTE` | Empaque y Transporte | Ámbar |
| `ENTREGADA` | Entregada | Esmeralda |
