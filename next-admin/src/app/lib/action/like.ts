'use server'
import { convertTakeSkip } from "@/app/helper/common"
import { FetchGraphQL } from "../api/fetchGraphAPI"
import { print } from "graphql"
import { CREATE_LIKE, GET_ALL_LIKE, UPDATE_LIKE } from "../graphQuery/like"
import { CreateLikeState, UpdateLikeState } from "../type/likeType"
import { CreateLikeSchema, UpdateLikeSchema } from "../zod/likeSchema"

export const getAllLike = async ({ 
    page, pageSize 
}:{
    page?: number,
    pageSize?: number
}) => {
    const {skip,take} = await convertTakeSkip({page,pageSize})
    const data = await FetchGraphQL(print(GET_ALL_LIKE),{
        skip,take
    },false)
    return {
        getAllLike_ByAdmin: data?.data?.getAllLike_ByAdmin,
        countAllLike: data?.data?.countAllLike
    }
}

export const updateLike = async (
    state:UpdateLikeState,
    formData: FormData
) => {
    const validate = UpdateLikeSchema.safeParse(Object.fromEntries(formData.entries()))
    if(!validate.success){
        const errors = validate.error.issues;
        const paths = errors.map(err => err.path.join('.'));
        return {
            errorFields: paths
        }
    }
    const data = await FetchGraphQL(print(UPDATE_LIKE),{
            input: validate.data
    })
    return data?.data?.updateLike_ByAdmin
}

export const createLike = async (
    state: CreateLikeState,
    formData: FormData
) => {
    const validate = CreateLikeSchema.safeParse(Object.fromEntries(formData.entries()))
    if(!validate.success){
        const errors = validate.error.issues;
        const paths = errors.map(err => err.path.join('.'));
        return {
            errorFields: paths
        }
    }
    const data = await FetchGraphQL(print(CREATE_LIKE),{
            input: validate.data
    })
    return data?.data?.createLike_ByAdmin
}   