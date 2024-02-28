import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserCredentialsModule } from 'src/userCredentials/userCredentials.module';
import { SocketGateway } from './socket.gateway';

@Module({
  imports: [AuthModule, UserCredentialsModule],
  providers: [SocketGateway],
})
export class SocketModule {}
