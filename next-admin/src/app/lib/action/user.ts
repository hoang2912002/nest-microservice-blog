'use server'
import { convertTakeSkip } from "@/app/helper/common"
import { fetchAuthRestApi } from "../api/fetchRestAPI"
import { CreateUserState, DeleteUserState, UpdateUserState } from "../type/useType"
import { CreateUserSchema, DeleteUserSchema, UpdateUserSchema } from "../zod/userSchema"

export const getAllAuthor = async () => {
    const data = await fetchAuthRestApi(null,'user/getAllAuthor','GET',"",false)
    return data?.data
}

export const getAllUser = async ({
    page,
    pageSize
}:{
    page: number,
    pageSize : number
}) => {
    const { skip, take } = await convertTakeSkip({page,pageSize})
    const data = await fetchAuthRestApi({skip,take},'user/getAllUserTest', 'POST', "", false)
    return data?.data
}

export const createUser = async(
    state: CreateUserState,
    formData:FormData
) => {
    const validate = await CreateUserSchema.safeParse(Object.fromEntries(formData.entries()))
    if(!validate.success){
        const errors = validate.error.issues;
        const paths = errors.map(err => err.path.join('.'));
        return {
            errorFields: paths
        }
    }
    const data = await fetchAuthRestApi({input:validate.data},"user/createUser_ByAdmin","POST","",false)
    return data?.data
}

export const updateUser = async(
    state: UpdateUserState,
    formData:FormData
) => {
    const validate = await UpdateUserSchema.safeParse(Object.fromEntries(formData.entries()))
    if(!validate.success){
        const errors = validate.error.issues;
        const paths = errors.map(err => err.path.join('.'));
        return {
            errorFields: paths
        }
    }
    const data = await fetchAuthRestApi({input:validate.data},"user/updateUser_ByAdmin","POST","",false)
    return data?.data
}

export const deleteUser = async (
    state: DeleteUserState,
    formData: FormData
) => {
    const validate = DeleteUserSchema.safeParse(Object.fromEntries(formData.entries()))
    if(!validate.success){
        const errors = validate.error.issues;
        const paths = errors.map(err => err.path.join('.'));
        return {
            errorFields: paths
        }
    }
    const data = await fetchAuthRestApi({input:validate.data},"user/deleteUser_ByAdmin","POST","",false)
    return data?.data
}