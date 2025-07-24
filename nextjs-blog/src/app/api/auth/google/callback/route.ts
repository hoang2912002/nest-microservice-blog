import { fetchAuthRestApi } from "@/app/lib/api/fetchRestAPI"
import { createSession } from "@/app/lib/session"
import { redirect } from "next/navigation"
import  { NextResponse } from "next/server"

export async function GET(req: NextResponse){
    const {searchParams} = new URL(req.url)
    const userId = searchParams.get("userId")
    const name = searchParams.get("name")
    const avatar = searchParams.get("avatar")
    const accessToken = searchParams.get("accessToken")
    const email = searchParams.get("email")
    if(!accessToken || !userId) throw new Error('Login Google fail');
    const data = await fetchAuthRestApi({userId},'auth/verify_google_token','GET',accessToken,false)
    if(data.success === false){
        const notificationError = "Lỗi không đăng nhập Google được";
        redirect(`/auth/signin?callbackError=${notificationError}`)
    }
    else{
        await createSession({
            user:{
                _id:userId,
                name:name ?? "",
                avatar: avatar ?? undefined,
                email:email ?? ""
            },
            accessToken
        })
        redirect('/')
    }

}
