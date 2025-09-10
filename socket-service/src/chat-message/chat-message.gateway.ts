import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { ChatMessageService } from './chat-message.service';
import { CreateChatMessageDto, TypingDTO } from './dto/create-chat-message.dto';
import { UpdateChatMessageDto } from './dto/update-chat-message.dto';
import { Server, Socket } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';
import { ClientProxy } from '@nestjs/microservices';
import { USER_SERVICE } from 'src/constants';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { ROLE } from 'src/commont';
import { UserService } from 'src/user/user.service';

@WebSocketGateway({
  namespace:"/chatMessage",
  cors: { origin: '*', methods: ['GET', 'POST'] },
})
export class ChatMessageGateway {
  constructor(
    private readonly chatMessageService: ChatMessageService,
    private readonly userService: UserService,
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
    const role = client.handshake?.query?.role as string;

    const partnerId = createChatMessageDto?.sendToUser ? createChatMessageDto.senderId : createChatMessageDto.receiverId
    let getAllChat = await this.chatMessageService.getAllListChatMessages(partnerId)
    if(createChatMessageDto?.sendToUser){
      //Admin gửi cho user
      client.emit('chatMessage', {messageData:getAllChat, role: ROLE.ADMIN});
      client.emit(`chatMessage:${savedMessage.chatSessionId}`,savedMessage)
      const userSocketId = this.onlineUsers.get(createChatMessageDto.receiverId.toString());
      if (userSocketId) {
          this.server.to(userSocketId).emit('chatMessage', {messageData:savedMessage, role});
      }
    }
    else{
      //User gửi cho admin
      client.emit('chatMessage', {messageData:savedMessage, role});
      if ([ROLE.ADMIN,ROLE.USER].includes(role)) {
        if (!savedMessage.receiverId) {
            // Gửi cho tất cả admin online
            const admins = await this.userService.getAllAdminList();
            admins.forEach(async (admin) => {
              getAllChat = await this.chatMessageService.getAllListChatMessages(admin._id)
                const adminSocketId = this.onlineUsers.get(admin._id.toString());
                if (adminSocketId) {
                  this.server.to(adminSocketId).emit('chatMessage', {messageData:getAllChat, role:admin.roleId });
                  this.server.to(adminSocketId).emit(
                    `chatMessage:${savedMessage.chatSessionId}`,
                    savedMessage
                  );
                }
            });
        } else {
            // Gửi riêng cho 1 admin
            // const getAllChat = await this.chatMessageService.getAllListChatMessages(savedMessage.receiverId)
            const adminSocketId = this.onlineUsers.get(savedMessage.receiverId.toString());
            if (adminSocketId) {
              this.server.to(adminSocketId).emit('chatMessage', {messageData:getAllChat, role: ROLE.ADMIN});
              this.server.to(adminSocketId).emit(
                  `chatMessage:${savedMessage.chatSessionId}`,
                  savedMessage
                );
            }
        }
      } 
    }
    // else if (role === ROLE.ADMIN) {
    //     // Gửi cho user
    //     const userSocketId = this.onlineUsers.get(createChatMessageDto.receiverId.toString());
    //     if (userSocketId) {
    //         this.server.to(userSocketId).emit('chatMessage', {messageData:getAllChat, role});
    //     }
    // }
    return {messageData:savedMessage, role};
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

  //-------------admin--------------------------
  @SubscribeMessage("getAllListChatMessages")
  getAllListChatMessages(
    @MessageBody() user: any,
  ){
    const socketId = this.onlineUsers.get(user.receiverId);
    if(socketId){
      return this.chatMessageService.getAllListChatMessages(user.receiverId);
    }
    throw new UnauthorizedException()
  }


  @SubscribeMessage('getMessagesBySessionId')
  getMessagesBySessionId(@MessageBody() user: any) {
    const socketId = this.onlineUsers.get(user.receiverId);
    if(socketId){
      return this.chatMessageService.getMessagesBySessionId(user.chatSessionId);
    }
    throw new UnauthorizedException()
  }

  @SubscribeMessage("setStateMessage")
  async setStateMessage(
    @MessageBody() user: any,
  ){
    const socketId = this.onlineUsers.get(user.receiverId);
    if(socketId){
      const isRead_Message = await this.chatMessageService.setStateMessage(user.chatSessionId,user.receiverId)
      if(isRead_Message){
        return await this.chatMessageService.getAllListChatMessages(user.receiverId);
      }
    }
    throw new UnauthorizedException()
  }
}
