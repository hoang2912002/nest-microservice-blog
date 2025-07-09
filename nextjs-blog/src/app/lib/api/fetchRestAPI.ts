import { HttpStatus } from "../error";
import { errorResponse, successResponse } from "../helper";

export const fetchRestAPI = async (query:any,subUrl:string,method="POST") => {
    const url = await process.env.NEXT_PUBLIC_BACKEND_URL!;
    const res = await fetch(`${url}/${subUrl}`,{
        method,
        headers:{
            "Content-Type": "application/json",
        },
        body:JSON.stringify(
            query,
        ),
        credentials: 'include',
    })
    const result = await res.json();
    if(result.data && !result.errorField){
        return successResponse(result.data)
        // throw new Error(result.message)
    }
    else{
        if(result.errorField){
            return errorResponse(result.message,HttpStatus.INTERNAL_SERVER_ERROR,result.errorField)
        }
        return errorResponse('Lỗi máy chủ!',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}