import { Estado } from '@/types';
import { SolicitudRepository } from '@/domain/repositories/solicitud.repository';

export class GetSolicitudesUseCase {
  constructor(private readonly solicitudRepository: SolicitudRepository) {}

  execute(ciudad?: string, estado?: Estado) {
    return this.solicitudRepository.findAll(ciudad, estado);
  }
}
