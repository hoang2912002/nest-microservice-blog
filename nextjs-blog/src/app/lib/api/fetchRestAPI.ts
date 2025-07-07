import { HttpStatus } from "../error";
import { errorResponse, successResponse } from "../helper";

export const fetchRestAPI = async (query:any,subUrl:string,method="POST") => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/${subUrl}`,{
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
    console.log({result})
    if(result.data){
        return successResponse(result.data)
        // throw new Error(result.message)
    }
    else{
       return errorResponse('Lỗi máy chủ!',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}