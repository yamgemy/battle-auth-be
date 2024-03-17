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
import { Response } from 'express';
import { Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserCredentialsService } from './userCredentials.services';
export declare class UserCrendtialsController {
    private userCredentialsService;
    constructor(userCredentialsService: UserCredentialsService);
    listAll(response: Response, request: Request): Promise<void>;
    userCreds(id: Types.ObjectId | string, response: Response, request: Request): Promise<void>;
    update(id: Types.ObjectId | string, updateUserDto: UpdateUserDto, response: Response): Promise<void>;
}
