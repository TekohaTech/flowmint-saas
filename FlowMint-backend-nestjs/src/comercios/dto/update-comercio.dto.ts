import { PartialType } from '@nestjs/swagger';
import { CreateComercioDto } from './create-comercio.dto';
import { IsOptional, IsString, IsDateString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateComercioDto extends PartialType(CreateComercioDto) {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  estado?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fecha_activacion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  fecha_suspension?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  motivo_suspension?: string;
}
