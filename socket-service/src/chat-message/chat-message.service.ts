import { Inject, Injectable } from '@nestjs/common';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { USER_SERVICE } from 'src/constants';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatMessageService {
  constructor(
    @Inject(USER_SERVICE)
    private readonly clientProxy: ClientProxy,
  ){}
  async create(createChatMessageDto: CreateChatMessageDto) {
    return await lastValueFrom(this.clientProxy.send('createChatMessage',createChatMessageDto))
  }

  async getAllChat(senderId:string){
    return await lastValueFrom(this.clientProxy.send('getAllChatById',senderId))
  }

  findOne(id: number) {
    return `This action returns a #${id} chatMessage`;
  }

  update(id: number, updateChatMessageDto: UpdateChatMessageDto) {
    return `This action updates a #${id} chatMessage`;
  }

  remove(id: number) {
    return `This action removes a #${id} chatMessage`;
  }
}
