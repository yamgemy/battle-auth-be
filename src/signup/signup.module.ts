import { Module } from '@nestjs/common';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { UserCredentialsModule } from 'src/userCredentials/userCredentials.module';

@Module({
  imports: [UserCredentialsModule],
  controllers: [SignupController],
  providers: [SignupService],
})
export class SignupModule {}
