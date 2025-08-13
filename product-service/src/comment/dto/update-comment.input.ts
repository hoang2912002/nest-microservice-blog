import { CreateCommentInput } from './create-comment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCommentInput extends PartialType(CreateCommentInput) {
  @Field(() => Int)
  id: number;
}

@InputType()
export class UpdateCommentDTO {
  @Field(() => Int)
  id: number;

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