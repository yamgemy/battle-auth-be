import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';

@Controller('signup')
export class SignupController {
  constructor(private userCredentialsService: UserCredentialsService) {}

  //this has already been debounced on the client (maybe to add here?)
  @Post('checkEmailExists')
  async checkEmailExists(
    @Body() body,
    @Res() response: Response,
  ): Promise<void> {
    const result = await this.userCredentialsService.findUserByCreds(body);
    //EXCLUDE ALL DETAILS, JUST RETURN BOOLEAN (is there a better way?)
    response.status(HttpStatus.OK).json({ emailExists: Boolean(result) });
  }
}
