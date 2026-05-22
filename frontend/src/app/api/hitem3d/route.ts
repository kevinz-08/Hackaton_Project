import { NextRequest, NextResponse } from 'next/server';

const AK   = process.env.HITEM3D_AK ?? 'ak_8f0097c901f54f69bfd935e38f6890eb';
const SK   = process.env.HITEM3D_SK ?? 'sk_3b5bf99170454c5989ccb338356c4d99';
const BASE = 'https://api.hitem3d.ai';

// ─── Obtener token Bearer ────────────────────────────────────────────────────
async function getToken(): Promise<string> {
  const basic = Buffer.from(`${AK}:${SK}`).toString('base64');
  const res = await fetch(`${BASE}/open-api/v1/auth/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });
  const data = await res.json();
  if (data.code !== 200 || !data.data?.accessToken) {
    throw new Error(data.msg ?? 'Auth failed');
  }
  return data.data.accessToken;
}

// ─── POST /api/hitem3d ───────────────────────────────────────────────────────
// Body: multipart/form-data con los campos que viene del cliente
// action: "submit"  → envía imagen y devuelve task_id
// action: "query"   → consulta estado de una tarea (task_id en query param)
export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');

    const token = await getToken();

    // ── Enviar tarea ──────────────────────────────────────────
    if (action === 'submit') {
      const formData = await req.formData();

      const upstream = await fetch(`${BASE}/open-api/v1/submit-task`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await upstream.json();
      return NextResponse.json(data);
    }

    // ── Consultar tarea ───────────────────────────────────────
    if (action === 'query') {
      const taskId = searchParams.get('task_id');
      if (!taskId) return NextResponse.json({ error: 'task_id requerido' }, { status: 400 });

      const upstream = await fetch(
        `${BASE}/open-api/v1/query-task?task_id=${taskId}`,
        { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
      );
      const data = await upstream.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
