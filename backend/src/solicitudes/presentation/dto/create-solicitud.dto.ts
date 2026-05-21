import { IsEmail, IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';
import { Categoria } from '@prisma/client';

export class CreateSolicitudDto {
  @IsNotEmpty()
  @IsString()
  nombre: string;

  @IsNotEmpty()
  @Matches(/^\d{6,10}$/, { message: 'Cédula debe tener entre 6 y 10 dígitos' })
  cedula: string;

  @IsNotEmpty()
  @IsString()
  ciudad: string;

  @IsEmail({}, { message: 'Correo inválido' })
  correo: string;

  @Matches(/^\d{10}$/, { message: 'Teléfono debe tener 10 dígitos' })
  telefono: string;

  @IsEnum(Categoria)
  tipoMaterial: Categoria;

  @IsNotEmpty()
  @IsString()
  modeloId: string;
}
