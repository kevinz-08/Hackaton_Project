import { NextRequest, NextResponse } from 'next/server';
import { getModeloById } from '@/services/modelos.service';
import { handleApiError } from '@/lib/api-error';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const modelo = await getModeloById(params.id);
    return NextResponse.json(modelo);
  } catch (error) {
    return handleApiError(error);
  }
}
