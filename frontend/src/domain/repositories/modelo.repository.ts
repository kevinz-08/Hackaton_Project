import { Categoria } from '@/types';
import { ModeloEntity } from '../entities/modelo.entity';

export interface ModeloRepository {
  findAll(categoria?: Categoria): Promise<ModeloEntity[]>;
  findById(id: string): Promise<ModeloEntity>;
}
