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
exports.UserCredentialsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const userCredentials_schema_1 = require("./schemas/userCredentials.schema");
let UserCredentialsService = class UserCredentialsService {
    constructor(credsModel) {
        this.credsModel = credsModel;
    }
    async getAllUsersCreds() {
        return this.credsModel.find().exec();
    }
    async findUserByCreds(userLoginDto) {
        return (this.credsModel
            .findOne({ login_name: userLoginDto.login_name })
            .exec());
    }
    async update(id, updateUserDto) {
        return this.credsModel
            .findByIdAndUpdate(id, updateUserDto, { new: true })
            .exec();
    }
};
exports.UserCredentialsService = UserCredentialsService;
exports.UserCredentialsService = UserCredentialsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(userCredentials_schema_1.UserCredentials.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], UserCredentialsService);
//# sourceMappingURL=userCredentials.services.js.map