"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const mail_module_1 = require("./mail/mail.module");
const oauth_google_controller_1 = require("./oauth-google/oauth-google.controller");
const oauth_google_module_1 = require("./oauth-google/oauth-google.module");
const oauth_google_service_1 = require("./oauth-google/oauth-google.service");
const signup_module_1 = require("./signup/signup.module");
const socket_module_1 = require("./socket/socket.module");
const userCredentials_module_1 = require("./userCredentials/userCredentials.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (config) => ({
                    uri: config.get('DATABASE_URL'),
                }),
            }),
            userCredentials_module_1.UserCredentialsModule,
            auth_module_1.AuthModule,
            socket_module_1.SocketModule,
            signup_module_1.SignupModule,
            mail_module_1.MailModule,
            oauth_google_module_1.OauthGoogleModule,
            axios_1.HttpModule.register({}),
        ],
        controllers: [app_controller_1.AppController, oauth_google_controller_1.OauthGoogleController],
        providers: [app_service_1.AppService, oauth_google_service_1.OauthGoogleService],
        exports: [axios_1.HttpModule],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map