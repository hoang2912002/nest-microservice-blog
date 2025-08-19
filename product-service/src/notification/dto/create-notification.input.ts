import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateNotificationInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}


@InputType()
export class CreateNotificationDTO {
  @Field(() => String)
  content: string;

  @Field(() => String)
  type: string;

  @Field(() => Number)
  postId: number;

  @Field(() => String)
  senderId: string;

  @Field(() => String)
  receiverId: string

  @Field(() => Number)
  commentId: number

  @Field(() => Boolean)
  isRead: boolean
}