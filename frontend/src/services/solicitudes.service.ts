import { Categoria, Estado } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ConflictError, NotFoundError } from '@/lib/api-error';

export interface CreateSolicitudInput {
  nombre: string;
  cedula: string;
  ciudad: string;
  correo: string;
  telefono: string;
  tipoMaterial: Categoria;
  modeloId: string;
}

export async function createSolicitud(data: CreateSolicitudInput) {
  const [cedulaExistente, modeloExistente] = await Promise.all([
    prisma.solicitud.findUnique({ where: { cedula: data.cedula } }),
    prisma.modelo.findUnique({ where: { id: data.modeloId } }),
  ]);

  if (cedulaExistente) throw new ConflictError('Ya existe una solicitud con esa cédula');
  if (!modeloExistente) throw new NotFoundError(`Modelo ${data.modeloId} no encontrado`);

  return prisma.solicitud.create({ data });
}

export async function getSolicitudes(ciudad?: string, estado?: Estado) {
  return prisma.solicitud.findMany({
    where: {
      ...(ciudad ? { ciudad } : {}),
      ...(estado ? { estado } : {}),
    },
    include: { modelo: true },
    orderBy: { fechaRegistro: 'desc' },
  });
}

export async function updateEstado(id: string, estado: Estado) {
  const existe = await prisma.solicitud.findUnique({ where: { id } });
  if (!existe) throw new NotFoundError(`Solicitud ${id} no encontrada`);
  return prisma.solicitud.update({ where: { id }, data: { estado } });
}
