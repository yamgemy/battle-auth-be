import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { ResponseWithCodeCaseContents } from 'src/declarations/http';
import { UserCredentials } from 'src/userCredentials/schemas/userCredentials.schema';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
import { CheckEmailExistsDto } from './dto/check-email-exists.dto';
import { RequestOtpDto } from './dto/request-otp-dto';
import { ValidateEmailOtpDto } from './dto/validate-email-otp.dto';
import { SignupService } from './signup.service';

@Controller('signup')
export class SignupController {
  constructor(
    private userCredentialsService: UserCredentialsService,
    private signupService: SignupService,
  ) {}

  //this has already been debounced on the client (maybe to add here?)
  @Post('checkEmailExists')
  async checkEmailExists(
    @Body() body: CheckEmailExistsDto,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.userCredentialsService.findUserByCreds(body);
    //EXCLUDE ALL DETAILS, JUST RETURN BOOLEAN (is there a better way?)
    const isAlreadyRegistered = Boolean(result);
    response.status(HttpStatus.OK).json({
      code: isAlreadyRegistered ? 1 : 0,
      case: isAlreadyRegistered ? 'already registered' : 'available',
      contents: { emailExists: isAlreadyRegistered },
    } as ResponseWithCodeCaseContents<Record<string, boolean>>);
  }

  @Get('getServerOtpConfigs')
  async getServerOtpConfigs() {
    return this.signupService.getServerOtpConfigs();
  }

  @Post('requestOtpForEmail')
  async requestOtpForEmail(
    @Body() body: RequestOtpDto,
    // @Res() response: Response,
  ): Promise<ResponseWithCodeCaseContents<any>> {
    const { email } = body;
    console.log('@requestOtpForEmail', body);
    return this.signupService.generateOtpAndSendEmail(email);
  }

  @Post('validateEmailOtp') //leads to registration if valid otp
  async validateEmailOtp(
    @Body() body: ValidateEmailOtpDto,
    // @Res() response: Response,
  ): Promise<ResponseWithCodeCaseContents<UserCredentials | string>> {
    return await this.signupService.validateEmailOtp(body);
  }
}
