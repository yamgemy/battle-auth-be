import { Response } from 'express';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
import { CheckEmailExistsDto } from './dto/check-email-exists.dto';
import { RegisterEmailDto } from './dto/register-with-email.dto';
import { RequestOtpDto } from './dto/request-otp-dto';
import { SignupService } from './signup.service';
export declare class SignupController {
    private userCredentialsService;
    private signupService;
    constructor(userCredentialsService: UserCredentialsService, signupService: SignupService);
    checkEmailExists(body: CheckEmailExistsDto, response: Response): Promise<void>;
    getServerOtpConfigs(): Promise<{
        otpDigitCount: number;
    }>;
    requestOtpForEmail(body: RequestOtpDto): Promise<void>;
    registerEmailWithOtp(body: RegisterEmailDto): Promise<void>;
}
