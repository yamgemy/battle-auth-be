import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
import { ClientToServerDto } from './dto/client-to-server.dto';
import { ServerToClientDto } from './dto/server-to-client.dto';
import { SocketJwtGuard } from './socket.jwtGuard';

const socketGatewayOptions = {
  cors: {
    origin: '*',
  },
};

@WebSocketGateway(socketGatewayOptions)
export class SocketGateway implements OnGatewayConnection {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    // @InjectModel(UserCredentials.name) //do not injectModel from an other module
    private userCredentialsService: UserCredentialsService,
  ) {}

  async handleConnection(client: Socket): Promise<void> {
    try {
      const accessToken = client.handshake.headers.authorization.split(' ')[1];
      const payload = await this.authService.verifyAccessToken(accessToken);
      const user = await this.userCredentialsService.findUserById(
        payload.userId,
      );
      !user && client.disconnect();
      const isClientConnected = client.connected;
      console.log(
        '@SocketGateway handleConnection connected',
        isClientConnected,
      );
    } catch (wsConnectionError) {
      console.log('@SocketGateway handleConnection error', wsConnectionError);
    }
  }

  @WebSocketServer()
  server: Server = new Server<ServerToClientDto, ClientToServerDto>(
    this.configService.get<number>('WSPORT'), //if same as REST PORT throws error
    { transports: ['websocket'] },
  );

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(
      map((item) => ({ event: 'events', data: item })),
    );
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }

  @UseGuards(SocketJwtGuard)
  @SubscribeMessage('eventsFromClient')
  handleEvent(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    console.log('handleEvent eventsFromClient incoming data:', data);
    client.emit('eventsEmitFromServer', 'SocketGateway says hello back');
    // return data;
  }
}
