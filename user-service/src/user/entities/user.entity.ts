
import { Optional } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

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

  @Prop({default:"Local"})
  accountType: string;

  @Prop({default: false})
  isActive: boolean;

  @Prop()
  @Optional()
  codeId: string;

  @Prop({ type: Date })
  codeExpired: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ createdAt: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ email: 1, createdAt: -1 });