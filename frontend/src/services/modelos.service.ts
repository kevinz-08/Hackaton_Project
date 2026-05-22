import { Categoria } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { NotFoundError } from '@/lib/api-error';

export async function getModelos(categoria?: Categoria) {
  return prisma.modelo.findMany({
    where: categoria ? { categoria } : undefined,
    orderBy: { nombre: 'asc' },
  });
}

export async function getModeloById(id: string) {
  const modelo = await prisma.modelo.findUnique({ where: { id } });
  if (!modelo) throw new NotFoundError(`Modelo ${id} no encontrado`);
  return modelo;
}
