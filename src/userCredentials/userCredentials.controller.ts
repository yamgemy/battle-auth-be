import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserCredentialsService } from './userCredentials.services';

@Controller('cred')
export class UserCrendtialsController {
  constructor(private userCredentialsService: UserCredentialsService) {}

  @Post()
  async performLogin(@Body() credentialsPayload) {
    //'findUserByCreds' service only finds the user, and returns user pw from db
    const resultArray =
      await this.userCredentialsService.findUserByCreds(credentialsPayload);

    const loginResultKey = 'details';
    const loginResultCodeKey = 'code';
    const response = {};
    response[loginResultCodeKey] = 0;
    response[loginResultKey] = 'unknown_error';

    //case 1 no user found
    if (resultArray.length === 0) {
      response[loginResultCodeKey] = 1;
      response[loginResultKey] = 'user_not_found';
      return response;
    }

    if (resultArray.length > 0) {
      const user = resultArray[0];
      //case 2 correct user name & pw
      if (user.password === credentialsPayload.password) {
        response[loginResultCodeKey] = 2;
        response[loginResultKey] = 'username_and_password_match';
        return response;
      }
      //case 3 correct user & incorrect pw
      if (user.password !== credentialsPayload.password) {
        response[loginResultCodeKey] = 3;
        response[loginResultKey] = 'user_found_password_incorrect';
        return response;
      }
    }
  }

  @Get() //working
  async listAll() {
    const result = await this.userCredentialsService.getAllUsersCreds();
    return result;
  }
}
