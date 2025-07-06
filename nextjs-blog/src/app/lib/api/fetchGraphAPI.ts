import { HttpStatus } from "../error";
import { errorResponse, successResponse } from "../helper";

export const FetchGraphQL = async (query:string,variables={},isPublic=false) => {
    const res = await fetch(`${process.env.BACKEND_URL}/graphql`,{
        method:'POST',
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify({
            query,
            variables,
            isPublic
        })
    })
    const result = await res.json();
    if(result.data){
        return successResponse(result.data)
        // throw new Error(result.message)
    }
    else{
       return errorResponse('Lỗi máy chủ!',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}