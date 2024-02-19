import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserLoginDto } from './dto/user-login.dto';
import { UserCredentials } from './schemas/userCredentials.schema';

@Injectable()
export class UserCredentialsService {
  constructor(
    @InjectModel(UserCredentials.name)
    private credsModel: Model<UserCredentials>,
  ) {}

  //it returns a promise
  getAllUsersCreds() {
    return this.credsModel.find().exec();
  }

  //returns a promise
  findUserByCreds(userLoginDto: UserLoginDto) {
    return this.credsModel
      .find({ login_name: userLoginDto.login_name }, { password: 1 })
      .exec();
  }
}
