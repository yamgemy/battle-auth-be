import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
import { JwtContents } from '../dto/jwtContents.dto';
declare const AccessTokenStrategy_base: new (...args: any[]) => Strategy;
export declare class AccessTokenStrategy extends AccessTokenStrategy_base {
    private configService;
    constructor(configService: ConfigService);
    validate(payload: JwtContents): JwtContents;
}
export {};
