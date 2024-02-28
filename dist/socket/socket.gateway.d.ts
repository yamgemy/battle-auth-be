import { ConfigService } from '@nestjs/config';
import { OnGatewayConnection, WsResponse } from '@nestjs/websockets';
import { Observable } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
export declare class SocketGateway implements OnGatewayConnection {
    private configService;
    private authService;
    private userCredentialsService;
    constructor(configService: ConfigService, authService: AuthService, userCredentialsService: UserCredentialsService);
    handleConnection(client: any): Promise<void>;
    server: Server;
    findAll(data: any): Observable<WsResponse<number>>;
    identity(data: number): Promise<number>;
    handleEvent(data: string, client: Socket): string;
}
