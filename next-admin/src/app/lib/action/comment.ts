'use server'
import { convertTakeSkip } from "@/app/helper/common"
import { FetchGraphQL } from "../api/fetchGraphAPI"
import { CREATE_NEW_COMMENT, GET_ALL_COMMENT, GET_ALL_COMMENT_FOR_SELECT, UPDATE_COMMENT } from "../graphQuery/comment"
import { print } from "graphql"
import { CreateCommentState, UpdateCommentState } from "../type/commentType"
import { CreateCommentSchema, UpdateCommentSchema } from "../zod/commentSchema"
import { getSession } from "../session"

export const getAllComment = async ({
    page,
    pageSize
}:{
    page?:number,
    pageSize?:number
}) => {
    const {skip,take} = await convertTakeSkip({page,pageSize})
    const data = await FetchGraphQL(print(GET_ALL_COMMENT),{
        skip,take
    },true)
    return {
        getAllComment_ByAdmin: data?.data?.getAllComment_ByAdmin as any, 
        countAllComment: data?.data?.countAllComment as number
    }
}

export const createComment = async (
    state: CreateCommentState,
    formData: FormData
) => {
    const cookies = await getSession()
    formData.set('userName',cookies?.name)
    const validate = CreateCommentSchema.safeParse(Object.fromEntries(formData.entries()))
    if(validate?.error){
        const errors = validate.error.issues;
        const paths = errors.map(err => err.path.join('.'));
        return {
            errorFields: paths
        }
    }
    const data = await FetchGraphQL(print(CREATE_NEW_COMMENT),{
        input: validate.data
    })
    return data?.data?.createNewComment
}

export const updateComment = async (
    state: UpdateCommentState,
    formData:FormData
) => {
    const validate = UpdateCommentSchema.safeParse(Object.fromEntries(formData.entries()))
    if(validate?.error){
        const errors = validate.error.issues;
        const paths = errors.map(err => err.path.join('.'));
        return {
            errorFields: paths
        }
    }
    const data = await FetchGraphQL(print(UPDATE_COMMENT),{
        input: validate.data
    })
    return data?.data?.updateComment
}

export const getAllComment_ForSelect = async (take: number) => {
    const data = await FetchGraphQL(print(GET_ALL_COMMENT_FOR_SELECT),{take},false)
    return data?.data?.getAllCommentForSelect
}