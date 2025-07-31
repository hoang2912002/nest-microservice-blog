import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<ChatMessage>;
@Schema({ timestamps: true })
export class ChatMessage {
    @Prop()
    chatSessionId: string

    @Prop()
    senderId: string

    @Prop()
    receiverId: string

    @Prop()
    content: string

    @Prop({default:false})
    read: boolean

    @Prop()
    status: string
}
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
