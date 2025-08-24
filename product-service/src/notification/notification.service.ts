import { Injectable } from '@nestjs/common';
import { CreateNotificationDTO, CreateNotificationInput } from './dto/create-notification.input';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateNotificationDTO } from './dto/update-notification.input';

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

  //------------------------admin-----------------------------
  async getAllNotification_ByAdmin(skip:number,take:number){
    const data =  await this.prismaService.notification.findMany({
      skip,
      take,
      include:{
        post:true,
      }
    })
    return data
  }

  async countAllNotification_ByAdmin(){
    return await this.prismaService.notification.count()
  }

  async createNotification_ByAdmin(createNotificationDTO : CreateNotificationDTO){
    return await this.prismaService.notification.create({
      data: {
        ...createNotificationDTO
      }
    })
  }

  async updateNotification_ByAdmin(updateNotificationDTO: UpdateNotificationDTO){
    const {id, ...dataUpdate} = updateNotificationDTO
    if(!id){
      throw new Error("Can not found id for update")
    }
    
    const data = await this.prismaService.notification.update({
      where:{
        id
      },
      data:{
        ...dataUpdate
      }
    })
    return data
  }
}
