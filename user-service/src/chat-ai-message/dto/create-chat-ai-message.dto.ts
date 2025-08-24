import { IsString } from "class-validator";

export class CreateChatAiMessageDto {
    @IsString()
    message: string
}
