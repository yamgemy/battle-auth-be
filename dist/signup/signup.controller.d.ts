import { Response } from 'express';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
export declare class SignupController {
    private userCredentialsService;
    constructor(userCredentialsService: UserCredentialsService);
    checkEmailExists(body: any, response: Response): Promise<void>;
}
