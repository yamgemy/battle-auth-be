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
const auth_service_1 = require("../auth/auth.service");
const userCredentials_schema_1 = require("./schemas/userCredentials.schema");
let UserCredentialsService = class UserCredentialsService {
    constructor(authService, credsModel) {
        this.authService = authService;
        this.credsModel = credsModel;
    }
    async createUser(body) {
        const { email, password } = body;
        const user = await this.findUserByCreds({
            login_name: email,
        });
        if (user) {
            return {
                code: 1,
                case: 'otp_valid_but_email_exists',
                contents: 'otp valid but email already registered',
            };
        }
        else {
            const hashedPw = await this.authService.hashData(password);
            const newUser = new this.credsModel({
                login_name: email,
                password: hashedPw,
            });
            const tokens = await this.authService.getTokens({
                login_name: email,
                userId: newUser._id,
            });
            newUser.refreshToken = tokens.refreshToken;
            console.log('@UserCredentialsService: createUser result', newUser);
            const newUserCreated = await newUser.save();
            return {
                code: 2,
                case: 'new user created with a new access & refresh token',
                contents: {
                    tokens: {
                        accessToken: tokens.accessToken,
                        refreshToken: tokens.refreshToken,
                    },
                    user_objectId: newUserCreated._id,
                },
            };
        }
    }
    async getAllUsersCreds() {
        return await this.credsModel.find().exec();
    }
    async findUserById(userId) {
        return await this.credsModel.findById(userId).exec();
    }
    async findUserByCreds(userLoginDto) {
        return await this.credsModel
            .findOne({ login_name: userLoginDto.login_name })
            .exec();
    }
    async update(id, updateUserDto) {
        if ('password' in updateUserDto) {
            console.log('userCredentialsService update WITH password called');
            return await this.updateWithPasswordChange(id, updateUserDto);
        }
        else {
            console.log('userCredentialsService update without password called');
            return await this.credsModel
                .findByIdAndUpdate(id, updateUserDto, { new: true })
                .exec();
        }
    }
    async updateWithPasswordChange(id, updateUserDto) {
        const hashedUpdateUserDto = Object.assign({}, updateUserDto);
        console.log('@UserCredentialsService updateWithPasswordChange called');
        hashedUpdateUserDto.password = await this.authService.hashData(updateUserDto.password);
        const result = await this.credsModel
            .findByIdAndUpdate(id, hashedUpdateUserDto, { new: true })
            .exec();
        await this.authService.updateRefreshToken(result._id, result.refreshToken);
        return result;
    }
};
exports.UserCredentialsService = UserCredentialsService;
exports.UserCredentialsService = UserCredentialsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => auth_service_1.AuthService))),
    __param(1, (0, mongoose_1.InjectModel)(userCredentials_schema_1.UserCredentials.name)),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        mongoose_2.Model])
], UserCredentialsService);
//# sourceMappingURL=userCredentials.services.js.map