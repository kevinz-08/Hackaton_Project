import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Estado } from '@prisma/client';
import { updateEstado } from '@/services/solicitudes.service';
import { handleApiError } from '@/lib/api-error';

const UpdateEstadoSchema = z.object({
  estado: z.nativeEnum(Estado),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const body = await request.json();
    const { estado } = UpdateEstadoSchema.parse(body);
    const solicitud = await updateEstado(params.id, estado);
    return NextResponse.json(solicitud);
  } catch (error) {
    return handleApiError(error);
  }
}
