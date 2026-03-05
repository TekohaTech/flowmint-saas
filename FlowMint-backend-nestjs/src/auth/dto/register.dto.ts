import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'User first name',
    example: 'Juan',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  nombre: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Pérez',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  apellido: string;

  @ApiProperty({
    description: 'Username (unique)',
    example: 'juanperez',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  user: string;

  @ApiProperty({
    description: 'User email',
    example: 'juan@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  correo: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(100)
  pass: string;

  @ApiProperty({
    description: 'User DNI (optional)',
    example: '12345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  dni?: string;

  @ApiProperty({
    description: 'Commerce name',
    example: 'Barbería Juan',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  nombreComercio: string;

  @ApiProperty({
    description: 'Commerce category',
    example: 'barberia',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  categoria: string;

  @ApiProperty({
    description: 'Commerce address (optional)',
    example: 'Av. Principal 123',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  direccion?: string;

  @ApiProperty({
    description: 'Commerce phone (optional)',
    example: '+54912345678',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  telefono?: string;
}
