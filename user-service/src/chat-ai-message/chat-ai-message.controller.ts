import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatAiMessageService } from './chat-ai-message.service';
import { CreateChatAiMessageDto } from './dto/create-chat-ai-message.dto';
import { UpdateChatAiMessageDto } from './dto/update-chat-ai-message.dto';
import { MessagePattern } from '@nestjs/microservices';
@Controller('chat-ai-message')
export class ChatAiMessageController {
  constructor(private readonly chatAiMessageService: ChatAiMessageService) {}

  @MessagePattern("chatWithAI")
  create(@Body() createChatAiMessageDto: CreateChatAiMessageDto) {
    return this.chatAiMessageService.sendMessage(createChatAiMessageDto);
  }
}
