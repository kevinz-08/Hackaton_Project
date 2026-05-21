import { Module } from '@nestjs/common';
import { ModeloRepository } from './domain/modelo.repository';
import { PrismaModeloRepository } from './infrastructure/repositories/prisma-modelo.repository';
import { GetModelosUseCase } from './application/use-cases/get-modelos.use-case';
import { GetModeloByIdUseCase } from './application/use-cases/get-modelo-by-id.use-case';
import { ModelosController } from './presentation/modelos.controller';

@Module({
  controllers: [ModelosController],
  providers: [
    { provide: ModeloRepository, useClass: PrismaModeloRepository },
    GetModelosUseCase,
    GetModeloByIdUseCase,
  ],
  exports: [ModeloRepository],
})
export class ModelosModule {}
