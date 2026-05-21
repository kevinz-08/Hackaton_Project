import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { Estado } from '@prisma/client';
import { CreateSolicitudUseCase } from '../application/use-cases/create-solicitud.use-case';
import { GetSolicitudesUseCase } from '../application/use-cases/get-solicitudes.use-case';
import { UpdateEstadoUseCase } from '../application/use-cases/update-estado.use-case';
import { CreateSolicitudDto } from './dto/create-solicitud.dto';
import { UpdateEstadoDto } from './dto/update-estado.dto';

@Controller('solicitudes')
export class SolicitudesController {
  constructor(
    private readonly createSolicitudUseCase: CreateSolicitudUseCase,
    private readonly getSolicitudesUseCase: GetSolicitudesUseCase,
    private readonly updateEstadoUseCase: UpdateEstadoUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateSolicitudDto) {
    return this.createSolicitudUseCase.execute(dto);
  }

  @Get()
  findAll(
    @Query('ciudad') ciudad?: string,
    @Query('estado') estado?: Estado,
  ) {
    return this.getSolicitudesUseCase.execute(ciudad, estado);
  }

  @Patch(':id')
  updateEstado(@Param('id') id: string, @Body() dto: UpdateEstadoDto) {
    return this.updateEstadoUseCase.execute(id, dto.estado);
  }
}
