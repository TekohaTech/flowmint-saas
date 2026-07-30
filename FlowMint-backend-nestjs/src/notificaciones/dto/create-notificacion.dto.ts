import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength, IsOptional, IsInt, IsBoolean, IsIn } from 'class-validator';

export class CreateNotificacionDto {
  @ApiProperty({ example: 'Nueva versión disponible' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(200)
  titulo: string;

  @ApiProperty({ example: 'Se actualizó el sistema a v1.1.0', maxLength: 500 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  mensaje: string;

  @ApiProperty({ enum: ['info', 'warning', 'alert'], default: 'info' })
  @IsOptional()
  @IsIn(['info', 'warning', 'alert'])
  tipo?: string = 'info';

  @ApiProperty({ required: false, description: 'ID del usuario destino (si no es target_all)' })
  @IsOptional()
  @IsInt()
  target_user_id?: number;

  @ApiProperty({ default: false, description: 'Enviar a todos los usuarios activos' })
  @IsOptional()
  @IsBoolean()
  target_all?: boolean;
}
