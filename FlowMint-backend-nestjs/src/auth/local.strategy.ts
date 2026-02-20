import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'user', passwordField: 'pass' });
  }

  async validate(user: string, pass: string): Promise<any> {
    const validatedUser = await this.authService.validateUser(user, pass);
    if (!validatedUser) {
      throw new UnauthorizedException();
    }
    return validatedUser;
  }
}
