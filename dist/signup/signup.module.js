"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignupModule = void 0;
const common_1 = require("@nestjs/common");
const signup_controller_1 = require("./signup.controller");
const signup_service_1 = require("./signup.service");
const userCredentials_module_1 = require("../userCredentials/userCredentials.module");
let SignupModule = class SignupModule {
};
exports.SignupModule = SignupModule;
exports.SignupModule = SignupModule = __decorate([
    (0, common_1.Module)({
        imports: [userCredentials_module_1.UserCredentialsModule],
        controllers: [signup_controller_1.SignupController],
        providers: [signup_service_1.SignupService],
    })
], SignupModule);
//# sourceMappingURL=signup.module.js.map