'use server'
import { convertTakeSkip, fileToBase64 } from "@/app/helper/common"
import { FetchGraphQL } from "../api/fetchGraphAPI"
import {
  print
} from 'graphql';
import { EDIT_POST_BY_ID, GET_ALL_POST, MERGE_FILE_CHUNK, UPLOAD_FILE_CHUNK } from "../graphQuery/post";
import { UpdatePostState } from "../type/postType";
import { UpdatePostSchema } from "../zod/postSchema";
import { fetchAuthRestApi } from "../api/fetchRestAPI";
import { PostType } from "../type/modelType";
export const getAllPost = async ({
    page,
    pageSize
}:{
    page?:number,
    pageSize?:number
}) => {
    const {skip,take} = await convertTakeSkip({page,pageSize})
    const data = await FetchGraphQL(print(GET_ALL_POST),{
        skip,take
    },true)
    return {
        getAllPost_ByAdmin: data?.data?.getAllPost_ByAdmin as any, 
        countAllPost: data?.data?.countAllPost as number
    }
}

export const updatePost = async (
    state: UpdatePostState,
    formData: FormData
) => {
    const validate = UpdatePostSchema.safeParse(Object.fromEntries(formData.entries()))
    const data = await FetchGraphQL(print(EDIT_POST_BY_ID),{
        input: validate.data
    },true)
    return data?.data?.update
}


export const uploadChunk = async (base64:File,folderName:string,fileName:string) => {
    const data = await FetchGraphQL(
        print(UPLOAD_FILE_CHUNK),
        {
            file:base64,
            folderName,
            fileName
        },
        false
    );
    return data;
}

export const mergeChunks = async (folderName:string) => {
    const data = await FetchGraphQL(
        print(MERGE_FILE_CHUNK),{
            folderName
        },
        false
    )
    return data;
}