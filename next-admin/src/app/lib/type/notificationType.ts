
import { CommentType, NotificationType } from "./modelType";

export type DialogNotificationState = {
    edit: boolean;
    delete: boolean;
    view: boolean;
    create: boolean
}
export type DialogNotificationValue = {
    view: NotificationType,
    edit: NotificationType,
    delete: NotificationType,
    create: NotificationType
}
export type CreateNotificationState = 
| {
     data:{
            content?:string,
            type?: string;
            postId?: number;
            senderId?: string;
            receiverId?: string;
            commentId?: number;
            isRead?: boolean
        };
        errors?:{
            content?:string[],
            type?: string[];
            postId?: number[];
            senderId?: string[];
            receiverId?: string[];
            commentId?: number[];
            isRead?: boolean[]
        };
        message?:string
        ok?: boolean
}
| undefined

export type UpdateNotificationState = 
| {
     data:{
            id?: string,
            content?:string,
            type?: string;
            postId?: number;
            senderId?: string;
            receiverId?: string;
            commentId?: number;
            isRead?: boolean
        };
        errors?:{
            id?: string[],
            content?:string[],
            type?: string[];
            postId?: number[];
            senderId?: string[];
            receiverId?: string[];
            commentId?: number[];
            isRead?: boolean[]
        };
        message?:string
        ok?: boolean
}
| undefined