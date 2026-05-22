import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Categoria, Estado } from '@prisma/client';
import { createSolicitud, getSolicitudes } from '@/services/solicitudes.service';
import { handleApiError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

const CreateSolicitudSchema = z.object({
  nombre: z.string().min(1, 'Nombre requerido'),
  cedula: z.string().regex(/^\d{6,10}$/, 'Cédula debe tener entre 6 y 10 dígitos'),
  ciudad: z.string().min(1, 'Ciudad requerida'),
  correo: z.string().email('Correo inválido'),
  telefono: z.string().regex(/^\d{10}$/, 'Teléfono debe tener 10 dígitos'),
  tipoMaterial: z.nativeEnum(Categoria),
  modeloId: z.string().min(1, 'modeloId requerido'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreateSolicitudSchema.parse(body);
    const solicitud = await createSolicitud(data);
    return NextResponse.json(solicitud, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const ciudad = request.nextUrl.searchParams.get('ciudad') ?? undefined;
    const estado = request.nextUrl.searchParams.get('estado') as Estado | null;
    const solicitudes = await getSolicitudes(ciudad, estado ?? undefined);
    return NextResponse.json(solicitudes);
  } catch (error) {
    return handleApiError(error);
  }
}
