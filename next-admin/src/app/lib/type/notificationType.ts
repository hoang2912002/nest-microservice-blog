
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