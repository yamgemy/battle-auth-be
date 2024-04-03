import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { OauthGoogleService } from './oauth-google.service';
export declare class OauthGoogleController {
    private readonly configService;
    private readonly oauthGoogleService;
    private readonly httpService;
    constructor(configService: ConfigService, oauthGoogleService: OauthGoogleService, httpService: HttpService);
    googleCodeMadeCallback(req: Request, res: Response): Promise<void>;
    codeVerifierAndChallenge(response: Response): Promise<void>;
    getGoogleAccessToken(data: any, response: Response): Promise<void>;
}
