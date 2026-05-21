import { Injectable } from '@nestjs/common';
import { Categoria } from '@prisma/client';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { ModeloRepository } from '../../domain/modelo.repository';
import { ModeloEntity } from '../../domain/modelo.entity';

@Injectable()
export class PrismaModeloRepository implements ModeloRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(categoria?: Categoria): Promise<ModeloEntity[]> {
    const rows = await this.prisma.modelo.findMany({
      where: categoria ? { categoria } : undefined,
      orderBy: { nombre: 'asc' },
    });
    return rows.map((r) => new ModeloEntity(r.id, r.nombre, r.categoria, r.descripcion, r.archivoGlb, r.imagen));
  }

  async findById(id: string): Promise<ModeloEntity | null> {
    const r = await this.prisma.modelo.findUnique({ where: { id } });
    if (!r) return null;
    return new ModeloEntity(r.id, r.nombre, r.categoria, r.descripcion, r.archivoGlb, r.imagen);
  }
}
