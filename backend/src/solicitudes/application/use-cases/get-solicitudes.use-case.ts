import { Injectable } from '@nestjs/common';
import { Estado } from '@prisma/client';
import { SolicitudRepository } from '../../domain/solicitud.repository';

@Injectable()
export class GetSolicitudesUseCase {
  constructor(private readonly solicitudRepository: SolicitudRepository) {}

  execute(ciudad?: string, estado?: Estado) {
    return this.solicitudRepository.findAll(ciudad, estado);
  }
}
