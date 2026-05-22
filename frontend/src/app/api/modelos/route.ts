import { NextRequest, NextResponse } from 'next/server';
import { Categoria } from '@prisma/client';
import { getModelos } from '@/services/modelos.service';
import { handleApiError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const categoria = request.nextUrl.searchParams.get('categoria') as Categoria | null;
    const modelos = await getModelos(categoria ?? undefined);
    return NextResponse.json(modelos);
  } catch (error) {
    return handleApiError(error);
  }
}
