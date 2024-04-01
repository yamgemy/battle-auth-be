import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseWithCodeCaseContents } from 'src/declarations/http';
import { OauthGoogleService } from './oauth-google.service';

@Controller('oauth-google')
export class OauthGoogleController {
  constructor(private readonly oauthGoogleService: OauthGoogleService) {}

  @Get('onCodeRetrieved')
  async googleCodeMadeCallback(@Req() req: Request) {
    this.oauthGoogleService.something(req.originalUrl);
    // const url = new URL(req.originalUrl);
    console.log('googleCodeMadeCallback', req.originalUrl);
  }

  @Get('codeVerifierAndChallenge')
  async codeVerifierAndChallenge(@Res() response: Response) {
    const code_verifier = this.oauthGoogleService.generateCodeVerifier();
    const code_challenge =
      await this.oauthGoogleService.generateCodeChallenge(code_verifier);
    response.status(HttpStatus.OK).json({
      code: 1,
      case: 'code verifier and challenge made',
      contents: {
        code_verifier,
        code_challenge,
      },
    } as ResponseWithCodeCaseContents<Record<string, string>>);
  }
}
