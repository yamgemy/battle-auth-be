export declare class OauthGoogleService {
    something(payload: any): Promise<void>;
    generateCodeVerifier(): string;
    generateCodeChallenge(verifier: string): Promise<string>;
}
