import { NextRequest, NextResponse } from 'next/server';
import { subirImagenS3, subirGlbS3 } from '@/services/s3.service';

const AK   = process.env.HITEM3D_AK;
const SK   = process.env.HITEM3D_SK;
const BASE = 'https://api.hitem3d.ai';

// ─── Token ────────────────────────────────────────────────────────────────────
async function getToken(): Promise<string> {
  const basic = Buffer.from(`${AK}:${SK}`).toString('base64');
  const res = await fetch(`${BASE}/open-api/v1/auth/token`, {
    method: 'POST',
    headers: { Authorization: `Basic ${basic}`, 'Content-Type': 'application/json' },
    cache: 'no-store',
  });
  const data = await res.json();
  if (data.code !== 200 || !data.data?.accessToken) throw new Error(data.msg ?? 'Auth failed');
  return data.data.accessToken;
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action');
    const token  = await getToken();

    // ── submit: recibe imagen, la sube a S3, luego envía a Hitem3D ────────────
    if (action === 'submit') {
      const formData  = await req.formData();
      const imageFile = formData.get('images') as File | null;

      if (!imageFile) {
        return NextResponse.json({ error: 'imagen requerida' }, { status: 400 });
      }

      // 1. Subir imagen original a S3
      const imgBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imgS3Url  = await subirImagenS3(imgBuffer, imageFile.name, imageFile.type);

      // 2. Enviar a Hitem3D
      const upstreamFd = new FormData();
      upstreamFd.append('images', new Blob([imgBuffer], { type: imageFile.type }), imageFile.name);
      upstreamFd.append('request_type', (formData.get('request_type') as string) ?? '3');
      upstreamFd.append('model',        (formData.get('model')        as string) ?? 'hitem3dv2.0');
      upstreamFd.append('resolution',   (formData.get('resolution')   as string) ?? '1536');
      upstreamFd.append('format',       '2');

      const upstream = await fetch(`${BASE}/open-api/v1/submit-task`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: upstreamFd,
      });
      const data = await upstream.json();

      // 3. Devolver task_id + URL permanente de imagen en S3
      return NextResponse.json({ ...data, imgS3Url });
    }

    // ── query: si listo → descarga .glb y lo sube a S3 ───────────────────────
    if (action === 'query') {
      const taskId = searchParams.get('task_id');
      if (!taskId) return NextResponse.json({ error: 'task_id requerido' }, { status: 400 });

      const upstream = await fetch(
        `${BASE}/open-api/v1/query-task?task_id=${taskId}`,
        { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' },
      );
      const data = await upstream.json();

      if (data.code === 200 && data.data?.state === 'success' && data.data?.url) {
        const glbS3Url = await subirGlbS3(data.data.url, taskId);
        return NextResponse.json({
          ...data,
          data: { ...data.data, url: glbS3Url, glbS3Url },
        });
      }

      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Acción no reconocida' }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
