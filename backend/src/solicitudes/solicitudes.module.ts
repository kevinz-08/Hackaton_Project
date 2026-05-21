import { Module } from '@nestjs/common';
import { SolicitudRepository } from './domain/solicitud.repository';
import { PrismaSolicitudRepository } from './infrastructure/repositories/prisma-solicitud.repository';
import { CreateSolicitudUseCase } from './application/use-cases/create-solicitud.use-case';
import { GetSolicitudesUseCase } from './application/use-cases/get-solicitudes.use-case';
import { UpdateEstadoUseCase } from './application/use-cases/update-estado.use-case';
import { SolicitudesController } from './presentation/solicitudes.controller';
import { ModelosModule } from '../modelos/modelos.module';

@Module({
  imports: [ModelosModule],
  controllers: [SolicitudesController],
  providers: [
    { provide: SolicitudRepository, useClass: PrismaSolicitudRepository },
    CreateSolicitudUseCase,
    GetSolicitudesUseCase,
    UpdateEstadoUseCase,
  ],
})
export class SolicitudesModule {}
