import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { UserCredentialsModule } from 'src/userCredentials/userCredentials.module';
import { SocketGateway } from './socket.gateway';
import { SocketJwtGuard } from './socket.jwtGuard';

@Module({
  imports: [ConfigModule, AuthModule, UserCredentialsModule],
  providers: [SocketJwtGuard, SocketGateway],
})
export class SocketModule {}
