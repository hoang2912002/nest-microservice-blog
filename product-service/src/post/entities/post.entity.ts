import { ObjectType, Field, Int, Directive, ID } from '@nestjs/graphql';
import { Comment } from 'src/comment/entities/comment.entity';
import { Like } from 'src/like/entities/like.entity';
import { Tag } from 'src/tag/entities/tag.entity';
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
  
  @Field(() => [Tag])
  tags: Tag[];
  
  @Field(() => [Like])
  likes: Like[];

  @Field()
  createdAt: Date;
  
  @Field()
  updatedAt: Date
}

@ObjectType()
export class PostResponse {
  @Field(() => [Post])
  postData: Post[];

  @Field(() => String, { nullable: true })
  startCursor: string | null;

  @Field(() => String, { nullable: true })
  endCursor: string | null;
} 

@ObjectType()
export class PostEdge {
  @Field(() => ID)
  cursor: string;

  @Field(() => Post)
  node: Post;
}

@ObjectType()
export class PageInfo {
  @Field(() => ID, { nullable: true })
  startCursor?: string;

  @Field(() => ID, { nullable: true })
  endCursor?: string;

  @Field()
  hasNextPage: boolean;
}


@ObjectType()
export class PostConnection {
  @Field(() => [PostEdge])
  edges: PostEdge[];

  @Field(() => PageInfo)
  pageInfo: PageInfo;
}