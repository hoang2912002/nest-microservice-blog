import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from 'src/user/entities/user.entity';

@ObjectType()
@Directive('@key(fields: "id")')
export class Post {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;
  
  @Field()
  slug: string;

  @Field()
  content: string;

  @Field({nullable:true})
  thumbnail?: string;

  @Field(() => Boolean,{defaultValue:false})
  published: boolean;

  @Field()
  authorId: string;

  @Field(() => User)
  user: User;
  // @Field(() => User)
  // @ResolveField(() => User)
  // user(@Parent() post: Post): any {
  //   return { __typename: 'User', id: post.authorId.toString() }; // Chỉ trả ID để federation tự xử lý
  // }
  
  @Field(()=>[Comment])
  comments: Comment[];
  
  @Field()
  tags: number;
  
  @Field()
  likes: number;

  @Field()
  createdAt: Date;
  
  @Field()
  updatedAt: Date
}
