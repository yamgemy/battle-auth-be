/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { Types } from 'mongoose';
import { UserCredentialsService } from 'src/userCredentials/userCredentials.services';
import { AuthDto } from './dto/auth.dto';
import { JwtContents } from './dto/jwtContents.dto';
import { RenewAccessDto } from './dto/renewAcess.dto';
export declare class AuthService {
    private configService;
    private jwtService;
    private userCredentialsService;
    constructor(configService: ConfigService, jwtService: JwtService, userCredentialsService: UserCredentialsService);
    verifyAccessToken(token: string): Promise<JwtContents>;
    verifyRefreshToken(token: string): Promise<JwtContents>;
    signIn(authDto: AuthDto, response: Response): Promise<void>;
    hashData(data: string): Promise<string>;
    updateRefreshToken(userId: Types.ObjectId, refreshToken: string): Promise<void>;
    getAccessToken({ userId, login_name }: JwtContents): Promise<string>;
    getRefreshToken({ userId, login_name }: JwtContents): Promise<string>;
    getTokens({ userId, login_name }: JwtContents): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    renewAccessToken({ refreshToken }: RenewAccessDto): Promise<{
        newAccessToken: string;
    }>;
}
