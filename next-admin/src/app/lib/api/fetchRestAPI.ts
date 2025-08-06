import { errorResponse, successResponse } from "@/app/helper/common";
import { getCookie } from "../session";
import { HttpStatus } from "@/app/helper/httpStatus";

export const fetchAuthRestApi = async (
    query:any,
    subUrl:string,
    method="POST",
    accessToken="",
    isPublic=false
) => {
    const url = await process.env.NEXT_PUBLIC_BACKEND_URL!; 
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    }
    if(!accessToken || !isPublic){
        const cookie = await getCookie()
        headers["Authorization"] = `Bearer ${cookie}`;
    }
    else if(accessToken){
        headers["Authorization"] = `Bearer ${accessToken}`;
    }
    const options: RequestInit = {
        method,
        headers,
        credentials: 'include',
    };
    if(method && method !== 'GET'){
        options.body = JSON.stringify({
            query,
            isPublic,
        });
    }
    const res = await fetch(`${url}/${subUrl}`,options)
    const result = await res.json();
    if(result.data && !result.errorField){
        return successResponse(result.data)
    }
    else{
        if(result.errorField){
            return errorResponse(result.message,HttpStatus.INTERNAL_SERVER_ERROR,result.errorField)
        }
        return errorResponse('Lỗi máy chủ!',HttpStatus.INTERNAL_SERVER_ERROR)
    }
}