import { HttpService } from '@nestjs/axios';
import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { lastValueFrom, map } from 'rxjs';
import { ResponseWithCodeCaseContents } from 'src/declarations/http';
import { OauthGoogleService } from './oauth-google.service';

@Controller('oauth-google')
export class OauthGoogleController {
  constructor(
    private readonly configService: ConfigService,
    private readonly oauthGoogleService: OauthGoogleService,
    private readonly httpService: HttpService,
  ) {}

  @Get('onCodeRetrieved') //this is the same redirect url for both code & id token & token
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

  @Post('accessToken')
  async getGoogleAccessToken(@Body() data: any, @Res() response: Response) {
    /* 
    localhost:3000/oauth-google/onCodeRetrieved?state=WfQnLVlklUdo0P0QEEEcU40J4mDSQR5K&code=4%2F0AeaYSHAjFu_SDekbT42eRYziIz007x6-wbpyaDj6ix4uf9sc__YX5kJ-WvcPltAtsuH5Uw&scope=email+profile+openid+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.profile+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email&authuser=0&prompt=consent
    */
    const client_secret = this.configService.get<string>(
      'GOOGLE_OAUTH_CLIENT_SECRET',
    );
    try {
      const postObservable = this.httpService
        .post(
          'https://oauth2.googleapis.com/token',
          {
            ...data,
            client_secret,
          },
          { headers: { 'Content-type': 'application/x-www-form-urlencoded' } },
        )
        .pipe(map((res) => res.data));

      const googleResponse = await lastValueFrom(postObservable);
      googleResponse &&
        response.status(HttpStatus.OK).json({
          code: 1,
          case: 'access token returned from google',
          contents: googleResponse,
        } as ResponseWithCodeCaseContents<unknown>);
    } catch (e) {
      console.log('@getGoogleAccessToken error', e);
    }
  }
}
