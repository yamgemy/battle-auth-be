import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserCredentialsModule } from 'src/userCredentials/userCredentials.module';
import { SignupController } from './signup.controller';
import { SignupService } from './signup.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  imports: [ConfigModule, UserCredentialsModule, MailModule],
  controllers: [SignupController],
  providers: [SignupService],
})
export class SignupModule {}
