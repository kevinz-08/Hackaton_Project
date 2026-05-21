import { ModeloRepository } from '@/domain/repositories/modelo.repository';

export class GetModeloByIdUseCase {
  constructor(private readonly modeloRepository: ModeloRepository) {}

  execute(id: string) {
    return this.modeloRepository.findById(id);
  }
}
