import { prisma } from '@/lib/prisma';
import { EstadoGenerado } from '@/types';

export async function crearModeloGenerado(data: {
  taskId:    string;
  imagenUrl: string;
  nombre?:   string;
}) {
  return prisma.modeloGenerado.create({
    data: {
      taskId:    data.taskId,
      glbUrl:    '',              // se rellena cuando Hitem3D termina
      imagenUrl: data.imagenUrl,
      nombre:    data.nombre,
      estado:    'PROCESANDO',
    },
  });
}

export async function actualizarModeloGenerado(
  taskId: string,
  data: { glbUrl?: string; estado?: EstadoGenerado },
) {
  return prisma.modeloGenerado.update({
    where: { taskId },
    data,
  });
}

export async function getModelosGenerados() {
  return prisma.modeloGenerado.findMany({
    orderBy: { creadoEn: 'desc' },
  });
}
