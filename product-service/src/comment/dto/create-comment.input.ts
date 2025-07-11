import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(()=>Int)
  postId: number;

  @Field()
  content: string

  @Field()
  authorId: string
}
