import { LikeType } from "./modelType";

export type DialogLikeState = {
    edit: boolean;
    delete: boolean;
    view: boolean;
    create: boolean
}
export type DialogLikeValue = {
    view: LikeType,
    edit: LikeType,
    delete: LikeType,
    create: LikeType
}

export type UpdateLikeState = 
    | {
        data:{
            userId: string;
            postId: number
        };
        errors?:{
            userId: string[];
            postId: number[];
        };
        message?:string
        ok?: boolean
    }
    | undefined

export type CreateLikeState = 
    | {
        data:{
            userId: string;
            postId: number
        };
        errors?:{
            userId: string[];
            postId: number[];
        };
        message?:string
        ok?: boolean
    }
    | undefined