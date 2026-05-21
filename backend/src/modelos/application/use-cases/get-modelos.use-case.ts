import { Injectable } from '@nestjs/common';
import { Categoria } from '@prisma/client';
import { ModeloRepository } from '../../domain/modelo.repository';

@Injectable()
export class GetModelosUseCase {
  constructor(private readonly modeloRepository: ModeloRepository) {}

  execute(categoria?: Categoria) {
    return this.modeloRepository.findAll(categoria);
  }
}
