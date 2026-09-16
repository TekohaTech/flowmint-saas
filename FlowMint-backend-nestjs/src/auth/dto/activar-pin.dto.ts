import { IsString, IsNotEmpty, MinLength, MaxLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ActivarPinDto {
  @ApiProperty({
    description: 'Username of the employee account',
    example: 'carlos.r',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(30)
  user: string;

  @ApiProperty({
    description: '6-digit PIN provided by the DUENO',
    example: '482917',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'El PIN debe ser un código de 6 dígitos' })
  pin: string;

  @ApiProperty({
    description: 'New password (min 8 chars, at least 1 uppercase and 1 number)',
    example: 'MiPass123',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(100)
  @Matches(/^(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe tener al menos una letra mayúscula y un número',
  })
  pass: string;
}
