import { Injectable } from '@nestjs/common';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage } from './entities/chat-message.entity';
import { Model } from 'mongoose';

@Injectable()
export class ChatMessageService {
  constructor(
    @InjectModel(ChatMessage.name) 
    private chatMessageModule: Model<ChatMessage>, 
  ){}
  async create(createChatMessageDto: CreateChatMessageDto) {
    return await this.chatMessageModule.create({
      ...createChatMessageDto
    });
  }

  async findAll(senderId: string) {
    const data =  await this.chatMessageModule.find({
      $or:[
        {
          senderId: senderId,
        },
        {
          receiverId: senderId
        }
      ]
    }).sort({ createdAt: 1 });
    return data
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
