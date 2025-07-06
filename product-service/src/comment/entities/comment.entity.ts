import { ObjectType, Field, Int, Directive, ResolveField, Parent } from '@nestjs/graphql';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Comment {
  @Field(() => Int)
  id: number;

  @Field()
  content: string;
  
  @Field(()=>Post)
  postId: Post;

  @Field()
  authorId: string;

  @Field(() => User)
  @ResolveField(() => User)
  user(@Parent() comment: Comment): any {
    return { __typename: 'User', id: comment.authorId.toString() }; // Chỉ trả ID để federation tự xử lý
  }

  @Field()
  createdAt: Date;
  
  @Field()
  updatedAt: Date
}
