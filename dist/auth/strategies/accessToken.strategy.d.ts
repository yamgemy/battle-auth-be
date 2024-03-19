import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
declare const AccessTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class AccessTokenStrategy extends AccessTokenStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: any): any;
}
export {};
