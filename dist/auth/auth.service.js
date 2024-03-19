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
    async verifyToken(token, type) {
        let secret = null;
        if (type === 'A') {
            secret = this.configService.get('JWT_ACCESS_SECRET');
        }
        if (type === 'R') {
            secret = this.configService.get('JWT_REFRESH_SECRET');
        }
        if (!secret) {
            throw new jwt_1.JsonWebTokenError('No matching type of token passed in at verifyToken');
        }
        const jwtClaims = await this.jwtService.verifyAsync(token, { secret });
        const { iss, aud, sub } = jwtClaims;
        const user = await this.userCredentialsService.findUserById(sub);
        if (!user) {
            return {
                isTokenValid: false,
                reasons: 'token passed verify but user not found from database',
                jwtClaims: null,
            };
        }
        if (iss !== this.configService.get('JWT_ISSUER')) {
            return {
                isTokenValid: false,
                reasons: 'token passed verify but jwt issuer does not match',
                jwtClaims: null,
            };
        }
        if (aud !== this.configService.get('JWT_AUDIENCE')) {
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
    async signIn(authDto, response) {
        const user = await this.userCredentialsService.findUserByCreds(authDto);
        if (!user) {
            throw new common_1.ForbiddenException({
                code: 1,
                case: 'user_not_found',
                reasons: '',
            });
        }
        if (user) {
            const passwordMatches = await argon2.verify(user.password, authDto.password);
            if (passwordMatches) {
                const tokens = await this.getTokens(user._id);
                await this.updateRefreshToken(user._id, tokens.refreshToken);
                response.status(common_1.HttpStatus.OK).json({
                    code: 2,
                    case: 'username_and_password_match',
                    contents: {
                        tokens,
                        user_objectId: user.id,
                    },
                });
            }
            if (!passwordMatches) {
                throw new common_1.ForbiddenException({
                    code: 3,
                    case: 'user_found_password_incorrect',
                    reasons: '',
                });
            }
        }
        throw new common_1.ForbiddenException({
            code: 0,
            case: 'unknown_error',
            reasons: '',
        });
    }
    hashData(data) {
        return argon2.hash(data);
    }
    async updateRefreshToken(userId, refreshToken) {
        await this.userCredentialsService.update(userId, {
            refreshToken: refreshToken,
        });
    }
    async getAccessToken(userId) {
        return await this.jwtService.signAsync({
            sub: userId,
            iss: this.configService.get('JWT_ISSUER'),
            aud: this.configService.get('JWT_AUDIENCE'),
            iat: Date.now(),
        }, {
            secret: this.configService.get('JWT_ACCESS_SECRET'),
            expiresIn: this.configService.get('JWT_ACCESS_TIME'),
        });
    }
    async getRefreshToken(userId) {
        return await this.jwtService.signAsync({
            sub: userId,
            iss: this.configService.get('JWT_ISSUER'),
            aud: this.configService.get('JWT_AUDIENCE'),
            iat: Date.now(),
        }, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get('JWT_REFRESH_TIME'),
        });
    }
    async getTokens(userId) {
        const [accessToken, refreshToken] = await Promise.all([
            this.getAccessToken(userId),
            this.getRefreshToken(userId),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async renewAccessToken({ refreshToken }) {
        try {
            console.log('@renewAccessToken, ', refreshToken);
            const { isTokenValid, jwtClaims } = await this.verifyToken(refreshToken, 'R');
            if (isTokenValid && jwtClaims) {
                return {
                    newAccessToken: await this.getAccessToken(jwtClaims.sub),
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