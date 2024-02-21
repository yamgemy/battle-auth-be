import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from 'src/auth/auth.service';
import {
  UserCredentials,
  UserCredentialsSchema,
} from './schemas/userCredentials.schema';
import { UserCrendtialsController } from './userCredentials.controller';
import { UserCredentialsService } from './userCredentials.services';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: UserCredentials.name, schema: UserCredentialsSchema },
    ]),
  ],
  controllers: [UserCrendtialsController],
  providers: [
    UserCredentialsService,
    AuthService,
    JwtService,
    // {
    //   //adding these will apply to all calls in controllers
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
  exports: [UserCredentialsService], //wtf https://stackoverflow.com/questions/70906216/nest-cant-resolve-dependencies-of-the-authenticationservice
})
export class UserCredentialsModule {}
