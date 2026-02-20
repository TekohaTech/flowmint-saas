import { IsString, IsNotEmpty, IsEmail, IsOptional, IsInt, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUsuarioDto {
  @ApiProperty({ description: 'The first name of the user.', example: 'Carlos' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ description: 'The last name of the user.', example: 'Rodriguez' })
  @IsString()
  @IsNotEmpty()
  apellido: string;

  @ApiProperty({
    description: 'The DNI (National Identity Document) of the user.',
    example: '12345678A',
    required: false,
  })
  @IsString()
  @IsOptional()
  dni?: string;

  @ApiProperty({
    description: 'The username for logging in.',
    example: 'carlos.r',
  })
  @IsString()
  @IsNotEmpty()
  user: string;

  @ApiProperty({
    description: 'The password for the user (minimum 6 characters).',
    example: 'securepass123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  pass: string;

  @ApiProperty({
    description: 'The email address of the user.',
    example: 'carlos.rodriguez@example.com',
    required: false,
  })
  @IsEmail()
  @IsOptional()
  correo?: string;

  @ApiProperty({
    description: 'The ID of the role assigned to the user.',
    example: 2,
    required: false,
  })
  @IsInt()
  @IsOptional()
  rol_id?: number;

  @ApiProperty({
    description: 'The ID of the business assigned to the user.',
    example: 1,
    required: false,
  })
  @IsInt()
  @IsOptional()
  comercio_id?: number;
}
