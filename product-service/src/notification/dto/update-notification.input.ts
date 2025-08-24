import { CreateNotificationDTO, CreateNotificationInput } from './create-notification.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateNotificationInput extends PartialType(CreateNotificationInput) {
  @Field(() => Int)
  id: number;
}


@InputType()
export class UpdateNotificationDTO extends PartialType(CreateNotificationDTO) {
  @Field(() => Int)
  id: number;

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