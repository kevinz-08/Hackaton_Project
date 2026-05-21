# Frontend MVP — Plan de Trabajo Detallado
**Stack: Next.js 14 (App Router) + Tailwind CSS + @google/model-viewer**
**Basado en: plan.md | Hackathon 21-22 Mayo 2026**

---

## Arquitectura Frontend

```
frontend/
├── app/
│   ├── layout.tsx              ← Layout global (Navbar, fonts, metadata)
│   ├── page.tsx                ← Catálogo 3D público (React Server Component)
│   ├── solicitud/
│   │   └── page.tsx            ← Formulario de registro (Client Component)
│   └── admin/
│       └── page.tsx            ← Dashboard administrativo (Client Component)
├── components/
│   ├── ModelCard.tsx           ← Tarjeta individual del catálogo
│   ├── ModelViewer.tsx         ← Wrapper dynamic() de <model-viewer>
│   ├── ModelViewerInner.tsx    ← Componente interno con <model-viewer>
│   ├── SolicitudForm.tsx       ← Formulario con validación
│   ├── AdminTable.tsx          ← Tabla de solicitudes con filtros
│   ├── EstadoBadge.tsx         ← Badge de color por estado
│   ├── Navbar.tsx              ← Barra de navegación
│   └── LoadingSkeleton.tsx     ← Skeleton mientras carga API
├── lib/
│   └── api.ts                  ← Funciones fetch tipadas
├── types/
│   └── index.ts                ← Interfaces compartidas
└── envConfig.ts                ← NEXT_PUBLIC_API_URL
```

---

## Flujo de Trabajo por Bloques

### BLOQUE 1 — Setup del Proyecto (Día 1, 0:00–1:30h)
**Orden de ejecución:**

| Paso | Acción | Comando |
|------|--------|---------|
| 1 | Crear proyecto Next.js | `npx create-next-app@latest frontend --typescript --tailwind --app` |
| 2 | Instalar model-viewer | `npm install @google/model-viewer` |
| 3 | Configurar `.env.local` | `NEXT_PUBLIC_API_URL=http://localhost:4000` |
| 4 | Verificar servidor | `npm run dev` → localhost:3000 |

**Archivos a crear (vacíos o boilerplate):**
- [ ] `app/layout.tsx` — metadata, fonts, Navbar
- [ ] `app/page.tsx` — placeholder "Catálogo"
- [ ] `types/index.ts` — interfaces
- [ ] `lib/api.ts` — fetch functions
- [ ] `components/ModelViewer.tsx` — dynamic wrapper

**Criterio de éxito:** localhost:3000 responde con layout básico y Navbar visible.

---

### BLOQUE 2 — Tipos Compartidos + API Layer (Día 1, 1:30–2:00h)
**Archivo:** `types/index.ts`

```typescript
export interface Modelo {
  id: string
  nombre: string
  categoria: 'DIDACTICO' | 'ACCESIBILIDAD'
  descripcion: string
  archivoGlb: string
  imagen: string
}

export interface Solicitud {
  id: string
  nombre: string
  cedula: string
  ciudad: string
  correo: string
  telefono: string
  tipoMaterial: 'DIDACTICO' | 'ACCESIBILIDAD'
  modeloId: string
  estado: Estado
  fechaRegistro: string
  modelo: Modelo
}

export type Estado =
  | 'NO_RESPONDE'
  | 'NO_CONTESTO'
  | 'CONFIRMO'
  | 'LLAMAR_DESPUES'
  | 'INTERESADO'
  | 'NO_INTERESADO'

export interface CreateSolicitudPayload {
  nombre: string
  cedula: string
  ciudad: string
  correo: string
  telefono: string
  tipoMaterial: 'DIDACTICO' | 'ACCESIBILIDAD'
  modeloId: string
}
```

**Archivo:** `lib/api.ts`

```typescript
const API = process.env.NEXT_PUBLIC_API_URL!

export async function getModelos(categoria?: string): Promise<Modelo[]> {
  const params = categoria ? `?categoria=${categoria}` : ''
  const res = await fetch(`${API}/modelos${params}`)
  if (!res.ok) throw new Error('Error al cargar modelos')
  return res.json()
}

export async function getSolicitudes(params?: {
  ciudad?: string
  estado?: string
}): Promise<Solicitud[]> {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params ?? {}).filter(([_, v]) => v))
  ).toString()
  const res = await fetch(`${API}/solicitudes${query ? `?${query}` : ''}`)
  if (!res.ok) throw new Error('Error al cargar solicitudes')
  return res.json()
}

export async function createSolicitud(
  data: CreateSolicitudPayload
): Promise<Solicitud> {
  const res = await fetch(`${API}/solicitudes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (res.status === 409) throw new Error('CEDULA_DUPLICADA')
  if (!res.ok) throw new Error('Error al crear solicitud')
  return res.json()
}

export async function updateEstado(
  id: string,
  estado: Estado
): Promise<Solicitud> {
  const res = await fetch(`${API}/solicitudes/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado }),
  })
  if (!res.ok) throw new Error('Error al actualizar estado')
  return res.json()
}
```

**Criterio de éxito:** Tipos importables sin errores; `lib/api.ts` sin errores de compilación.

---

### BLOQUE 3 — Catálogo 3D (Día 1, 2:00–5:00h)
**Prioridad: ALTA — es la página principal del MVP.**

#### 3.1 ModelViewer — Wrapper (15 min)
```typescript
// components/ModelViewer.tsx
'use client'
import dynamic from 'next/dynamic'

const ModelViewerInner = dynamic(
  () => import('./ModelViewerInner'),
  { ssr: false }
)

export default function ModelViewer({ src }: { src: string }) {
  return <ModelViewerInner src={src} />
}
```

```typescript
// components/ModelViewerInner.tsx
'use client'
import '@google/model-viewer'

export default function ModelViewerInner({ src }: { src: string }) {
  return (
    <model-viewer
      src={src}
      alt="Modelo 3D"
      auto-rotate
      camera-controls
      style={{ width: '100%', height: '400px' }}
    />
  )
}
```

#### 3.2 ModelCard (30 min)
- Props: `modelo: Modelo`, `onSolicitar: (id: string) => void`
- Muestra: imagen, nombre, categoría badge, botón "Ver en 3D", botón "Solicitar"

#### 3.3 Catálogo page.tsx — Server Component (1h)
- Fetch `GET /modelos` directo en el Server Component (sin `useEffect`)
- Pasar datos a `ModelCard[]`
- Filtro por categoría con tabs/cliente interactivo
- Modal con `<ModelViewer>` al hacer clic en "Ver en 3D"

**Flujo del catálogo:**
```
Render inicial (SSR)
  → Grid de tarjetas con datos del servidor
  → Usuario hace clic "Ver en 3D"
    → Modal overlay con <ModelViewer>
    → Usuario rota/zoom el modelo
  → Usuario hace clic "Solicitar"
    → Router.push(`/solicitud?modeloId=${id}`)
```

**Criterio de éxito:** Catálogo carga modelos desde API, visor 3D funcional en modal, navegación a formulario.

---

### BLOQUE 4 — Formulario de Registro (Día 1, 5:00–7:30h)
**Prioridad: ALTA — es el core del MVP (captura de leads).**

#### 4.1 Crear `SolicitudForm.tsx`
- Leer `modeloId` de `useSearchParams()`
- Fetch modelo por ID para mostrar preview arriba del form
- Campos del formulario:

| Campo | Tipo | Validación |
|-------|------|------------|
| nombre | text | required, min 3 chars |
| cedula | text | required, solo dígitos, length 7-10 |
| ciudad | select | required, opciones fijas |
| correo | email | required, formato email |
| telefono | text | required, 10 dígitos |
| tipoMaterial | select | required, DIDACTICO/ACCESIBILIDAD |

- Botón "Enviar" con estado loading
- POST a `createSolicitud()`
- Manejar error `CEDULA_DUPLICADA` → mostrar mensaje en campo cédula
- Pantalla de éxito con resumen + botón "Volver al catálogo"

#### 4.2 Manejo de estados del formulario
```
INITIAL → usuario escribe → SUBMITTING → SUCCESS | ERROR
                  ↑                            |        |
                  └────────────────────────────┘        |
                  ← "Volver a intentar" ←──────────────┘
```

**Criterio de éxito:** Formulario envía datos a la API, muestra error de cédula duplicada, muestra pantalla de éxito.

---

### BLOQUE 5 — Dashboard Administrativo (Día 2, 0:00–3:00h)
**Prioridad: ALTA — demuestra el valor de centralización.**

#### 5.1 Admin page (`/admin/page.tsx`)
- Client Component con useEffect para fetch inicial
- Estado: `solicitudes[]`, `filtroCiudad`, `filtroEstado`, `loading`, `error`

#### 5.2 AdminTable.tsx
- Columnas: Nombre, Cédula, Ciudad, Correo, Teléfono, Material, Estado, Fecha
- Cada fila tiene:
  - Badge de color (EstadoBadge.tsx)
  - `<select>` con los 6 estados para cambiar en vivo

#### 5.3 Filtros
- Dropdown de Ciudad: extraer valores únicos de `solicitudes`
- Dropdown de Estado: los 6 valores del enum + "Todas"
- Al cambiar filtro → re-fetch con query params `?ciudad=X&estado=Y`

#### 5.4 Contador resumen
```
Total: 45  |  Confirmó: 12  |  Interesado: 18  |  No interesado: 5  |  Pendientes: 10
```
- Calcular con `useMemo` del array filtrado

#### 5.5 EstadoBadge.tsx
| Estado | Clase Tailwind |
|--------|---------------|
| CONFIRMO | `bg-green-100 text-green-800` |
| INTERESADO | `bg-blue-100 text-blue-800` |
| LLAMAR_DESPUES | `bg-yellow-100 text-yellow-800` |
| NO_RESPONDE | `bg-orange-100 text-orange-800` |
| NO_CONTESTO | `bg-orange-100 text-orange-800` |
| NO_INTERESADO | `bg-red-100 text-red-800` |

**Criterio de éxito:** Tabla carga solicitudes reales, filtros funcionan, contador actualiza.

---

### BLOQUE 6 — Gestión de Estados en Vivo (Día 2, 3:00–4:30h)
**Prioridad: MEDIA — necesaria para el demo.**

- Select de estado en cada fila
- Al cambiar: `updateEstado(id, nuevoEstado)` → PATCH
- Feedback visual:
  - Deshabilitar select durante la llamada
  - Spinner o texto "Actualizando..."
  - Badge cambia de color al confirmar respuesta
- Error handling: mostrar toast/alert si falla

**Criterio de éxito:** Admin cambia estados, se persisten en DB, badge actualiza visualmente.

---

### BLOQUE 7 — UI Polish + Responsive (Día 2, 4:30–5:30h)
**Prioridad: MEDIA.**

| Componente | Desktop | Mobile |
|-----------|---------|--------|
| Catálogo | Grid 3 columnas | Grid 1 columna |
| Modal 3D | Ancho 800px | Ancho 95vw |
| Dashboard | Tabla completa | Scroll horizontal |
| Formulario | 2 columnas fields | 1 columna |

**Loading states:**
- Catálogo: Skeleton grid (6 cards grises con pulse)
- Dashboard: Skeleton table (5 filas grises)
- Formulario: Botón con spinner, inputs deshabilitados

**Empty states:**
- Catálogo: "No hay modelos disponibles" si array vacío
- Dashboard: "No hay solicitudes con estos filtros" + botón "Limpiar filtros"

**Navbar:**
- Logo ANDES (texto)
- Links: Catálogo | Solicitar | Admin
- Highlight de página activa

**Criterio de éxito:** Navegación consistente, responsive en mobile, loading/empty states cubiertos.

---

### BLOQUE 8 — Pruebas + Deploy (Día 2, 5:30–8:00h)
**Prioridad: ALTA para el demo.**

#### Pruebas de integración:

| Prueba | Pasos | Resultado esperado |
|--------|-------|-------------------|
| Flujo completo | Catálogo → Ver 3D → Solicitar → Llenar form → Enviar | Solicitud en DB |
| Validación | Enviar form vacío | Errores en campos |
| Cédula duplicada | Enviar misma cédula dos veces | Error 409 mostrado |
| Cambio de estado | Admin → cambiar estado de fila | Badge cambia, DB actualizada |
| Visor mobile | Abrir modal en Chrome DevTools mobile | Modelo rota sin errores |
| Consola | Revisar F12 | 0 errores críticos |

#### Deploy a Vercel:
1. `git push` a rama principal
2. Conectar repo en vercel.com
3. Variable de entorno: `NEXT_PUBLIC_API_URL` = URL del backend en Railway
4. Verificar build exitoso

**Criterio de éxito:** URL pública funcionando, flujo completo demo-ready.

---

## Dependencias entre Componentes

```
app/layout.tsx
  └── Navbar.tsx (siempre visible)

app/page.tsx (Catálogo - RSC)
  └── ModelCard.tsx (por cada modelo)
       └── ModelViewer.tsx (en modal - dynamic)
            └── ModelViewerInner.tsx (model-viewer web component)

app/solicitud/page.tsx (Client Component)
  └── ModelViewer.tsx (preview del modelo seleccionado)
  └── SolicitudForm.tsx

app/admin/page.tsx (Client Component)
  └── AdminTable.tsx
       └── EstadoBadge.tsx (por cada fila)
```

---

## Checklist Resumen

### Día 1 — Frontend

- [ ] **B1:** `create-next-app`, instalar model-viewer, `.env.local`
- [ ] **B2:** `types/index.ts`, `lib/api.ts` — sin errores de TS
- [ ] **B3.1:** `ModelViewer.tsx` + `ModelViewerInner.tsx` — dynamic import
- [ ] **B3.2:** `ModelCard.tsx` — imagen, nombre, badge, botones
- [ ] **B3.3:** `app/page.tsx` — grid, fetch server-side, filtro tabs, modal 3D
- [ ] **B4.1:** `SolicitudForm.tsx` — todos los campos con validación
- [ ] **B4.2:** POST solicitud, manejo 409, pantalla de éxito
- [ ] **B4.3:** `app/solicitud/page.tsx` — leer modeloId de query params

### Día 2 — Frontend

- [ ] **B5.1:** `app/admin/page.tsx` — fetch solicitudes
- [ ] **B5.2:** `AdminTable.tsx` — tabla con columnas
- [ ] **B5.3:** Filtros de ciudad y estado
- [ ] **B5.4:** Contador resumen
- [ ] **B5.5:** `EstadoBadge.tsx` — colores por estado
- [ ] **B6:** Select de estado en filas + PATCH
- [ ] **B7.1:** Navbar consistente
- [ ] **B7.2:** Responsive (mobile 1 col, scroll table)
- [ ] **B7.3:** Loading skeletons + empty states
- [ ] **B8.1:** Pruebas de integración
- [ ] **B8.2:** Deploy a Vercel

---

## Notas Técnicas Importantes

1. **model-viewer y SSR:** Siempre usar `dynamic(() => import(...), { ssr: false })`. No importar directamente.
2. **Server Components vs Client Components:** El catálogo (`page.tsx`) debe ser Server Component. Solo los hijos interactivos (modal, form, dashboard) llevan `'use client'`.
3. **Fetch en Server Component:** El fetch del catálogo se hace directo en el componente. No necesita `useEffect` ni estado.
4. **CORS:** Asegurar que `NEXT_PUBLIC_API_URL` apunte al backend correcto. El backend debe tener `app.enableCors()`.
5. **Ruta del formulario:** `solicitud/page.tsx` usa `useSearchParams()` → debe estar envuelto en `<Suspense>` o Next.js 14 lo maneja automático.
