import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationGateway } from './notification/notification.gateway';
import { RedisModule } from './redis/redis.module';
import { NotificationModule } from './notification/notification.module';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyModule } from './clientModule';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    RedisModule, 
    NotificationModule, 
    ChatMessageModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClientProxyModule,
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService, NotificationGateway],
})
export class AppModule {}
