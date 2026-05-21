import { Injectable, NotFoundException } from '@nestjs/common';
import { ModeloRepository } from '../../domain/modelo.repository';

@Injectable()
export class GetModeloByIdUseCase {
  constructor(private readonly modeloRepository: ModeloRepository) {}

  async execute(id: string) {
    const modelo = await this.modeloRepository.findById(id);
    if (!modelo) throw new NotFoundException(`Modelo ${id} no encontrado`);
    return modelo;
  }
}
