import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { SolicitudRepository, CreateSolicitudInput } from '../../domain/solicitud.repository';
import { ModeloRepository } from '../../../modelos/domain/modelo.repository';

@Injectable()
export class CreateSolicitudUseCase {
  constructor(
    private readonly solicitudRepository: SolicitudRepository,
    private readonly modeloRepository: ModeloRepository,
  ) {}

  async execute(data: CreateSolicitudInput) {
    const [cedulaExistente, modeloExistente] = await Promise.all([
      this.solicitudRepository.findByCedula(data.cedula),
      this.modeloRepository.findById(data.modeloId),
    ]);

    if (cedulaExistente) {
      throw new ConflictException('Ya existe una solicitud con esa cédula');
    }
    if (!modeloExistente) {
      throw new NotFoundException(`Modelo ${data.modeloId} no encontrado`);
    }

    return this.solicitudRepository.create(data);
  }
}
