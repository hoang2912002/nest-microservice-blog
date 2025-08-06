import { errorResponse, successResponse } from "@/app/helper/common";
import { getCookie } from "../session";
import { HttpStatus } from "@/app/helper/httpStatus";

export const FetchGraphQL = async (query:string, variables={}, isPublic=false) => {
    const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL!
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    }   
    if(!isPublic){
        const cookie = await getCookie()
        headers["Authorization"] = `Bearer ${cookie}`;
    }
    const res = await fetch(`${backendURL}/graphql`,{
        method:'POST',
        headers,
        credentials: 'include',
        body:JSON.stringify({
            query,
            variables,
            isPublic
        }),
        
    })
    console.log(res)
    const result = await res.json();
    if(result.data){
        return successResponse(result.data)
        // throw new Error(result.message)
    }
    else{
       return errorResponse('Lỗi máy chủ!',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}