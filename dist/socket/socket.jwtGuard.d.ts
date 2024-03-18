import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
export declare class SocketJwtGuard implements CanActivate {
    private configService;
    private authService;
    private userCredentialsService;
    constructor(configService: ConfigService, authService: AuthService, userCredentialsService: UserCredentialsService);
    canActivate(context: ExecutionContext): Promise<boolean | any | Promise<boolean | any> | Observable<boolean | any>>;
}
