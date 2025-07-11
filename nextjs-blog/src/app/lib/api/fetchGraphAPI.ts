import { HttpStatus } from "../error";
import { errorResponse, successResponse } from "../helper";
import { getCookie } from "../session";

export const FetchGraphQL = async (query:string,variables={},isPublic=false) => {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    }
    if(!isPublic){
        const cookie = await getCookie()
        headers["Authorization"] = `Bearer ${cookie}`;
    }
    const res = await fetch(`${process.env.BACKEND_URL}/graphql`,{
        method:'POST',
        headers,
        credentials: 'include',
        body:JSON.stringify({
            query,
            variables,
            isPublic
        }),
        
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