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
exports.UserCrendtialsController = void 0;
const common_1 = require("@nestjs/common");
const user_login_dto_1 = require("./dto/user-login.dto");
const userCredentials_services_1 = require("./userCredentials.services");
let UserCrendtialsController = class UserCrendtialsController {
    constructor(userCredentialsService) {
        this.userCredentialsService = userCredentialsService;
    }
    async performLogin(requestBody, requestHeaders) {
        console.log('wehehe', requestHeaders);
        const resultArray = await this.userCredentialsService.findUserByCreds(requestBody);
        const loginResultKey = 'details';
        const loginResultCodeKey = 'code';
        const response = {};
        response[loginResultCodeKey] = 0;
        response[loginResultKey] = 'unknown_error';
        if (!resultArray || resultArray.length === 0) {
            response[loginResultCodeKey] = 1;
            response[loginResultKey] = 'user_not_found';
            return response;
        }
        if (resultArray.length > 0) {
            const user = resultArray[0];
            if (user.password === requestBody.password) {
                response[loginResultCodeKey] = 2;
                response[loginResultKey] = 'username_and_password_match';
                return response;
            }
            if (user.password !== requestBody.password) {
                response[loginResultCodeKey] = 3;
                response[loginResultKey] = 'user_found_password_incorrect';
                return response;
            }
        }
    }
    async listAll() {
        const result = await this.userCredentialsService.getAllUsersCreds();
        return result;
    }
};
exports.UserCrendtialsController = UserCrendtialsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_login_dto_1.UserLoginDto, Object]),
    __metadata("design:returntype", Promise)
], UserCrendtialsController.prototype, "performLogin", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserCrendtialsController.prototype, "listAll", null);
exports.UserCrendtialsController = UserCrendtialsController = __decorate([
    (0, common_1.Controller)('cred'),
    __metadata("design:paramtypes", [userCredentials_services_1.UserCredentialsService])
], UserCrendtialsController);
//# sourceMappingURL=userCredentials.controller.js.map