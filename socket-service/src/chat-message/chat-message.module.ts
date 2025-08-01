import { Module } from '@nestjs/common';
import { ChatMessageService } from './chat-message.service';
import { ChatMessageGateway } from './chat-message.gateway';
import { RedisModule } from 'src/redis/redis.module';
import { ClientProxyModule } from 'src/clientModule';

@Module({
  imports:[RedisModule,ClientProxyModule],
  providers: [ChatMessageGateway, ChatMessageService],
})
export class ChatMessageModule {}
