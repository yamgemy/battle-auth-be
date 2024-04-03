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
exports.OauthGoogleController = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const oauth_google_service_1 = require("./oauth-google.service");
let OauthGoogleController = class OauthGoogleController {
    constructor(configService, oauthGoogleService, httpService) {
        this.configService = configService;
        this.oauthGoogleService = oauthGoogleService;
        this.httpService = httpService;
    }
    async googleCodeMadeCallback(req, res) {
        res.redirect('battleauth://onCodeRetrieved' + req.originalUrl);
        console.log('@googleCodeMadeCallback', req.originalUrl);
    }
    async codeVerifierAndChallenge(response) {
        const code_verifier = this.oauthGoogleService.generateCodeVerifier();
        const code_challenge = await this.oauthGoogleService.generateCodeChallenge(code_verifier);
        response.status(common_1.HttpStatus.OK).json({
            code: 1,
            case: 'code verifier and challenge made',
            contents: {
                code_verifier,
                code_challenge,
            },
        });
    }
    async getGoogleAccessToken(data, response) {
        const client_secret = this.configService.get('GOOGLE_OAUTH_CLIENT_SECRET');
        const postObservable = this.httpService
            .post('https://accounts.google.com/o/oauth2/token', {
            ...data,
            client_secret,
        }, { headers: { 'Content-type': 'application/x-www-form-urlencoded' } })
            .pipe((0, rxjs_1.map)((res) => res.data));
        const googleResponse = await (0, rxjs_1.lastValueFrom)(postObservable);
        console.log('@getGoogleAccessToken', googleResponse);
        response.status(common_1.HttpStatus.OK).json({
            code: 1,
            case: 'access token returned from google',
            contents: googleResponse,
        });
    }
};
exports.OauthGoogleController = OauthGoogleController;
__decorate([
    (0, common_1.Get)('onCodeRetrieved'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OauthGoogleController.prototype, "googleCodeMadeCallback", null);
__decorate([
    (0, common_1.Get)('codeVerifierAndChallenge'),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OauthGoogleController.prototype, "codeVerifierAndChallenge", null);
__decorate([
    (0, common_1.Post)('accessToken'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], OauthGoogleController.prototype, "getGoogleAccessToken", null);
exports.OauthGoogleController = OauthGoogleController = __decorate([
    (0, common_1.Controller)('oauth-google'),
    __metadata("design:paramtypes", [config_1.ConfigService,
        oauth_google_service_1.OauthGoogleService,
        axios_1.HttpService])
], OauthGoogleController);
//# sourceMappingURL=oauth-google.controller.js.map