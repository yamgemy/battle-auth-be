import { ConfigService } from '@nestjs/config';
import { ResponseWithCodeCaseContents } from 'src/declarations/http';
import { MailService } from 'src/mail/mail.service';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
import { ValidateEmailOtpDto } from './dto/validate-email-otp.dto';
export declare class SignupService {
    private configService;
    private userCredentialService;
    private mailService;
    private otpValidWindowInSeconds;
    private otpDigitCount;
    private totpSecret;
    constructor(configService: ConfigService, userCredentialService: UserCredentialsService, mailService: MailService);
    getServerOtpConfigs(): Promise<ResponseWithCodeCaseContents<any>>;
    generateOtpAndSendEmail(emailToRegister: string): Promise<ResponseWithCodeCaseContents<any>>;
    validateEmailOtp(body: ValidateEmailOtpDto): Promise<ResponseWithCodeCaseContents<any>>;
}
