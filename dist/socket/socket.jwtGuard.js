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
exports.SocketJwtGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("../auth/auth.service");
const userCredentials_services_1 = require("../userCredentials/userCredentials.services");
let SocketJwtGuard = class SocketJwtGuard {
    constructor(configService, authService, userCredentialsService) {
        this.configService = configService;
        this.authService = authService;
        this.userCredentialsService = userCredentialsService;
    }
    async canActivate(context) {
        const wsContext = context.switchToWs();
        const client = wsContext.getClient();
        const bearerToken = client.handshake.auth?.token;
        console.log('@socket jwtGuard canActivate', bearerToken);
        try {
            const { isTokenValid, jwtClaims, user, reasons } = await this.authService.verifyToken(bearerToken, 'A');
            return new Promise(async (resolve, reject) => {
                if (isTokenValid && jwtClaims && user) {
                    resolve(user);
                }
                else {
                    reject(reasons);
                }
            });
        }
        catch (err) {
            if (err.name === 'TokenExpiredError' || err.message.includes('expired')) {
                console.error('JWT expired:', err);
                client.emit('jwtExpired');
                client.disconnect(true);
            }
            return false;
        }
    }
};
exports.SocketJwtGuard = SocketJwtGuard;
exports.SocketJwtGuard = SocketJwtGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        auth_service_1.AuthService,
        userCredentials_services_1.UserCredentialsService])
], SocketJwtGuard);
//# sourceMappingURL=socket.jwtGuard.js.map