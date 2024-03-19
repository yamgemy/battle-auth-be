import { Logger, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
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
  transports: ['websocket'],
  path: '/socketPath1/',
};
//TODO pass port number dynamically into decorator below
@WebSocketGateway(socketGatewayOptions)
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    // @InjectModel(UserCredentials.name) //do not injectModel from an other module
    private userCredentialsService: UserCredentialsService,
  ) {}

  private logger = new Logger(SocketGateway.name);

  /* this fucks up the gateway; and the implemented interfaces won't call */
  @WebSocketServer()
  server: Server = new Server<ServerToClientDto, ClientToServerDto>();

  handleDisconnect(client: any) {
    this.logger.log(`Cliend id:${client.id} disconnected`);
  }
  afterInit(server: Server) {
    this.logger.log('SocketGateway initialized, server:', server);
  }

  @UseGuards(SocketJwtGuard)
  async handleConnection(client: Socket): Promise<void> {
    // const { sockets } = this.server.sockets;
    // console.log('@SocketGateway handleConnection sockets', sockets);

    try {
      console.log('@SocketGateway handleConnection, client:', client.id);
      const accessToken = client.handshake.auth.token;
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

  @SubscribeMessage('events')
  findAll() //@MessageBody() data: any
  : Observable<WsResponse<number>> {
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
    client.send('eventsEmitFromServer', 'SocketGateway says hello back');
    // return data;
  }

  @UseGuards(SocketJwtGuard)
  @SubscribeMessage('emitTest123')
  handleEventEmitTest123(
    @MessageBody() data: Record<string, any>,
    @ConnectedSocket() client: Socket,
  ) {
    console.log('handleEvent emitTest123 incoming data:', data);
    client.emit('ack', { ack: true, timeStamp: data.timeStamp });
    return data;
  }
}
