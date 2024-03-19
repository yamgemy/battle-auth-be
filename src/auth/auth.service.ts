import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Response } from 'express';
import { Types } from 'mongoose';
import {
  ErrorWithCodeCaseReasons,
  ResponseWithCodeCaseContents,
} from 'src/declarations/http';
import { UserCredentials } from 'src/userCredentials/schemas/userCredentials.schema';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
import { AuthDto } from './dto/auth.dto';
import { JwtClaims } from './dto/jwtContents.dto';
import { RenewAccessDto } from './dto/renewAcess.dto';

type tokenType = 'A' | 'R'; //acccess or refresh

interface TokenVerifyResult {
  isTokenValid: boolean;
  reasons?: string;
  jwtClaims?: JwtClaims | null;
  user?: UserCredentials;
}

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private userCredentialsService: UserCredentialsService,
  ) {}

  async verifyToken(
    token: string,
    type: tokenType,
  ): Promise<TokenVerifyResult> {
    let secret = null;
    if (type === 'A') {
      secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    }
    if (type === 'R') {
      secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    }
    if (!secret) {
      throw new JsonWebTokenError(
        'No matching type of token passed in at verifyToken',
      );
    }
    const jwtClaims = await this.jwtService.verifyAsync(token, { secret });
    // console.log('@verifyToken got jwtClaims, ', jwtClaims);
    const { iss, aud, sub } = jwtClaims as JwtClaims;
    const user = await this.userCredentialsService.findUserById(sub);
    if (!user) {
      return {
        isTokenValid: false,
        reasons: 'token passed verify but user not found from database',
        jwtClaims: null,
      };
    }
    if (iss !== this.configService.get<string>('JWT_ISSUER')) {
      return {
        isTokenValid: false,
        reasons: 'token passed verify but jwt issuer does not match',
        jwtClaims: null,
      };
    }
    if (aud !== this.configService.get<string>('JWT_AUDIENCE')) {
      return {
        isTokenValid: false,
        reasons: 'token passed verify but jwt audience does not match',
        jwtClaims: null,
      };
    }
    return {
      isTokenValid: true,
      jwtClaims,
      user,
    };
  }

  /*
  signIn should return access and refresh tokens
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
        const tokens = await this.getTokens(user._id);
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

  async getAccessToken(userId: Types.ObjectId | string) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        iss: this.configService.get<string>('JWT_ISSUER'),
        aud: this.configService.get<string>('JWT_AUDIENCE'),
        iat: Date.now(),
      },
      {
        secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get<string>('JWT_ACCESS_TIME'),
      },
    );
  }

  async getRefreshToken(userId: Types.ObjectId | string) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        iss: this.configService.get<string>('JWT_ISSUER'),
        aud: this.configService.get<string>('JWT_AUDIENCE'),
        iat: Date.now(),
      },
      {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get<string>('JWT_REFRESH_TIME'),
      },
    );
  }

  async getTokens(userId: Types.ObjectId | string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.getAccessToken(userId),
      this.getRefreshToken(userId),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async renewAccessToken({ refreshToken }: RenewAccessDto) {
    try {
      console.log('@renewAccessToken, ', refreshToken);
      const { isTokenValid, jwtClaims } = await this.verifyToken(
        refreshToken,
        'R',
      );
      if (isTokenValid && jwtClaims) {
        return {
          newAccessToken: await this.getAccessToken(jwtClaims.sub),
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
