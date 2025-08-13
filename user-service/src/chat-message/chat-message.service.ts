import { Injectable } from '@nestjs/common';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { SetStateDTO, UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ChatMessage } from './entities/chat-message.entity';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid'; 
import * as dayjs from 'dayjs';
import { read } from 'fs';
@Injectable()
export class ChatMessageService {
  constructor(
    @InjectModel(ChatMessage.name) 
    private chatMessageModule: Model<ChatMessage>, 
  ){}
  async create(createChatMessageDto: CreateChatMessageDto) {
    const {senderId, receiverId, content, read, status, chatSessionId} = createChatMessageDto
    let random_chatSession = chatSessionId
    if(!chatSessionId){
      const checkReceiver = await this.chatMessageModule.find({
        senderId,
      }).sort({ createdAt: -1 })
      .select({ _id: 1, receiverId: 1, chatSessionId: 1 })
      if (checkReceiver.length > 0 && checkReceiver[0].chatSessionId) {
        random_chatSession = checkReceiver[0].chatSessionId
      }
       else {
        // Chưa có → tạo mới
        random_chatSession = `${uuidv4()}__${dayjs().unix()}`;
      }
    }
    return await this.chatMessageModule.create({
      ...createChatMessageDto,
      chatSessionId: random_chatSession
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

  //-------------admin-------------------------
  async getAllListChatMessages_FormAdmin(receiverId: string){
    const result = await this.chatMessageModule.aggregate([
      {
        $match: {
          $or: [
            { receiverId: { $eq: null } },
            { receiverId: receiverId }
          ]
        }
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$chatSessionId",
          lastMessage: { $first: "$content" },
          lastMessageAt: { $first: "$createdAt" },
          senderId: { $first: "$senderId" },
          receiverId: { $first: "$receiverId" },
          read: {$first: "$read"}
        }
      },
      {
        $addFields: {
          senderIdObj: {
            $cond: {
              if: { $regexMatch: { input: "$senderId", regex: /^[0-9a-fA-F]{24}$/ } },
              then: { $toObjectId: "$senderId" },
              else: null
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "senderIdObj",
          foreignField: "_id",
          as: "senderInfo"
        }
      },
      { $unwind: "$senderInfo" },
      {
        $project: {
          chatSessionId: "$_id",
          lastMessage: 1,
          lastMessageAt: 1,
          senderId: 1,
          read:1,
          "senderInfo.name": 1,
          "senderInfo.avatar": 1,
        }
      },
      { $sort: { lastMessageAt: -1 } }
    ]);
    return result;
  }

  async getMessagesBySessionId(chatSessionId: string){
    const data =  await this.chatMessageModule.find({
      chatSessionId,
    }).sort({ createdAt: 1 });
    return data
  }

  async setStateMessage(setStateDTO:SetStateDTO){
    const {chatSessionId,receiverId} = setStateDTO
    const updateRead_Status =  await this.chatMessageModule.updateMany({
      chatSessionId
    },{
      read: true,
      receiverId
    })
    if(updateRead_Status){
      return true
    }
    return false
  }
}
