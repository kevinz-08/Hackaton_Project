import { Categoria } from '@prisma/client';
import { ModeloEntity } from './modelo.entity';

export abstract class ModeloRepository {
  abstract findAll(categoria?: Categoria): Promise<ModeloEntity[]>;
  abstract findById(id: string): Promise<ModeloEntity | null>;
}
