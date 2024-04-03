import { Request, Response } from 'express';
import { OauthGoogleService } from './oauth-google.service';
export declare class OauthGoogleController {
    private readonly oauthGoogleService;
    constructor(oauthGoogleService: OauthGoogleService);
    googleCodeMadeCallback(req: Request, res: Response): Promise<void>;
    codeVerifierAndChallenge(response: Response): Promise<void>;
    getGoogleAccessToken(): Promise<void>;
}
