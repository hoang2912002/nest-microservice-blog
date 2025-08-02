import { convertTakeSkip } from "@/app/helper/common"
import { FetchGraphQL } from "../api/fetchGraphAPI"
import {
  print
} from 'graphql';
import { GET_ALL_POST } from "../graphQuery/post";
export const getAllPost = async ({
    page,
    pageSize
}:{
    page?:number,
    pageSize?:number
}) => {
    const {skip,take} = await convertTakeSkip({page,pageSize})
    console.log({skip,take})
    const data = await FetchGraphQL(print(GET_ALL_POST),{
        skip,take
    },true)
    return {
        getAllPost_ByAdmin: data?.data?.getAllPost_ByAdmin as any, 
        countAllPost: data?.data?.countAllPost as number
    }
}