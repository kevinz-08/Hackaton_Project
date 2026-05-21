import { Categoria } from '@/types';
import { ModeloRepository } from '@/domain/repositories/modelo.repository';

export class GetModelosUseCase {
  constructor(private readonly modeloRepository: ModeloRepository) {}

  execute(categoria?: Categoria) {
    return this.modeloRepository.findAll(categoria);
  }
}
