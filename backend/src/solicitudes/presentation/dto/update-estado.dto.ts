import { IsEnum } from 'class-validator';
import { Estado } from '@prisma/client';

export class UpdateEstadoDto {
  @IsEnum(Estado)
  estado: Estado;
}
