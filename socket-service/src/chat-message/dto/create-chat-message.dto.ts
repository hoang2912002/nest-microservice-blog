import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateChatMessageDto {
    @IsString()
    senderId: string;

    @IsString()
    @IsOptional()
    receiverId: string;

    @IsString()
    content: string;

    @IsBoolean()
    read: boolean

    @IsString()
    status: string
}

export class TypingDTO {
    @IsString()
    senderId: string;

    @IsString()
    receiverId: string;
}