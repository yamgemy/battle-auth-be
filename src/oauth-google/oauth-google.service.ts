import { Injectable } from '@nestjs/common';

@Injectable()
export class OauthGoogleService {
  async something(payload: any) {
    console.log('@OauthGoogleService something ', payload);
  }
}
