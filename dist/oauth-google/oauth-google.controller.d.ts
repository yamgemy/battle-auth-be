import { Response } from 'express';
import { OauthGoogleService } from './oauth-google.service';
export declare class OauthGoogleController {
    private readonly oauthGoogleService;
    constructor(oauthGoogleService: OauthGoogleService);
    googleCodeMadeCallback(payload: any): Promise<void>;
    codeVerifierAndChallenge(response: Response): Promise<void>;
}
