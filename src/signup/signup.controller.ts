import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';

@Controller('signup')
export class SignupController {
  constructor(private userCredentialsService: UserCredentialsService) {}

  @Post('checkEmailExists')
  async checkEmailExists(
    @Body() body,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.userCredentialsService.findUserByCreds(body);
    //TODO EXCLUDE ALL DETAILS, JUST RETURN BOOLEAN
    response.status(HttpStatus.OK).json(result);
  }
}
