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
    let receiver_message = receiverId as string | null

    if(!chatSessionId){
      const checkReceiver = await this.chatMessageModule.find({
        senderId,
      }).sort({ createdAt: -1 })
      .select({ _id: 1, receiverId: 1, chatSessionId: 1 })
      if (checkReceiver.length > 0 && checkReceiver[0].chatSessionId) {
        random_chatSession = checkReceiver[0].chatSessionId
        const found = checkReceiver.find(
          (val) => val.receiverId !== null && val.receiverId !== undefined
        );

        if (found) {
          receiver_message = found.receiverId; // hoặc gán cả object tùy bạn
        }
        else{
          random_chatSession = `${uuidv4()}__${dayjs().unix()}`;
        }
      }
      else {
        random_chatSession = `${uuidv4()}__${dayjs().unix()}`;
      }
    }
    return await this.chatMessageModule.create({
      ...createChatMessageDto,
      chatSessionId: random_chatSession,
      receiverId:receiver_message
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
  async getAllListChatMessages_FormAdmin(receiverId: string | null){
    const result = await this.chatMessageModule.aggregate([
      {
        $match: {
          $or: [
            { senderId: receiverId },
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
        // Xác định ID của người còn lại (partnerId)
        $addFields: {
          partnerId: {
            $cond: {
              if: { $ne: ["$senderId", receiverId] },
              then: "$senderId",
              else: "$receiverId"
            }
          }
        }
      },
      {
        // Convert sang ObjectId để join sang collection users
        $addFields: {
          partnerIdObj: {
            $cond: {
              if: { $regexMatch: { input: "$partnerId", regex: /^[0-9a-fA-F]{24}$/ } },
              then: { $toObjectId: "$partnerId" },
              else: null
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "partnerIdObj",
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
          receiverId:1,
          read:1,
          "senderInfo.name": 1,
          "senderInfo.avatar": 1,
          "senderInfo._id": 1,
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
    const messages = await this.chatMessageModule.find({chatSessionId})
    if(!messages.length){
      return false
    }

    const needUpdateReceiverId = messages.some(
      (meg) => !meg.receiverId && meg.senderId !== meg.receiverId
    )
    const updateQuery= {
      chatSessionId,
      read: {$ne: true},
      $or: [
        { receiverId: { $eq: null } },
        { receiverId: receiverId }
      ]
    } as any 

    const updateData: any = {
      read: true
    };

    if(needUpdateReceiverId){
      updateData.receiverId = receiverId
    }

    const updateResult = await this.chatMessageModule.updateMany(updateQuery, updateData);
    return updateResult.modifiedCount > 0;
  }
}
