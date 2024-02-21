import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
  providers: [UserCredentialsService],
  exports: [UserCredentialsService], //wtf https://stackoverflow.com/questions/70906216/nest-cant-resolve-dependencies-of-the-authenticationservice
})
export class UserCredentialsModule {}
