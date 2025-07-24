export type SignInFormState = 
    | {
        data:{
            email?: string,
            password?: string
        };
        errors?:{
           email?: string[],
            password?: string[] 
        };
        message?:string
        ok?: boolean
        fieldError?:string
    }
    | undefined

export type VerifyTokenState = 
    | {
        data: {
            _id?: string,
            codeId?:string
        };
        errors?:{
            _id?: string[],
            codeId?:string[]
        };
        message?:string
        ok?: boolean
    }

    | undefined

export type SignUpFormState = 
    | {
        data:{
            name?:string,
            email?: string,
            gender?: string,
            avatar?: string,
            password?: string,
            _id?:string
        };
        errors?:{
            name?:string[],
            email?: string[],
            gender?: string[],
            avatar?: string[],
            password?: string[]
        };
        message?:string
        ok?: boolean
    }
    | undefined


export type CreateCommentFormState = 
    |
        {
            data:{
                postId?:string,
                content?:string,
                authorId?:string,
                parentId?:string | null,
                
            };
            errors?:{
                postId?:string[],
                content?:string[],
                authorId?:string[],
                parentId?:string[] | null[],
            };
            message?:string
            ok?: boolean
        }
    | undefined