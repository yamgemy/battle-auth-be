import { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RenewAccessDto } from './dto/renewAcess.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signin(data: AuthDto, response: Response): Promise<void>;
    getNewAccessToken(data: RenewAccessDto, response: Response): Promise<{
        newAccessToken: string;
    }>;
}
