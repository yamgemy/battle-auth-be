import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Types } from 'mongoose';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userCredentialsService: UserCredentialsService,
  ) {}

  //TODO CREATE USER

  async verifyAccessToken(token: string): Promise<object> {
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    return await this.jwtService.verifyAsync(token, { secret: accessSecret });
  }

  async verifyRefreshToken(token: string): Promise<object> {
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    return await this.jwtService.verifyAsync(token, { secret: refreshSecret });
  }

  /*
  signIn should return access and refreh tokens
  */
  async signIn(authDto: AuthDto): Promise<Record<string, string | number>> {
    //'findUserByCreds' service only finds the user, and returns user pw from db

    const user = await this.userCredentialsService.findUserByCreds(authDto);

    const loginResultKey = 'details';
    const loginResultCodeKey = 'code';
    const loginTokensKey = 'tokens';
    const response = {};
    response[loginResultCodeKey] = 0;
    response[loginResultKey] = 'unknown_error';

    //case 1 no user found
    if (!user) {
      //{} or null
      response[loginResultCodeKey] = 1;
      response[loginResultKey] = 'user_not_found';
      return response;
    }

    if (user) {
      //case 2 correct user name & pw
      const passwordMatches = await argon2.verify(
        user.password, //already hashed at DB when inserting user
        authDto.password,
      );
      if (passwordMatches) {
        response['user_objectId'] = user._id;
        response[loginResultCodeKey] = 2;
        response[loginResultKey] = 'username_and_password_match';
        const tokens = await this.getTokens(user._id, user.login_name);
        await this.updateRefreshToken(user._id, tokens.refreshToken);
        response[loginTokensKey] = tokens;
        return response;
      }
      //case 3 correct user & incorrect pw
      if (!passwordMatches) {
        response[loginResultCodeKey] = 3;
        response[loginResultKey] = 'user_found_password_incorrect';
        return response;
      }
    }
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    const hashedRefreshToken = await this.hashData(refreshToken);
    await this.userCredentialsService.update(userId, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getAccessToken(userId: Types.ObjectId | string, username: string) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        username,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: '15m',
      },
    );
  }

  async getRefreshToken(userId: Types.ObjectId | string, username: string) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        username,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      },
    );
  }

  async getTokens(userId: Types.ObjectId, username: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(userId, username),
      this.getRefreshToken(userId, username),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
