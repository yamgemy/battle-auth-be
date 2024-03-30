import { Controller, Get } from '@nestjs/common';
import { OauthGoogleService } from './oauth-google.service';

@Controller('oauth-google')
export class OauthGoogleController {
  constructor(private readonly oauthGoogleService: OauthGoogleService) {}

  @Get('google/onCodeRetrieved')
  async googleCodeMadeCallback(payload: any) {
    this.oauthGoogleService.something(payload);
    console.log('googleCodeMadeCallback', payload);
  }
}
