import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { IncomingHttpHeaders } from 'http';
import { UserLoginDto } from './dto/user-login.dto';
import { UserCredentialsService } from './userCredentials.services';

@Controller('cred')
export class UserCrendtialsController {
  constructor(private userCredentialsService: UserCredentialsService) {}

  @Post()
  async performLogin(
    @Body() requestBody: UserLoginDto,
    @Headers() requestHeaders: IncomingHttpHeaders,
  ): Promise<Record<string, string | number>> {
    //'findUserByCreds' service only finds the user, and returns user pw from db
    console.log('wehehe', requestHeaders);
    const resultArray =
      await this.userCredentialsService.findUserByCreds(requestBody);

    const loginResultKey = 'details';
    const loginResultCodeKey = 'code';
    const response = {};
    response[loginResultCodeKey] = 0;
    response[loginResultKey] = 'unknown_error';

    //case 1 no user found
    if (!resultArray || resultArray.length === 0) {
      response[loginResultCodeKey] = 1;
      response[loginResultKey] = 'user_not_found';
      return response;
    }

    if (resultArray.length > 0) {
      const user = resultArray[0];
      //case 2 correct user name & pw
      if (user.password === requestBody.password) {
        response[loginResultCodeKey] = 2;
        response[loginResultKey] = 'username_and_password_match';
        return response;
      }
      //case 3 correct user & incorrect pw
      if (user.password !== requestBody.password) {
        response[loginResultCodeKey] = 3;
        response[loginResultKey] = 'user_found_password_incorrect';
        return response;
      }
    }
  }

  @Get()
  async listAll(): Promise<any[]> {
    const result = await this.userCredentialsService.getAllUsersCreds();
    return result;
  }
}
