import { Injectable } from '@nestjs/common';
import { CreateNotificationInput } from './dto/create-notification.input';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(
    private readonly prismaService: PrismaService,
  ){}
  async getAllNotification({
    receiverId,
    isRead
  }:{
    receiverId:string,
    isRead: boolean | true
  }) {
    const query = {
      receiverId,
      NOT: {
        senderId: receiverId,
      },
    } as any
    if(!isRead){
      query.isRead = isRead
    }
    return await this.prismaService.notification.findMany({
      where:query,
      skip:0,
      take:10,
      orderBy:{
        createdAt:"desc"
      },
      include:{
        post:true,
      },
    })

  }

  async countAllNotification(receiverId:string) {
    return await this.prismaService.notification.count({
      where:{
        receiverId,
        NOT: {
          senderId: receiverId,
        },
        isRead:false
      },
    })
  }

  async update_IsRead_Notification(id: number){
    return await this.prismaService.notification.update({
      where:{
        id
      },
      data:{
        isRead: true
      }
    })
  }
}
