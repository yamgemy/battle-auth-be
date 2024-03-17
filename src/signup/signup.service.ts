import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator, totp } from 'otplib';
import { ResponseWithCodeCaseContents } from 'src/declarations/http';
import { MailService } from 'src/mail/mail.service';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
import { ValidateEmailOtpDto } from './dto/validate-email-otp.dto';

// setting
authenticator.options = { digits: 6 };

@Injectable()
export class SignupService {
  private otpValidWindowInSeconds: number;
  private otpDigitCount: number;
  private totpSecret: string;

  constructor(
    private configService: ConfigService,
    private userCredentialService: UserCredentialsService,
    private mailService: MailService,
  ) {
    this.otpDigitCount = Number(
      this.configService.get<number>('TOTP_DIGIT_COUNT'),
    );
    this.otpValidWindowInSeconds = Number(
      this.configService.get<number>('TOTP_VALIDITY_WINDOW_IN_SECONDS'),
    );
    this.totpSecret = this.configService.get<string>('TOTP_SECRET');
  }

  async getServerOtpConfigs(): Promise<ResponseWithCodeCaseContents<any>> {
    return {
      code: 1,
      case: 'ok',
      contents: {
        otpDigitCount: this.otpDigitCount,
        otpValidWindowInSeconds: this.otpValidWindowInSeconds,
      },
    };
  }

  async generateOtpAndSendEmail(
    emailToRegister: string,
  ): Promise<ResponseWithCodeCaseContents<any>> {
    //and send email
    const timeNowInMs = Date.now();
    const expirationTimeInMs =
      this.otpValidWindowInSeconds * 1000 + timeNowInMs;

    totp.options = {
      digits: this.otpDigitCount,
      epoch: timeNowInMs,
      //step: 30, //default value
      window: this.otpValidWindowInSeconds,
    };
    const newTotp = totp.generate(this.totpSecret);
    const mailresult = await this.mailService.sendUserConfirmation(
      emailToRegister,
      newTotp,
    );

    return {
      code: 1,
      case: 'mail sent',
      contents: {
        expirationTimeInMs,
        ...mailresult,
      },
    };
  }

  async validateEmailOtp(body: ValidateEmailOtpDto) {
    const { otp } = body;
    const isOtpValid = totp.verify({ token: otp, secret: this.totpSecret });

    if (!isOtpValid) {
      return {
        code: 0,
        case: 'otp_invalid',
        contents: 'submited otp failed to verify.',
      } as ResponseWithCodeCaseContents<string>;
    }

    if (isOtpValid) {
      //create user
      return await this.userCredentialService.createUser(body);
    }
  }
}
