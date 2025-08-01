import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessageDto, TypingDTO } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { Server, Socket } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE } from 'src/constants';
import { Inject, UnauthorizedException } from '@nestjs/common';

@WebSocketGateway({
  namespace:"/chatMessage",
  cors: { origin: '*', methods: ['GET', 'POST'] },
})
export class ChatMessageGateway {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    private readonly redisService: RedisService,
    @Inject(USER_SERVICE)
    private readonly clientProxy: ClientProxy,
  ) {}
  @WebSocketServer()
  server: Server;

  // userId -> socketId mapping
  private onlineUsers = new Map<string, string>();

  onModuleInit() {
    // this.redisService.subscribe('comment_notification', (dataString) => {
    //   const data = typeof dataString === 'string' ? JSON.parse(dataString) : dataString;
    //   const { senderId, content } = data;
    //   this.sendNotificationToUser(senderId, { content });
    // });
  }
  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) this.onlineUsers.set(userId, client.id);
  }

  async handleDisconnect(client: Socket) {
    const userId = [...this.onlineUsers.entries()].find(([_, socketId]) => socketId === client.id)?.[0];
    if (userId) this.onlineUsers.delete(userId);
  }

  @SubscribeMessage('createChatMessage')
  async create(
    @MessageBody() createChatMessageDto: CreateChatMessageDto,
    @ConnectedSocket() client: Socket,
  ) {
    const savedMessage = await this.chatMessageService.create(createChatMessageDto);

    // Gửi lại cho người gửi
    client.emit('chatMessage', savedMessage);

    // Gửi cho người nhận nếu online
    const receiverSocketId = this.onlineUsers.get(createChatMessageDto.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('chatMessage', savedMessage);
    }

    return savedMessage;
  }
  
  @SubscribeMessage('isTyping')
  async sendTypingReceiver(
    @MessageBody() typingDTO: TypingDTO
  ){
    const receiverSocketId = this.onlineUsers.get(typingDTO.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('isTyping', typingDTO.receiverId);
    }
  }
  
  @SubscribeMessage('stopTyping')
  async stopTypingReceiver(
    @MessageBody() typingDTO: TypingDTO
  ){
    const receiverSocketId = this.onlineUsers.get(typingDTO.receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('stopTyping', typingDTO.receiverId);
    }
  }
  @SubscribeMessage('getAllChatMessages')
  getAllChatMessages(@MessageBody() user: any) {
    const socketId = this.onlineUsers.get(user.senderId);
    if(socketId){
      return this.chatMessageService.getAllChat(user.senderId);
    }
    throw new UnauthorizedException()
  }


  @SubscribeMessage('findOneChatMessage')
  findOne(@MessageBody() id: number) {
    return this.chatMessageService.findOne(id);
  }

  @SubscribeMessage('updateChatMessage')
  update(@MessageBody() updateChatMessageDto: UpdateChatMessageDto) {
    return this.chatMessageService.update(updateChatMessageDto.id, updateChatMessageDto);
  }

  @SubscribeMessage('removeChatMessage')
  remove(@MessageBody() id: number) {
    return this.chatMessageService.remove(id);
  }
}
