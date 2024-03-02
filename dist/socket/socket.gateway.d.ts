import { ConfigService } from '@nestjs/config';
import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, WsResponse } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
export declare class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private configService;
    private authService;
    private userCredentialsService;
    constructor(configService: ConfigService, authService: AuthService, userCredentialsService: UserCredentialsService);
    private logger;
    server: Server;
    handleDisconnect(client: any): void;
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    findAll(): Observable<WsResponse<number>>;
    identity(data: number): Promise<number>;
    handleEvent(data: string, client: Socket): void;
}
