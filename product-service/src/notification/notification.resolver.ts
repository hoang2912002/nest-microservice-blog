import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userService: UserService
  ) {}


  @Query(() => [Notification], { name: 'getAllNotification' })
  getAllNotification(
    @Args('receiverId', {type: () => String}) receiverId: string,
    @Args('isRead', {type: () => Boolean}) isRead: boolean
  ) {
    return this.notificationService.getAllNotification({receiverId,isRead});
  }

  @Query(() => Int)
  countAllNotification(
    @Args('receiverId', {type: () => String}) receiverId: string
  ){
    return this.notificationService.countAllNotification(receiverId);
  }

  @ResolveField(() => User)
  async sender(@Parent() notification: Notification): Promise<User> {
    return this.userService.getUserById(notification.senderId);
  }
  
  @ResolveField(() => User)
  async receiver(@Parent() notification: Notification): Promise<User> {
    return this.userService.getUserById(notification.senderId);
  }

  @Mutation(() => Notification)
  async update_IsRead_Notification(@Args('id', {type: () => Int}) id: number ){
    return await this.notificationService.update_IsRead_Notification(id)
  }
}
