import { Module } from '@nestjs/common';
import { ChatAiMessageService } from './chat-ai-message.service';
import { ChatAiMessageController } from './chat-ai-message.controller';

@Module({
  controllers: [ChatAiMessageController],
  providers: [ChatAiMessageService],
})
export class ChatAiMessageModule {}
