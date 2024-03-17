import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { Types } from 'mongoose';
import {
  ErrorWithCodeCaseReasons,
  ResponseWithCodeCaseContents,
} from 'src/declarations/http';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
import { AuthDto } from './dto/auth.dto';
import { JwtContents } from './dto/jwtContents.dto';
import { RenewAccessDto } from './dto/renewAcess.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userCredentialsService: UserCredentialsService,
  ) {}

  //TODO CREATE USER

  verifyAccessToken(token: string): Promise<JwtContents> {
    const accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    return this.jwtService.verifyAsync(token, { secret: accessSecret });
  }

  verifyRefreshToken(token: string): Promise<JwtContents> {
    const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    return this.jwtService.verifyAsync(token, { secret: refreshSecret });
  }

  /*
  signIn should return access and refreh tokens
  */
  async signIn(authDto: AuthDto, response: Response) {
    //'findUserByCreds' service only finds the user, and returns user pw from db
    const user = await this.userCredentialsService.findUserByCreds(authDto);

    //case 1 no user found ({}, or null)
    if (!user) {
      throw new ForbiddenException({
        code: 1,
        case: 'user_not_found',
        reasons: '',
      } as ErrorWithCodeCaseReasons<string>);
    }

    if (user) {
      //case 2 correct user name & pw
      const passwordMatches = await argon2.verify(
        user.password, //already hashed at DB when inserting user
        authDto.password,
      );
      if (passwordMatches) {
        const tokens = await this.getTokens({
          userId: user._id,
          login_name: user.login_name,
        });
        await this.updateRefreshToken(user._id, tokens.refreshToken);
        response.status(HttpStatus.OK).json({
          code: 2,
          case: 'username_and_password_match',
          contents: {
            tokens,
            user_objectId: user.id,
          },
        } as ResponseWithCodeCaseContents<object>);
      }
      //case 3 correct user & incorrect pw
      if (!passwordMatches) {
        throw new ForbiddenException({
          code: 3,
          case: 'user_found_password_incorrect',
          reasons: '',
        } as ErrorWithCodeCaseReasons<string>);
      }
    }

    throw new ForbiddenException({
      code: 0,
      case: 'unknown_error',
      reasons: '',
    } as ErrorWithCodeCaseReasons<string>);
  }

  hashData(data: string) {
    return argon2.hash(data);
  }

  //do not hash refresh token. argon2 hashing is irreversible
  async updateRefreshToken(userId: Types.ObjectId, refreshToken: string) {
    await this.userCredentialsService.update(userId, {
      refreshToken: refreshToken,
    });
  }

  async getAccessToken({ userId, login_name }: JwtContents) {
    return await this.jwtService.signAsync(
      {
        userId,
        login_name,
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_TIME'),
      },
    );
  }

  async getRefreshToken({ userId, login_name }: JwtContents) {
    return await this.jwtService.signAsync(
      {
        userId,
        login_name,
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TIME'),
      },
    );
  }

  async getTokens({ userId, login_name }: JwtContents) {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken({ userId, login_name }),
      this.getRefreshToken({ userId, login_name }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async renewAccessToken({ refreshToken }: RenewAccessDto) {
    try {
      console.log('@renewAccessToken, ', refreshToken);
      const decoded = await this.verifyRefreshToken(refreshToken);
      console.log('@renewAccessToken', decoded);
      const user = await this.userCredentialsService.findUserById(
        decoded.userId,
      );
      if (user) {
        return {
          newAccessToken: await this.getAccessToken({
            userId: decoded.userId,
            login_name: decoded.login_name,
          }),
        };
      } else {
        throw new UnauthorizedException(
          'Invalid refresh token submitted from client',
        );
      }
    } catch (e) {
      console.log('@renewAccessToken e', e);
    }
  }
}
