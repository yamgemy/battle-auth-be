/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model, Types } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { AuthUserDto } from './dto/auth-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCredentials, UserDocument } from './schemas/userCredentials.schema';
export declare class UserCredentialsService {
    private authService;
    private credsModel;
    constructor(authService: AuthService, credsModel: Model<UserCredentials>);
    getAllUsersCreds(): Promise<UserDocument[]>;
    findUserByCreds(userLoginDto: AuthUserDto): Promise<UserDocument>;
    update(id: Types.ObjectId | string, updateUserDto: UpdateUserDto): Promise<UserDocument>;
    updateWithPasswordChange(id: Types.ObjectId | string, updateUserDto: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, UserCredentials> & UserCredentials & {
        _id: Types.ObjectId;
    }>;
}
