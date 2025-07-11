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
  user: User;

  @Field()
  createdAt: Date;
  
  @Field()
  updatedAt: Date
}
