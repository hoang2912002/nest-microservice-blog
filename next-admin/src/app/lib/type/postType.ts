import { PostType } from "./modelType";

export type UpdatePostState = 
    | {
        data:{
            title?:string,
            slug?: string;
            authorId?: string;
            content?: string;
            thumbnail?: string | object;
            published: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        errors?:{
            title?:string[],
            slug?: string[];
            authorId?: string[];
            content?: string[];
            thumbnail?: string[] | object[];
            published: boolean[];
            createdAt: Date[];
            updatedAt: Date[];
        };
        message?:string
        ok?: boolean
    }
    | undefined


export type DialogState = {
    edit: boolean;
    delete: boolean;
    view: boolean;
    create: boolean
}
export type DialogValue = {
    view: PostType,
    edit: PostType,
    delete: PostType,
    create: PostType
}


export type CreatePostState = 
    | {
        data:{
            title?:string,
            authorId?: string;
            content?: string;
            thumbnail?: string | object;
            published: boolean;
            createdAt: Date;
        };
        errors?:{
            title?:string[],
            slug?: string[];
            authorId?: string[];
            content?: string[];
            thumbnail?: string[] | object[];
            published: boolean[];
            createdAt: Date[];
            updatedAt: Date[];
        };
        message?:string
        ok?: boolean
    }
    | undefined