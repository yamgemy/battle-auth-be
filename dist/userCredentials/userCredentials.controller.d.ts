/// <reference types="node" />
import { IncomingHttpHeaders } from 'http';
import { UserLoginDto } from './dto/user-login.dto';
import { UserCredentialsService } from './userCredentials.services';
export declare class UserCrendtialsController {
    private userCredentialsService;
    constructor(userCredentialsService: UserCredentialsService);
    performLogin(requestBody: UserLoginDto, requestHeaders: IncomingHttpHeaders): Promise<Record<string, string | number>>;
    listAll(): Promise<any[]>;
}
