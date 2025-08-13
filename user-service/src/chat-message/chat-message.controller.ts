import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';
import { SetStateDTO, UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('chat-message')
export class ChatMessageController {
  constructor(private readonly chatMessageService: ChatMessageService) {}

  @MessagePattern('createChatMessage')
  @Post()
  create(@Body() createChatMessageDto: CreateChatMessageDto) {
    return this.chatMessageService.create(createChatMessageDto);
  }

  @MessagePattern('getAllChatById')
  @Get()
  findAll(@Body() senderId: string) {
    return this.chatMessageService.findAll(senderId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatMessageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatMessageDto: UpdateChatMessageDto) {
    return this.chatMessageService.update(+id, updateChatMessageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatMessageService.remove(+id);
  }

  //------------------Admin----------------------------
  @MessagePattern("getAllListChatMessages_FormAdmin")
  @Post()
  getAllListChatMessages_FormAdmin(
    @Body() receiverId: string
  ){
    return this.chatMessageService.getAllListChatMessages_FormAdmin(receiverId)
  }


  @MessagePattern("getMessagesBySessionId")
  @Post()
  getMessagesBySessionId(
    @Body() chatSessionId: string
  ){
    return this.chatMessageService.getMessagesBySessionId(chatSessionId)
  }
  
  @MessagePattern("setStateMessage")
  @Post()
  setStateMessage(
    @Body() setStateDTO: SetStateDTO
  ){
    return this.chatMessageService.setStateMessage(setStateDTO)
  }
}
