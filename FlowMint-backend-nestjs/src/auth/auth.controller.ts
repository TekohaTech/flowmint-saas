import { Controller, Post, UseGuards, Request, Get, Res, Body, Ip, UseGuards as UseThrottler } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.decorator';
import { ApiTags, ApiOperation, ApiBody } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { CompletarRegistroDto } from './dto/completar-registro.dto';
import { RegisterDto } from './dto/register.dto';
import { ThrottlerGuard, Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login with username and password' })
  @ApiBody({ type: LoginDto })
  async login(@Request() req, @Res({ passthrough: true }) res) {
    const authData = await this.authService.login(req.user);
    
    res.cookie('access_token', authData.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    return authData;
  }

  @Post('logout')
  async logout(@Res({ passthrough: true }) res) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }

  @Public()
  @UseGuards(ThrottlerGuard)
  @Throttle({ default: { ttl: 60000, limit: 5 } })
  @Post('register')
  @ApiOperation({ summary: 'Register a new user with IP control' })
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto, @Ip() ip: string) {
    const clientIp = ip || 'unknown';
    return this.authService.register(dto, clientIp);
  }

  @Public()
  @Post('completar-registro')
  @ApiOperation({ summary: 'Completar registro de comercio' })
  async completarRegistro(@Body() dto: CompletarRegistroDto, @Request() req) {
    return this.authService.completarRegistro(dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Obtener datos del usuario actual' })
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.usuario_id);
  }
}
