import { IsString, IsOptional, IsBoolean, IsEmail, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateComercioDto {
  @ApiProperty({ example: 'Barbería Style' })
  @IsString()
  nombre: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Matches(/^\+?[\d\s\-()]{7,15}$/, { message: 'Invalid phone format' })
  telefono?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  activo?: boolean;

  @ApiPropertyOptional({ example: 'barberia' })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logo_url?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dueno_nombre?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dueno_apellido?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  dueno_email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  dueno_telefono?: string;
}
