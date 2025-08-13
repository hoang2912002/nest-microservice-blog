import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateChatMessageDto {
    @IsString()
    @IsOptional()
    chatSessionId: string

    @IsString()
    senderId: string

    @IsString()
    @IsOptional()
    receiverId?: string

    @IsString()
    content: string

    @IsBoolean()
    read: boolean

    @IsString()
    status: string
}
