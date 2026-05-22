import { NextRequest, NextResponse } from 'next/server';
import {
  crearModeloGenerado,
  actualizarModeloGenerado,
  getModelosGenerados,
} from '@/services/modelo-generado.service';

// GET — listar todos los modelos generados
export async function GET() {
  try {
    const modelos = await getModelosGenerados();
    return NextResponse.json(modelos);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// POST — crear registro inicial cuando se lanza la tarea a Hitem3D
export async function POST(req: NextRequest) {
  try {
    const { taskId, imagenUrl, nombre } = await req.json();
    if (!taskId || !imagenUrl) {
      return NextResponse.json(
        { error: 'taskId e imagenUrl son requeridos' },
        { status: 400 },
      );
    }
    const modelo = await crearModeloGenerado({ taskId, imagenUrl, nombre });
    return NextResponse.json(modelo, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// PATCH — actualizar glbUrl y estado cuando Hitem3D termina
export async function PATCH(req: NextRequest) {
  try {
    const { taskId, glbUrl, estado } = await req.json();
    if (!taskId) {
      return NextResponse.json({ error: 'taskId es requerido' }, { status: 400 });
    }
    const modelo = await actualizarModeloGenerado(taskId, { glbUrl, estado });
    return NextResponse.json(modelo);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Error interno';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
