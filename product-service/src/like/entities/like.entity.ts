import { ObjectType, Field, Int, Directive, ResolveField, Parent } from '@nestjs/graphql';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Like {
  @Field(() => Int)
  id: number;

  @Field()
  userId: string

  @Field(()=>User)
  @ResolveField(() => User)
  user(@Parent() like: Like): any {
    return { __typename: 'User', id: like.userId.toString() }; // Chỉ trả ID để federation tự xử lý
  }

  @Field(()=> Post)
  postId: Post

  @Field()
  createdAt: Date;
  
  @Field()
  updatedAt: Date
}
