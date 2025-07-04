import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields: "id")')
export class Prisma {
  @Field(() => Int)
  id: number;
}
