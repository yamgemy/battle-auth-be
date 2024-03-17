import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/mail/mail.service';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
export declare class SignupService {
    private configService;
    private userCredentialService;
    private mailService;
    private otpValidWindowInSeconds;
    private otpDigitCount;
    private totpSecret;
    constructor(configService: ConfigService, userCredentialService: UserCredentialsService, mailService: MailService);
    getServerOtpConfigs(): Promise<{
        otpDigitCount: number;
        otpValidWindowInSeconds: number;
    }>;
    generateOtpAndSendEmail(emailToRegister: string): Promise<any>;
}
