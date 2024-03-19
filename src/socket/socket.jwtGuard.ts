import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';
import { Socket } from 'socket.io'; // Assuming you're using Socket.IO
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

  async canActivate(
    context: ExecutionContext,
  ): Promise<
    boolean | any | Promise<boolean | any> | Observable<boolean | any>
  > {
    const wsContext = context.switchToWs();
    const client = wsContext.getClient<Socket>(); // Access connected client
    // const server: Server = ctx.getServer<Server>(); // Access WebSocket server

    const bearerToken = client.handshake.auth?.token;
    console.log('@socket jwtGuard canActivate', bearerToken);
    // wsContext.args[0].handshake.headers.authorization.split(' ')[1];
    try {
      const { isTokenValid, jwtClaims, user, reasons } =
        await this.authService.verifyToken(bearerToken, 'A');
      return new Promise(async (resolve, reject) => {
        if (isTokenValid && jwtClaims && user) {
          resolve(user);
        } else {
          reject(reasons);
        }
      });
    } catch (err) {
      if (err.name === 'TokenExpiredError' || err.message.includes('expired')) {
        // Handle JWT expiration (e.g., emit error message, disconnect)
        console.error('JWT expired:', err);
        client.emit('jwtExpired');
        client.disconnect(true);
        // client.emit('error', { message: 'Your JWT has expired!' });
        //      server.sockets.connected[client.id].disconnect(true); // Disconnect expired client
      }
      // console.log('@SocketJwtGuard exeception: ', typeof ex);
      // if (typeof ex === TokenExpiredError) {
      //   client.emit('jwtExpired');
      // }
      return false;
    }
  }
}
