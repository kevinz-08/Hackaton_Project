import { Controller, Get, Param, Query } from '@nestjs/common';
import { Categoria } from '@prisma/client';
import { GetModelosUseCase } from '../application/use-cases/get-modelos.use-case';
import { GetModeloByIdUseCase } from '../application/use-cases/get-modelo-by-id.use-case';

@Controller('modelos')
export class ModelosController {
  constructor(
    private readonly getModelosUseCase: GetModelosUseCase,
    private readonly getModeloByIdUseCase: GetModeloByIdUseCase,
  ) {}

  @Get()
  findAll(@Query('categoria') categoria?: Categoria) {
    return this.getModelosUseCase.execute(categoria);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.getModeloByIdUseCase.execute(id);
  }
}
