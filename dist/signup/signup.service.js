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
exports.SignupService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const otplib_1 = require("otplib");
const mail_service_1 = require("../mail/mail.service");
const userCredentials_services_1 = require("../userCredentials/userCredentials.services");
otplib_1.authenticator.options = { digits: 6 };
let SignupService = class SignupService {
    constructor(configService, userCredentialService, mailService) {
        this.configService = configService;
        this.userCredentialService = userCredentialService;
        this.mailService = mailService;
        this.otpDigitCount = Number(this.configService.get('TOTP_DIGIT_COUNT'));
        this.otpValidWindowInSeconds = Number(this.configService.get('TOTP_VALIDITY_WINDOW_IN_SECONDS'));
        this.totpSecret = this.configService.get('TOTP_SECRET');
    }
    async getServerOtpConfigs() {
        return {
            otpDigitCount: this.otpDigitCount,
            otpValidWindowInSeconds: this.otpValidWindowInSeconds,
        };
    }
    async generateOtpAndSendEmail(emailToRegister) {
        const timeNowInMs = Date.now();
        const expirationTimeInMs = this.otpValidWindowInSeconds * 1000 + timeNowInMs;
        otplib_1.totp.options = {
            digits: this.otpDigitCount,
            epoch: timeNowInMs,
            window: this.otpValidWindowInSeconds,
        };
        const newTotp = otplib_1.totp.generate(this.totpSecret);
        const mailresult = await this.mailService.sendUserConfirmation(emailToRegister, newTotp);
        return {
            expirationTimeInMs,
            ...mailresult,
        };
    }
};
exports.SignupService = SignupService;
exports.SignupService = SignupService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        userCredentials_services_1.UserCredentialsService,
        mail_service_1.MailService])
], SignupService);
//# sourceMappingURL=signup.service.js.map