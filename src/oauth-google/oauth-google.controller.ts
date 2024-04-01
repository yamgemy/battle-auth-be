import { Controller, Get, HttpStatus, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ResponseWithCodeCaseContents } from 'src/declarations/http';
import { OauthGoogleService } from './oauth-google.service';

@Controller('oauth-google')
export class OauthGoogleController {
  constructor(private readonly oauthGoogleService: OauthGoogleService) {}

  @Get('onCodeRetrieved')
  async googleCodeMadeCallback(@Req() req: Request, @Res() res: Response) {
    res.redirect('battleauth://onCodeRetrieved' + req.originalUrl);
    //this.oauthGoogleService.something(req.originalUrl);
    // const url = new URL(req.originalUrl);
    console.log('@googleCodeMadeCallback', req.originalUrl);
    /*
    example
    /oauth-google/onCodeRetrieved?state=kPSLSFQ3NYFRwteeRBbFWrjLKkmyRRKo%2F&code=4%2F0AeaYSHA1EGXa3TDEnwNB2Yx0MKsRNKnOpkdfeoSDaiAq1z7OzQwPbHHUmD-hJnLhhpCCBw&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=0&prompt=consent
    
    */
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
