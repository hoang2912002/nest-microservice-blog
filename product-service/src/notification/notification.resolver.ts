import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification } from './entities/notification.entity';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CreateNotificationDTO } from './dto/create-notification.input';

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
    return this.userService.getUserById(notification.receiverId);
  }

  @Mutation(() => Notification)
  async update_IsRead_Notification(@Args('id', {type: () => Int}) id: number ){
    return await this.notificationService.update_IsRead_Notification(id)
  }

  //-----------------------admin---------------------------------------
  @Query(() => [Notification], {name: "getAllNotification_ByAdmin"})
  getAllNotification_ByAdmin(
    @Args("skip",{type: () => Int}) skip: number,
    @Args("take",{type: () => Int}) take: number,
  ){
    return this.notificationService.getAllNotification_ByAdmin(skip,take)
  }

  
  @Query(() => Int, {name:"countAllNotification_ByAdmin"})
  countAllNotification_ByAdmin(){
    return this.notificationService.countAllNotification_ByAdmin()
  }

  @Mutation(() => Notification, {name:"createNotification_ByAdmin"})
  createNotification_ByAdmin(
    @Args("createNotificationDTO") createNotificationDTO: CreateNotificationDTO){
    return this.notificationService.createNotification_ByAdmin(createNotificationDTO)
  }
}
