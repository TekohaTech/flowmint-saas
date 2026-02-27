import { IsString, IsEmail, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CompletarRegistroDto {
  @ApiProperty({ example: 'usuario@email.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'Barbería Posadas' })
  @IsString()
  @IsNotEmpty()
  nombreComercio: string;

  @ApiProperty({ example: 'Calle Falsa 123' })
  @IsString()
  @IsNotEmpty()
  direccion: string;

  @ApiProperty({ example: '3764000000', required: false })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'contacto@barberia.com', required: false })
  @IsOptional()
  @IsEmail()
  emailComercio?: string;

  @ApiProperty({ example: 'barberia', required: false })
  @IsOptional()
  @IsString()
  categoria?: string;
}
