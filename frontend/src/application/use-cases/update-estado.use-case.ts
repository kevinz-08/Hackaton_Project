import { Estado } from '@/types';
import { SolicitudRepository } from '@/domain/repositories/solicitud.repository';

export class UpdateEstadoUseCase {
  constructor(private readonly solicitudRepository: SolicitudRepository) {}

  execute(id: string, estado: Estado) {
    return this.solicitudRepository.updateEstado(id, estado);
  }
}
