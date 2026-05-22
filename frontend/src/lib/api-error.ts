import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409);
  }
}

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      { message: error.issues.map((e: { message: string }) => e.message) },
      { status: 400 },
    );
  }

  if (error instanceof AppError) {
    return NextResponse.json({ message: error.message }, { status: error.statusCode });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json({ message: 'Ya existe un registro con ese valor único' }, { status: 409 });
    }
    if (error.code === 'P2025') {
      return NextResponse.json({ message: 'Registro no encontrado' }, { status: 404 });
    }
  }

  console.error('[API Error]', error);
  return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
}
