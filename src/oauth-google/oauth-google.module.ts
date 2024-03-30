import { Module } from '@nestjs/common';
import { OauthGoogleController } from './oauth-google.controller';
import { OauthGoogleService } from './oauth-google.service';

@Module({
  controllers: [OauthGoogleController],
  providers: [OauthGoogleService],
})
export class OauthGoogleModule {}
