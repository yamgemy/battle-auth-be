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
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
let AuthGuard = class AuthGuard {
    constructor(authService) {
        this.authService = authService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const token = this.extractBearerTokenFromHeader(request);
        try {
            const payload = await this.authService.verifyAccessToken(token);
            request['decodedData'] = payload;
            return true;
        }
        catch (error) {
            throw new common_1.ForbiddenException(error.message || 'access jwt expired', '');
        }
    }
    extractBearerTokenFromHeader(request) {
        const { authorization } = request.headers;
        if (!authorization) {
            throw new common_1.UnauthorizedException('Please provide authorization prop in request headers');
        }
        if (authorization.toString().trim() === '') {
            throw new common_1.UnauthorizedException('Please provide authorization value in request headers');
        }
        const [type, token] = authorization?.split(' ') ?? [];
        if (!token) {
            throw new common_1.UnauthorizedException('token cannot be empty');
        }
        return type === 'Bearer' ? token : undefined;
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map