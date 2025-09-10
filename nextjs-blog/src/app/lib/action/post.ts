'use server'
import { print } from "graphql"
import { FetchGraphQL } from "../api/fetchGraphAPI"
import { convertTakeSkip } from "../helper"
import { GET_ALL_POST, GET_POST_BY_ID, GET_POST_FOR_ELASTIC } from "../graphQuery/post"
import { Post } from "../type/modelTypes"
import { GET_ALL_POST_COMMENT } from "../graphQuery/comment"

export const getAllPost = async ({page,pageSize}:{page?:number,pageSize?:number}) => {
    const {skip,take} = await convertTakeSkip({page,pageSize})
    const data = await FetchGraphQL(print(GET_ALL_POST),{skip,take},true)
    return {
       post: data?.data?.post.edges as Post[],
       countAllPost:data?.data?.countAllPost
    }
}

export const getPostById = async (id:number) => {
    const data = await FetchGraphQL(print(GET_POST_BY_ID),{id},true)
    return data.data.postById as Post
}

export const getPostByElastic = async (content: string,skip: number) => {
    const data = await FetchGraphQL(print(GET_POST_FOR_ELASTIC),{content,skip},true) 
    return {
        post: data?.data?.getAllPost_ForElastic as Post[],
        // post: [],
    }
}