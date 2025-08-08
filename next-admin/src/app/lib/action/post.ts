'use server'
import { convertTakeSkip, fileToBase64 } from "@/app/helper/common"
import { FetchGraphQL } from "../api/fetchGraphAPI"
import {
  print
} from 'graphql';
import { CREATE_POST, DELETE_POST, EDIT_POST_BY_ID, GET_ALL_ID_TITLE_POST, GET_ALL_POST, MERGE_FILE_CHUNK, UPLOAD_FILE_CHUNK } from "../graphQuery/post";
import { CreatePostState, UpdatePostState } from "../type/postType";
import { CreatePostSchema, UpdatePostSchema } from "../zod/postSchema";
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
        input: {
            ...validate.data,
            createdAt: new Date(validate?.data?.createdAt).toISOString()
        }
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

export const deletePost = async (id: string | number) => {
    const data = await FetchGraphQL(
        print(DELETE_POST),{
            id: typeof id === 'string' ? parseInt(id) : id
        }, false
    )
    return data
}

export const createPost = async (
    state: CreatePostState,
    formData: FormData
) => {
    const validate = CreatePostSchema.safeParse(Object.fromEntries(formData.entries()))
    if(validate?.error){
        const errors = validate.error.issues; // Đây là mảng chi tiết
        const paths = errors.map(err => err.path.join('.')); // ["title", "content", "createdAt"]
        return {
            errorFields: paths
        }
    }
    const data = await FetchGraphQL(print(CREATE_POST),{
        input: {
            ...validate.data,
            createdAt: new Date(validate.data.createdAt).toISOString()
        }
    },false)
    return data?.data?.create
}

export const getAllPost_ForComment = async () => {
    const data = await FetchGraphQL(print(GET_ALL_ID_TITLE_POST),{},false)
    return data?.data?.getAllPost_ForComment
}