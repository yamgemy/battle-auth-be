import { CanActivate, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { AuthService } from 'src/auth/auth.service';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';

/**
 * source:
 * https://stackoverflow.com/questions/58670553/nestjs-gateway-websocket-how-to-send-jwt-access-token-through-socket-emit
 */

@Injectable()
export class SocketJwtGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private userCredentialsService: UserCredentialsService,
  ) {}

  canActivate(
    context: any,
  ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
    const bearerToken =
      context.args[0].handshake.headers.authorization.split(' ')[1];
    try {
      const decoded = this.authService.verifyAccessToken(bearerToken) as any;
      return new Promise(async (resolve, reject) => {
        const user = await this.userCredentialsService.findUserById(
          decoded.userId,
        );
        if (user) {
          resolve(user);
        } else {
          reject(false);
        }
      });
    } catch (ex) {
      console.log('@SocketJwtGuard exeception: ', ex);
      return false;
    }
  }
}
