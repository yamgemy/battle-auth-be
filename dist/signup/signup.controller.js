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
exports.SignupController = void 0;
const common_1 = require("@nestjs/common");
const userCredentials_services_1 = require("../userCredentials/userCredentials.services");
const signup_service_1 = require("./signup.service");
let SignupController = class SignupController {
    constructor(userCredentialsService, signupService) {
        this.userCredentialsService = userCredentialsService;
        this.signupService = signupService;
    }
    async checkEmailExists(body, response) {
        const result = await this.userCredentialsService.findUserByCreds(body);
        response.status(common_1.HttpStatus.OK).json({ emailExists: Boolean(result) });
    }
    async getServerOtpConfigs() {
        return this.signupService.getServerOtpConfigs();
    }
    async requestOtpForEmail(body) {
        const { email } = body;
        return await this.signupService.generateOtpAndSendEmail(email);
    }
    async validateEmailOtp(body) {
        return await this.signupService.validateEmailOtp(body);
    }
};
exports.SignupController = SignupController;
__decorate([
    (0, common_1.Post)('checkEmailExists'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SignupController.prototype, "checkEmailExists", null);
__decorate([
    (0, common_1.Get)('getServerOtpConfigs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SignupController.prototype, "getServerOtpConfigs", null);
__decorate([
    (0, common_1.Post)('requestOtpForEmail'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SignupController.prototype, "requestOtpForEmail", null);
__decorate([
    (0, common_1.Post)('validateEmailOtp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SignupController.prototype, "validateEmailOtp", null);
exports.SignupController = SignupController = __decorate([
    (0, common_1.Controller)('signup'),
    __metadata("design:paramtypes", [userCredentials_services_1.UserCredentialsService,
        signup_service_1.SignupService])
], SignupController);
//# sourceMappingURL=signup.controller.js.map