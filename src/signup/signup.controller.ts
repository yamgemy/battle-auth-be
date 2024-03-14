import { Body, Controller, Get, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
import { CheckEmailExistsDto } from './dto/check-email-exists.dto';
import { RegisterEmailDto } from './dto/register-with-email.dto';
import { RequestOtpDto } from './dto/request-otp-dto';
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
    response.status(HttpStatus.OK).json({ emailExists: Boolean(result) });
  }

  @Get('getServerOtpConfigs')
  async getServerOtpConfigs() {
    return this.signupService.getServerOtpConfigs();
  }

  @Post('requestOtpForEmail')
  async requestOtpForEmail(
    @Body() body: RequestOtpDto,
    // @Res() response: Response,
  ): Promise<void> {
    const { email } = body;
    return await this.signupService.generateOtpAndSendEmail(email);
  }

  @Post('registerEmailWithOtp')
  async registerEmailWithOtp(
    @Body() body: RegisterEmailDto,
    // @Res() response: Response,
  ): Promise<void> {
    const { email, password, otp } = body;
    //todo
  }
}
