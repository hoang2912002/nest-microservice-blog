import { CreateLikeDTO, CreateLikeInput } from './create-like.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLikeInput extends PartialType(CreateLikeInput) {
  @Field(() => Int)
  id: number;
}
@InputType()
export class UpdateLikeDTO extends PartialType(CreateLikeDTO){
  @Field(()=> Int)
  id: number;
  
  @Field(() => Int)
  postId: number

  @Field()
  userId: string

  @Field(() => Int)
  newPostId: number

  @Field()
  newUserId: string
}