import { PartialType } from '@nestjs/mapped-types';
import { CreateChatMessageDto } from './create-chat-message.dto';
import { IsString } from 'class-validator';

export class UpdateChatMessageDto extends PartialType(CreateChatMessageDto) {}


export class SetStateDTO extends PartialType(CreateChatMessageDto) {
    @IsString()
    chatSessionId:string

    @IsString()
    receiverId: string;
}