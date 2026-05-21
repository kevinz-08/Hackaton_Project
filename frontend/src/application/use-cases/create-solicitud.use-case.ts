import { CreateSolicitudPayload } from '@/types';
import { SolicitudRepository } from '@/domain/repositories/solicitud.repository';

export class CreateSolicitudUseCase {
  constructor(private readonly solicitudRepository: SolicitudRepository) {}

  execute(data: CreateSolicitudPayload) {
    return this.solicitudRepository.create(data);
  }
}
