import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OauthGoogleController } from './oauth-google.controller';
import { OauthGoogleService } from './oauth-google.service';

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [OauthGoogleController],
  providers: [OauthGoogleService],
})
export class OauthGoogleModule {}
