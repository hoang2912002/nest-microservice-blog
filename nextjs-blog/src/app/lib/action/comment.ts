'use server'
import { print } from "graphql"
import { FetchGraphQL } from "../api/fetchGraphAPI"
import { convertTakeSkip, escapeRegex } from "../helper"
import { GET_ALL_POST_COMMENT, GET_ALL_POST_LIKE, LIKE_POST, SAVE_POST_COMMENT, UNLIKE_POST } from "../graphQuery/comment"
import { Comment } from "../type/modelTypes"
import { number } from "zod"
import { CreateCommentFormState } from "../type/formState"
import { commentFormSchema } from "../zod/signInSchema"

export const getPostComment = async ({
    postId,
    page,
    pageSize
}:{
    postId:number,
    page?:number,
    pageSize?:number
}) => {
    const {skip,take} = await convertTakeSkip({page,pageSize})
    const data = await FetchGraphQL(print(GET_ALL_POST_COMMENT),{postId,skip,take},true)
    return {
        comments: data?.data?.getAll_PostComment as Comment,
        countAllComment: data?.data?.countAll_PostComment as number

    } 
}

export const getPostLikeData = async ({
    postId,
    userId
}:{
    postId: number
    userId: string
}) =>{
    const data = await FetchGraphQL(print(GET_ALL_POST_LIKE),{postId,userId},true)
    return{
        getAll_PostLike: data?.data.getAll_PostLike as number,
        check_User_LikedPost: data?.data.check_User_LikedPost as boolean

    } 
}

export const unLikePost = async ({
    postId,userId
}:{
    postId:number
    userId:string
}) => {
    const data = await FetchGraphQL(print(UNLIKE_POST),{postId,userId})
    return data
}

export const likePost = async ({
    postId,userId
}:{
    postId:number
    userId:string
}) => {
    const data = await FetchGraphQL(print(LIKE_POST),{postId,userId})
    return data
}

export const createComment = async (
    state:CreateCommentFormState,
    formData:FormData,
): Promise<CreateCommentFormState> => {
    const validate = commentFormSchema.safeParse(
        Object.fromEntries(formData.entries())
    )
    // const cleanedText = validate.data?.content.replace(new RegExp(`^@${validate.data?.userName}\\s*`), "");
    let cleanedText = validate.data?.content;
    const checkUserName = `@${validate.data?.userName}`
    if (validate.data?.content.startsWith(checkUserName)) {
        cleanedText = validate.data?.content.slice(validate.data?.userName.length + 1).trimStart(); // +1 vì có ký tự @
    }
    const data = await FetchGraphQL(print(SAVE_POST_COMMENT),{
        input:{
            ...validate.data,
            content:cleanedText
        }
    })
    if(!data.success) 
    return {
      data: Object.fromEntries(formData.entries()),
      message: "Something went wrong",
      ok:false
    };

    return {
        data: data?.data,
        message: "Thêm bình luận thành công",
        ok:true
    }
}