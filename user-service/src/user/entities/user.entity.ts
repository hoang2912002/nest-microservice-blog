
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop()
  name: string;

  @Prop()
  gender: boolean;

  @Prop()
  email: string

  @Prop()
  password:string

  @Prop()
  avatar:string

  @Prop()
  roleId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
