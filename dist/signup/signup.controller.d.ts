import { Response } from 'express';
import { ResponseWithCodeCaseContents } from 'src/declarations/http';
import { UserCredentials } from 'src/userCredentials/schemas/userCredentials.schema';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
import { CheckEmailExistsDto } from './dto/check-email-exists.dto';
import { RequestOtpDto } from './dto/request-otp-dto';
import { ValidateEmailOtpDto } from './dto/validate-email-otp.dto';
import { SignupService } from './signup.service';
export declare class SignupController {
    private userCredentialsService;
    private signupService;
    constructor(userCredentialsService: UserCredentialsService, signupService: SignupService);
    checkEmailExists(body: CheckEmailExistsDto, response: Response): Promise<void>;
    getServerOtpConfigs(): Promise<ResponseWithCodeCaseContents<any>>;
    requestOtpForEmail(body: RequestOtpDto): Promise<ResponseWithCodeCaseContents<any>>;
    validateEmailOtp(body: ValidateEmailOtpDto): Promise<ResponseWithCodeCaseContents<UserCredentials | string>>;
}
