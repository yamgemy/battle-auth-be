"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OauthGoogleService = void 0;
const common_1 = require("@nestjs/common");
const c = require("crypto");
const URLSafeBase64 = require("urlsafe-base64");
let OauthGoogleService = class OauthGoogleService {
    async something(payload) {
        console.log('@OauthGoogleService something ', payload);
    }
    generateCodeVerifier() {
        const array = new Uint8Array(32);
        c.getRandomValues(array);
        const buffer = Buffer.from(btoa(String.fromCharCode(...array)));
        return URLSafeBase64.encode(buffer);
    }
    async generateCodeChallenge(verifier) {
        const buffer = Buffer.from(verifier, 'utf8');
        const hashBuffer = c.createHash('sha256').update(buffer).digest();
        return URLSafeBase64.encode(hashBuffer);
    }
};
exports.OauthGoogleService = OauthGoogleService;
exports.OauthGoogleService = OauthGoogleService = __decorate([
    (0, common_1.Injectable)()
], OauthGoogleService);
//# sourceMappingURL=oauth-google.service.js.map