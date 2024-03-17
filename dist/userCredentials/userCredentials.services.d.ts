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
import { ResponseithCodeCaseContents } from 'src/declarations/http';
import { CheckEmailExistsDto } from 'src/signup/dto/check-email-exists.dto';
import { AuthUserDto } from './dto/auth-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCredentials } from './schemas/userCredentials.schema';
export declare class UserCredentialsService {
    private authService;
    private credsModel;
    constructor(authService: AuthService, credsModel: Model<UserCredentials>);
    createUser(body: CreateUserDto): Promise<ResponseithCodeCaseContents<any>>;
    getAllUsersCreds(): Promise<UserCredentials[]>;
    findUserById(userId: Types.ObjectId | string): Promise<UserCredentials>;
    findUserByCreds(userLoginDto: AuthUserDto | CheckEmailExistsDto): Promise<import("mongoose").Document<unknown, {}, UserCredentials> & UserCredentials & {
        _id: Types.ObjectId;
    }>;
    update(id: Types.ObjectId | string, updateUserDto: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, UserCredentials> & UserCredentials & {
        _id: Types.ObjectId;
    }>;
    updateWithPasswordChange(id: Types.ObjectId | string, updateUserDto: UpdateUserDto): Promise<import("mongoose").Document<unknown, {}, UserCredentials> & UserCredentials & {
        _id: Types.ObjectId;
    }>;
}
