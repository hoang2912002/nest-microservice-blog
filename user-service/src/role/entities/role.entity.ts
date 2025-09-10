
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument } from 'mongoose';

export type RoleDocument = HydratedDocument<Role>;

@Schema({ timestamps: true })
export class Role {
  @Prop()
  name: string;

  @Prop()
  slug: string
}

export const RoleSchema = SchemaFactory.createForClass(Role);
RoleSchema.index({ slug: 1 });
