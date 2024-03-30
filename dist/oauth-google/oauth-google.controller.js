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
exports.OauthGoogleController = void 0;
const common_1 = require("@nestjs/common");
const oauth_google_service_1 = require("./oauth-google.service");
let OauthGoogleController = class OauthGoogleController {
    constructor(oauthGoogleService) {
        this.oauthGoogleService = oauthGoogleService;
    }
    async googleCodeMadeCallback(payload) {
        this.oauthGoogleService.something(payload);
        console.log('googleCodeMadeCallback', payload);
    }
    async codeVerifierAndChallenge() {
        const code_verifier = this.oauthGoogleService.generateCodeVerifier();
        const code_challenge = await this.oauthGoogleService.generateCodeChallenge(code_verifier);
        return { code_verifier, code_challenge };
    }
};
exports.OauthGoogleController = OauthGoogleController;
__decorate([
    (0, common_1.Get)('onCodeRetrieved'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], OauthGoogleController.prototype, "googleCodeMadeCallback", null);
__decorate([
    (0, common_1.Get)('codeVerifierAndChallenge'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], OauthGoogleController.prototype, "codeVerifierAndChallenge", null);
exports.OauthGoogleController = OauthGoogleController = __decorate([
    (0, common_1.Controller)('oauth-google'),
    __metadata("design:paramtypes", [oauth_google_service_1.OauthGoogleService])
], OauthGoogleController);
//# sourceMappingURL=oauth-google.controller.js.map