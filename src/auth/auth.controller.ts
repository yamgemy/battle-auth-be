import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RenewAccessDto } from './dto/renewAcess.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signin')
  signin(
    @Body() data: AuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    console.log('singin body', data);
    return this.authService.signIn(data, response);
  }

  @Post('newAccess')
  getNewAccessToken(
    @Body() data: RenewAccessDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.renewAccessToken(data);
  }
}
