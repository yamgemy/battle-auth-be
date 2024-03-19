import { Types } from 'mongoose';

// export interface JwtContents {
//   userId: Types.ObjectId | string;
//   login_name: string; //TODO remove it, because it is mutable
// }

export interface JwtClaims {
  iss: string; //from .env
  aud: string; //from .env
  sub: Types.ObjectId | string; //userId (mongoDB object id)
  exp: number; //expiration date timestamp in ms
  iat: number; //issed at timestamp in ms
  //do not put any mutable attributes like email etc
}
