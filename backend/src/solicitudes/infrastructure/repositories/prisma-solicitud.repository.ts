import { Injectable } from '@nestjs/common';
import { Estado } from '@prisma/client';
import { PrismaService } from '../../../shared/infrastructure/prisma/prisma.service';
import { SolicitudRepository, CreateSolicitudInput } from '../../domain/solicitud.repository';
import { SolicitudEntity } from '../../domain/solicitud.entity';

@Injectable()
export class PrismaSolicitudRepository implements SolicitudRepository {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(r: any): SolicitudEntity {
    return new SolicitudEntity(
      r.id, r.nombre, r.cedula, r.ciudad, r.correo, r.telefono,
      r.tipoMaterial, r.modeloId, r.estado, r.fechaRegistro, r.modelo,
    );
  }

  async create(data: CreateSolicitudInput): Promise<SolicitudEntity> {
    const r = await this.prisma.solicitud.create({ data });
    return this.toEntity(r);
  }

  async findAll(ciudad?: string, estado?: Estado): Promise<SolicitudEntity[]> {
    const rows = await this.prisma.solicitud.findMany({
      where: {
        ...(ciudad ? { ciudad } : {}),
        ...(estado ? { estado } : {}),
      },
      include: { modelo: true },
      orderBy: { fechaRegistro: 'desc' },
    });
    return rows.map((r) => this.toEntity(r));
  }

  async findById(id: string): Promise<SolicitudEntity | null> {
    const r = await this.prisma.solicitud.findUnique({ where: { id } });
    return r ? this.toEntity(r) : null;
  }

  async findByCedula(cedula: string): Promise<SolicitudEntity | null> {
    const r = await this.prisma.solicitud.findUnique({ where: { cedula } });
    return r ? this.toEntity(r) : null;
  }

  async updateEstado(id: string, estado: Estado): Promise<SolicitudEntity> {
    const r = await this.prisma.solicitud.update({ where: { id }, data: { estado } });
    return this.toEntity(r);
  }
}
