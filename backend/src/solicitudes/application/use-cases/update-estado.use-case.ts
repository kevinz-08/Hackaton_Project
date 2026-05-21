import { Injectable, NotFoundException } from '@nestjs/common';
import { Estado } from '@prisma/client';
import { SolicitudRepository } from '../../domain/solicitud.repository';

@Injectable()
export class UpdateEstadoUseCase {
  constructor(private readonly solicitudRepository: SolicitudRepository) {}

  async execute(id: string, estado: Estado) {
    const existe = await this.solicitudRepository.findById(id);
    if (!existe) throw new NotFoundException(`Solicitud ${id} no encontrada`);
    return this.solicitudRepository.updateEstado(id, estado);
  }
}
