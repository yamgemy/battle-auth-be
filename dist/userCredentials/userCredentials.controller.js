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
const auth_guard_1 = require("../auth/auth.guard");
const userCredentials_services_1 = require("./userCredentials.services");
let UserCrendtialsController = class UserCrendtialsController {
    constructor(userCredentialsService) {
        this.userCredentialsService = userCredentialsService;
    }
    async listAll(response, request) {
        const result = await this.userCredentialsService.getAllUsersCreds();
        response.status(common_1.HttpStatus.OK).json(result);
    }
    async userCreds(id, response, request) {
        const result = await this.userCredentialsService.findUserById(id);
        console.log('@userCreds get', result);
        response.status(common_1.HttpStatus.OK).json(result);
    }
    async update(id, updateUserDto, response) {
        if ('password' in updateUserDto) {
            const result = await this.userCredentialsService.updateWithPasswordChange(id, updateUserDto);
            response
                .status(common_1.HttpStatus.OK)
                .json({ updateWithPasswordChange: 1, result });
        }
        else {
            const result = this.userCredentialsService.update(id, updateUserDto);
            response.status(common_1.HttpStatus.OK).json(result);
        }
    }
};
exports.UserCrendtialsController = UserCrendtialsController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Request]),
    __metadata("design:returntype", Promise)
], UserCrendtialsController.prototype, "listAll", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Res)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Request]),
    __metadata("design:returntype", Promise)
], UserCrendtialsController.prototype, "userCreds", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.AuthGuard),
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserCrendtialsController.prototype, "update", null);
exports.UserCrendtialsController = UserCrendtialsController = __decorate([
    (0, common_1.Controller)('cred'),
    __metadata("design:paramtypes", [userCredentials_services_1.UserCredentialsService])
], UserCrendtialsController);
//# sourceMappingURL=userCredentials.controller.js.map