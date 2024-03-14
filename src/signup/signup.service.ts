import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator, totp } from 'otplib';
import { MailService } from 'src/mail/mail.service';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';

// setting
authenticator.options = { digits: 6 };

@Injectable()
export class SignupService {
  constructor(
    private configService: ConfigService,
    private userCredentialService: UserCredentialsService,
    private mailService: MailService,
  ) {}

  async getServerOtpConfigs() {
    return {
      otpDigitCount: Number(this.configService.get<number>('TOTP_DIGIT_COUNT')),
    };
  }

  async generateOtpAndSendEmail(emailToRegister: string) {
    //and send email
    const totpsecret = this.configService.get<string>('TOTP_SECRET');
    const window = Number(
      this.configService.get<number>('TOTP_VALIDITY_WINDOW_IN_SECONDS'),
    );
    const timeNowInMs = Date.now();
    const expirationTimeInMs = window * 1000 + timeNowInMs;

    totp.options = {
      digits: Number(this.configService.get<number>('TOTP_DIGIT_COUNT')),
      epoch: timeNowInMs,
      //step: 30, //default value
      window,
    };
    const newTotp = totp.generate(totpsecret);
    const mailresult = await this.mailService.sendUserConfirmation(
      emailToRegister,
      newTotp,
    );

    return {
      expirationTimeInMs,
      ...mailresult,
    };
  }
}
