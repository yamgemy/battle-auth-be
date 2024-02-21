import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {
  UserCredentials,
  UserDocument,
} from './schemas/userCredentials.schema';

@Injectable()
export class UserCredentialsService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
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

  //this method is being used during signIn at AuthService `to update refresh token
  async update(
    id: Types.ObjectId | string,
    updateUserDto: UpdateUserDto, //can contain only 1 field from User
  ): Promise<UserDocument> {
    if ('password' in updateUserDto) {
      return this.updateWithPasswordChange(id, updateUserDto);
    }
    return this.credsModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async updateWithPasswordChange(
    id: Types.ObjectId | string,
    updateUserDto: UpdateUserDto, //can contain only 1 field from User
  ) {
    const hashedUpdateUserDto = Object.assign({}, updateUserDto);
    if ('password' in updateUserDto) {
      //TODO updating pw must also update refresh token
      //TODO after refresh token updated on DB, send signal to all clients to logout (socket etc)
      hashedUpdateUserDto.password = await this.authService.hashData(
        updateUserDto.password,
      );
    }
    return this.credsModel
      .findByIdAndUpdate(id, hashedUpdateUserDto, { new: true })
      .exec();
  }
}
