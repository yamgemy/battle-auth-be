"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserCredentialsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const userCredentials_schema_1 = require("./schemas/userCredentials.schema");
const userCredentials_controller_1 = require("./userCredentials.controller");
const userCredentials_services_1 = require("./userCredentials.services");
let UserCredentialsModule = class UserCredentialsModule {
};
exports.UserCredentialsModule = UserCredentialsModule;
exports.UserCredentialsModule = UserCredentialsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: userCredentials_schema_1.UserCredentials.name, schema: userCredentials_schema_1.UserCredentialsSchema },
            ]),
        ],
        controllers: [userCredentials_controller_1.UserCrendtialsController],
        providers: [userCredentials_services_1.UserCredentialsService],
    })
], UserCredentialsModule);
//# sourceMappingURL=userCredentials.module.js.map