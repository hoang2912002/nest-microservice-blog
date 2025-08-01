// notification.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';

@WebSocketGateway({
  namespace:"/notification",
  cors: { origin: '*', methods: ['GET', 'POST'] },
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly redisService: RedisService) {}
  @WebSocketServer()
  server: Server;

  // userId -> socketId mapping
  private onlineUsers = new Map<string, string>();
  onModuleInit() {
    this.redisService.subscribe('comment_notification', (dataString) => {
      const data = typeof dataString === 'string' ? JSON.parse(dataString) : dataString;
      const { senderId, content } = data;
      this.sendNotificationToUser(senderId, { content });
    });
  }
  async handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) this.onlineUsers.set(userId, client.id);
  }

  async handleDisconnect(client: Socket) {
    const userId = [...this.onlineUsers.entries()].find(([_, socketId]) => socketId === client.id)?.[0];
    if (userId) this.onlineUsers.delete(userId);
  }

  sendNotificationToUser(userId: string, data: any) {
    const socketId = this.onlineUsers.get(userId);
    if (socketId) {
      this.server.to(socketId).emit('notification', data);
    }
  }

  @SubscribeMessage('notification_created')
  async handleNotification(@ConnectedSocket() client: Socket, @MessageBody() data: any): Promise<string> {
    console.log(client); 
    // logs the id of the client
    const message:string = data.message;
    return message;
  }
}
