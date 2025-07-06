import { print } from "graphql"
import { FetchGraphQL } from "../api/fetchGraphAPI"
import { convertTakeSkip } from "../helper"
import { GET_ALL_POST } from "../graphQuery/post"
import { Post } from "../type/modelTypes"

export const getAllPost = async ({page,pageSize}:{page?:number,pageSize?:number}) => {
    const {skip,take} = await convertTakeSkip({page,pageSize})
    const data = await FetchGraphQL(print(GET_ALL_POST),{skip,take},true)
    console.log(data)
    return {
       post: data?.data?.post as Post[],
       countAllPost:data?.data?.countAllPost
    }
}