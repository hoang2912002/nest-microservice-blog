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
    }
    | undefined