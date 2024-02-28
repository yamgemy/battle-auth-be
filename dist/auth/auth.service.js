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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const argon2 = require("argon2");
const mongoose_1 = require("mongoose");
const userCredentials_services_1 = require("../userCredentials/userCredentials.services");
let AuthService = class AuthService {
    constructor(configService, jwtService, userCredentialsService) {
        this.configService = configService;
        this.jwtService = jwtService;
        this.userCredentialsService = userCredentialsService;
    }
    async verifyAccessToken(token) {
        const accessSecret = this.configService.get('JWT_ACCESS_SECRET');
        return await this.jwtService.verifyAsync(token, { secret: accessSecret });
    }
    async verifyRefreshToken(token) {
        const refreshSecret = this.configService.get('JWT_REFRESH_SECRET');
        return await this.jwtService.verifyAsync(token, { secret: refreshSecret });
    }
    async signIn(authDto, response) {
        const user = await this.userCredentialsService.findUserByCreds(authDto);
        const loginResultKey = 'details';
        const loginResultCodeKey = 'code';
        const loginTokensKey = 'tokens';
        response[loginResultCodeKey] = 0;
        response[loginResultKey] = 'unknown_error';
        if (!user) {
            response.status(common_1.HttpStatus.FORBIDDEN).json({
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
                await this.updateRefreshToken(user._id, tokens.refreshToken, response);
                response.status(common_1.HttpStatus.OK).json({
                    ['user_objectId']: user._id,
                    [loginResultCodeKey]: 2,
                    [loginResultKey]: 'username_and_password_match',
                    [loginTokensKey]: tokens,
                });
            }
            if (!passwordMatches) {
                response.status(common_1.HttpStatus.FORBIDDEN).json({
                    [loginResultCodeKey]: 3,
                    [loginResultKey]: 'user_found_password_incorrect',
                });
            }
        }
    }
    hashData(data) {
        return argon2.hash(data);
    }
    async updateRefreshToken(userId, refreshToken, response) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.userCredentialsService.update(userId, {
            refreshToken: hashedRefreshToken,
        }, response, false);
    }
    async getAccessToken({ userId, login_name }) {
        return await this.jwtService.signAsync({
            userId,
            login_name,
        }, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: '15m',
        });
    }
    async getRefreshToken({ userId, login_name }) {
        return await this.jwtService.signAsync({
            userId,
            login_name,
        }, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: '7d',
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
};
exports.AuthService = AuthService;
__decorate([
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.Types.ObjectId, String, Object]),
    __metadata("design:returntype", Promise)
], AuthService.prototype, "updateRefreshToken", null);
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        jwt_1.JwtService,
        userCredentials_services_1.UserCredentialsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map