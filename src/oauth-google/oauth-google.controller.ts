import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ResponseWithCodeCaseContents } from 'src/declarations/http';
import { OauthGoogleService } from './oauth-google.service';

@Controller('oauth-google')
export class OauthGoogleController {
  constructor(private readonly oauthGoogleService: OauthGoogleService) {}

  @Get('onCodeRetrieved')
  async googleCodeMadeCallback(payload: any) {
    this.oauthGoogleService.something(payload);
    console.log('googleCodeMadeCallback', payload);
  }

  @Get('codeVerifierAndChallenge')
  async codeVerifierAndChallenge(@Res() response: Response) {
    const code_verifier = this.oauthGoogleService.generateCodeVerifier();
    const code_challenge =
      await this.oauthGoogleService.generateCodeChallenge(code_verifier);
    response.status(HttpStatus.OK).json({
      code: 1,
      case: '',
      contents: {
        code_verifier,
        code_challenge,
      },
    } as ResponseWithCodeCaseContents<Record<string, string>>);
  }
}
