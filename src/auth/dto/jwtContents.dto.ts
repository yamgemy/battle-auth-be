import { Types } from 'mongoose';

export interface JwtContents {
  userId: Types.ObjectId | string;
  login_name: string;
}
