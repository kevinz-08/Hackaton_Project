import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { ModelosModule } from './modelos/modelos.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    ModelosModule,
    SolicitudesModule,
  ],
})
export class AppModule {}
