import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateCommentInput {
  @Field(()=>Int)
  postId: number;

  @Field()
  content: string

  @Field()
  authorId: string
  
  @Field()
  userName: string

  @Field(() => Int, {nullable:true})
  parentId?: number
}
