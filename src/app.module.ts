import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { OauthGoogleController } from './oauth-google/oauth-google.controller';
import { OauthGoogleModule } from './oauth-google/oauth-google.module';
import { OauthGoogleService } from './oauth-google/oauth-google.service';
import { SignupModule } from './signup/signup.module';
import { SocketModule } from './socket/socket.module';
import { UserCredentialsModule } from './userCredentials/userCredentials.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), //must be first import
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('DATABASE_URL'), // Loaded from .env
      }),
    }),
    UserCredentialsModule,
    AuthModule,
    SocketModule,
    SignupModule,
    MailModule,
    OauthGoogleModule,
    HttpModule.register({}),
  ],
  controllers: [AppController, OauthGoogleController],
  providers: [AppService, OauthGoogleService],
  exports: [HttpModule],
})
export class AppModule {}
