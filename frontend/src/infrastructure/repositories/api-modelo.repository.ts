import { Categoria } from '@/types';
import { ModeloEntity } from '@/domain/entities/modelo.entity';
import { ModeloRepository } from '@/domain/repositories/modelo.repository';
import { apiClient } from '../http/api-client';

export class ApiModeloRepository implements ModeloRepository {
  findAll(categoria?: Categoria): Promise<ModeloEntity[]> {
    const query = categoria ? `?categoria=${categoria}` : '';
    return apiClient.get<ModeloEntity[]>(`/modelos${query}`);
  }

  findById(id: string): Promise<ModeloEntity> {
    return apiClient.get<ModeloEntity>(`/modelos/${id}`);
  }
}
