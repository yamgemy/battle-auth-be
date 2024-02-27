import { HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
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

  async findUserById(userId: Types.ObjectId | string): Promise<UserDocument> {
    return this.credsModel.findById(userId).exec();
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
    response: Response,
    sendResponse: boolean = true,
  ) {
    if ('password' in updateUserDto) {
      console.log('A');
      this.updateWithPasswordChange(id, updateUserDto, response);
    } else {
      console.log('B');
      const result = this.credsModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
      sendResponse && response.status(HttpStatus.OK).json(result);
    }
  }

  async updateWithPasswordChange(
    id: Types.ObjectId | string,
    updateUserDto: UpdateUserDto, //can contain only 1 field from User
    response: Response,
  ) {
    const hashedUpdateUserDto = Object.assign({}, updateUserDto);
    console.log('C');
    hashedUpdateUserDto.password = await this.authService.hashData(
      updateUserDto.password,
    );
    const result = await this.credsModel
      .findByIdAndUpdate(id, hashedUpdateUserDto, { new: true })
      .exec();
    response
      .status(HttpStatus.OK)
      .json({ updateWithPasswordChange: 1, result });

    //TODO after pw updated on DB,
    //1. invalidate DB refersh token for this user
    //2. send signal to all clients to logout (socket etc)
  }
}
