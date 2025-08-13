import { CommentType } from "./modelType";

export type DialogCommentState = {
    edit: boolean;
    delete: boolean;
    view: boolean;
    create: boolean
}
export type DialogCommentValue = {
    view: CommentType,
    edit: CommentType,
    delete: CommentType,
    create: CommentType
}

export type CreateCommentState = 
    | {
        data:{
            content?:string,
            authorId?: string;
            postId?: string | number;
            userName: string;
        };
        errors?:{
            content?: string[];
            authorId?: string[];
            postId?: string[] | number[];
            userName: boolean[];
        };
        message?:string
        ok?: boolean
    }
    | undefined

export type UpdateCommentState = 
    | {
        data:{
            content?:string,
            authorId?: string;
            postId?: string | number;
            userName: string;
        };
        errors?:{
            content?: string[];
            authorId?: string[];
            postId?: string[] | number[];
            userName: boolean[];
        };
        message?:string
        ok?: boolean
    }
    | undefined