import { convertTakeSkip } from "@/app/helper/common"
import { FetchGraphQL } from "../api/fetchGraphAPI"
import { CREATE_NEW_COMMENT, GET_ALL_COMMENT } from "../graphQuery/comment"
import { print } from "graphql"
import { CreateCommentState } from "../type/commentType"
import { CreateCommentSchema } from "../zod/commentSchema"

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