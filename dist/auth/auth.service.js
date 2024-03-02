"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const argon2 = require("argon2");
const userCredentials_services_1 = require("../userCredentials/userCredentials.services");
let AuthService = class AuthService {
    constructor(configService, jwtService, userCredentialsService) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.userCredentialsService = userCredentialsService;
    }
    verifyAccessToken(token) {
        const accessSecret = this.configService.get('JWT_ACCESS_SECRET');
        return this.jwtService.verifyAsync(token, { secret: accessSecret });
    }
    verifyRefreshToken(token) {
        const refreshSecret = this.configService.get('JWT_REFRESH_SECRET');
        return this.jwtService.verifyAsync(token, { secret: refreshSecret });
    }
    async signIn(authDto, response) {
        const user = await this.userCredentialsService.findUserByCreds(authDto);
        const loginResultKey = 'details';
        const loginResultCodeKey = 'code';
        const loginTokensKey = 'tokens';
        response[loginResultCodeKey] = 0;
        response[loginResultKey] = 'unknown_error';
        if (!user) {
            throw new common_1.ForbiddenException({
                [loginResultCodeKey]: 1,
                [loginResultKey]: 'user_not_found',
            });
        }
        if (user) {
            const passwordMatches = await argon2.verify(user.password, authDto.password);
            if (passwordMatches) {
                const tokens = await this.getTokens({
                    userId: user._id,
                    login_name: user.login_name,
                });
                await this.updateRefreshToken(user._id, tokens.refreshToken);
                response.status(common_1.HttpStatus.OK).json({
                    ['user_objectId']: user._id,
                    [loginResultCodeKey]: 2,
                    [loginResultKey]: 'username_and_password_match',
                    [loginTokensKey]: tokens,
                });
            }
            if (!passwordMatches) {
                throw new common_1.ForbiddenException({
                    [loginResultCodeKey]: 3,
                    [loginResultKey]: 'user_found_password_incorrect',
                });
            }
        }
    }
    hashData(data) {
        return argon2.hash(data);
    }
    async updateRefreshToken(userId, refreshToken) {
        await this.userCredentialsService.update(userId, {
            refreshToken: refreshToken,
        });
    }
    async getAccessToken({ userId, login_name }) {
        return await this.jwtService.signAsync({
            userId,
            login_name,
        }, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_TIME'),
        });
    }
    async getRefreshToken({ userId, login_name }) {
        return await this.jwtService.signAsync({
            userId,
            login_name,
        }, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_TIME'),
        });
    }
    async getTokens({ userId, login_name }) {
        const [accessToken, refreshToken] = await Promise.all([
            this.getAccessToken({ userId, login_name }),
            this.getRefreshToken({ userId, login_name }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async renewAccessToken({ refreshToken }) {
        try {
            console.log('@renewAccessToken, ', refreshToken);
            const decoded = await this.verifyRefreshToken(refreshToken);
            console.log('@renewAccessToken', decoded);
            const user = await this.userCredentialsService.findUserById(decoded.userId);
            if (user) {
                return {
                    newAccessToken: await this.getAccessToken({
                        userId: decoded.userId,
                        login_name: decoded.login_name,
                    }),
                };
            }
            else {
                throw new common_1.UnauthorizedException('Invalid refresh token submitted from client');
            }
        }
        catch (e) {
            console.log('@renewAccessToken e', e);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        userCredentials_services_1.UserCredentialsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map