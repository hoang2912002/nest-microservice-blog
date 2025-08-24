
import { Optional } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserTestDocument = HydratedDocument<User_Test>;

@Schema({ timestamps: true })
export class User_Test {
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

export const UserTestSchema = SchemaFactory.createForClass(User_Test);
UserTestSchema.index({ createdAt: 1 });
UserTestSchema.index({ email: 1 });
UserTestSchema.index({ email: 1, createdAt: -1 });

