import { UserType } from "./modelType";

export type DialogUserState = {
    edit: boolean;
    delete: boolean;
    view: boolean;
    create: boolean
}
export type DialogUserValue = {
    view: UserType,
    edit: UserType,
    delete: UserType,
    create: UserType
}

export type CreateUserState = 
    | {
        data:{
            name: string,
            gender: boolean,
            email: string,
            password: string,
            avatar: string,
            roleId: string,
            accountType: string,
            isActive: boolean
        };
        errors?:{
            name?:string[],
            gender?: boolean[];
            email?: string[];
            password?: string[];
            avatar?: string[];
            roleId?: string[];
            accountType?: string[]
            isActive?: boolean[]
        };
        message?:string
        ok?: boolean
    }
    | undefined

    export type UpdateUserState = 
    | {
        data:{
            _id: string,
            name: string,
            gender: boolean,
            email: string,
            avatar: string,
            roleId: string,
            accountType: string,
            isActive: boolean
        };
        errors?:{
            _id?:string[],
            name?:string[],
            gender?: boolean[];
            email?: string[];
            avatar?: string[];
            roleId?: string[];
            accountType?: string[]
            isActive?: boolean[]
        };
        message?:string
        ok?: boolean
    }
    | undefined

    export type DeleteUserState = 
    | {
        data:{
            _id: string,
        };
        errors?:{
            _id?:string[],
        };
        message?:string
        ok?: boolean
    }
    | undefined