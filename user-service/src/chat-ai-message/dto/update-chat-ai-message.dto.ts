import { PartialType } from '@nestjs/mapped-types';
import { CreateChatAiMessageDto } from './create-chat-ai-message.dto';

export class UpdateChatAiMessageDto extends PartialType(CreateChatAiMessageDto) {}
