import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthUserDto } from './dto/auth-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UserCredentials,
  UserDocument,
} from './schemas/userCredentials.schema';

@Injectable()
export class UserCredentialsService {
  constructor(
    @InjectModel(UserCredentials.name)
    private credsModel: Model<UserCredentials>,
  ) {}

  //returns a promise
  async getAllUsersCreds(): Promise<UserDocument[]> {
    return this.credsModel.find().exec();
  }

  //returns a promise
  async findUserByCreds(userLoginDto: AuthUserDto): Promise<UserDocument> {
    return (
      this.credsModel
        .findOne({ login_name: userLoginDto.login_name }) //findone returns document or null
        //.find({ login_name: userLoginDto.login_name }, { password: 1 }) //returns array
        .exec()
    );
  }

  async update(
    id: Types.ObjectId | string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.credsModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }
}
