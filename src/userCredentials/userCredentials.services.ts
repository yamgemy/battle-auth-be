import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { ResponseWithCodeCaseContents } from 'src/declarations/http';
import { CheckEmailExistsDto } from 'src/signup/dto/check-email-exists.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCredentials } from './schemas/userCredentials.schema';

@Injectable()
export class UserCredentialsService {
  constructor(
    @Inject(forwardRef(() => AuthService))
    private authService: AuthService,
    @InjectModel(UserCredentials.name)
    private credsModel: Model<UserCredentials>,
  ) {}

  async createUser(body: CreateUserDto) {
    const { email, password } = body;
    const user = await this.findUserByCreds({
      login_name: email,
    });
    if (user) {
      return {
        code: 1,
        case: 'otp_valid_but_email_exists',
        contents: 'otp valid but email already registered',
      } as ResponseWithCodeCaseContents<string>;
    } else {
      const hashedPw = await this.authService.hashData(password);
      const newUser = new this.credsModel({
        login_name: email,
        password: hashedPw,
      });

      const tokens = await this.authService.getTokens(newUser._id);

      newUser.refreshToken = tokens.refreshToken;
      console.log('@UserCredentialsService: createUser result', newUser);
      const newUserCreated = await newUser.save();
      return {
        code: 2,
        case: 'new user created with a new access & refresh token',
        contents: {
          tokens: {
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
          },
          user_objectId: newUserCreated._id,
        },
      } as ResponseWithCodeCaseContents<any>;
    }
  }

  async getAllUsersCreds(): Promise<UserCredentials[]> {
    return await this.credsModel.find().exec();
  }

  async findUserById(
    userId: Types.ObjectId | string,
  ): Promise<UserCredentials> {
    return await this.credsModel.findById(userId).exec();
  }

  //returns a promise
  async findUserByCreds(userLoginDto: AuthUserDto | CheckEmailExistsDto) {
    return await this.credsModel
      .findOne({ login_name: userLoginDto.login_name }) //findone returns document or null
      //.find({ login_name: userLoginDto.login_name }, { password: 1 }) //returns array
      .exec();
  }

  //this method is being used during signIn at AuthService `to update refresh token
  async update(
    id: Types.ObjectId | string,
    updateUserDto: UpdateUserDto, //can contain only 1 field from User
  ) {
    if ('password' in updateUserDto) {
      console.log('userCredentialsService update WITH password called');
      return await this.updateWithPasswordChange(id, updateUserDto);
    } else {
      console.log('userCredentialsService update without password called');
      return await this.credsModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();
    }
  }

  async updateWithPasswordChange(
    id: Types.ObjectId | string,
    updateUserDto: UpdateUserDto, //can contain only 1 field from User
  ) {
    const hashedUpdateUserDto = Object.assign({}, updateUserDto);
    console.log('@UserCredentialsService updateWithPasswordChange called');
    hashedUpdateUserDto.password = await this.authService.hashData(
      updateUserDto.password,
    );
    const result = await this.credsModel
      .findByIdAndUpdate(id, hashedUpdateUserDto, { new: true })
      .exec();
    await this.authService.updateRefreshToken(result._id, result.refreshToken);
    return result;
    //TODO after pw updated on DB,
    //2. send signal to all clients to logout (socket etc)
  }
}
