import { ObjectType, Field, Int, Directive } from '@nestjs/graphql';
import { Comment } from 'src/comment/entities/comment.entity';
import { Post } from 'src/post/entities/post.entity';
import { User } from 'src/user/entities/user.entity';
@ObjectType()
@Directive('@key(fields: "id")')
export class Notification {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  type: string;

  @Field()
  content: string;

  @Field()
  senderId: string;

  @Field()
  receiverId: string;

  @Field(() => User)
  sender: User;
  
  @Field(() => User)
  receiver: User;

  @Field(()=>Int)
  postId: number;

  @Field(()=>Post)
  post: Post;

  @Field(()=>Int)
  commentId?: number;

  @Field(()=>Comment, { nullable: true })
  comment?: Comment;

  @Field(()=>Boolean)
  isRead: boolean;

  @Field(() => Date)
  createdAt: Date

  @Field(() => Date)
  updatedAt: Date
}
