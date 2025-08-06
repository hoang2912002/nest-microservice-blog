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
