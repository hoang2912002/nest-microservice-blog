import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLikeInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
@InputType()
export class CreateLikeDTO {
  @Field(() => Int)
  postId: number;

  @Field()
  userId: string
}
