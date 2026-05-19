import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ description: 'User email', example: 'juan@example.com' })
  @IsEmail()
  @IsNotEmpty()
  correo: string;
}
