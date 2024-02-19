import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserCredentials>;

@Schema({ collection: 'userCredentials' }) //specifies the name of the collection
export class UserCredentials {
  @Prop({ required: true })
  login_name: string;

  @Prop({ required: true })
  password: string;
}

export const UserCredentialsSchema =
  SchemaFactory.createForClass(UserCredentials);
