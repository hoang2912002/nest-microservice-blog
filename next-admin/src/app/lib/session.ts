'use server'
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Session } from "./type/sessionType";
import dayjs from "dayjs";


const secretKey = process.env.JWT_SECRET_KEY!
const serviceUrl = process.env.NEXT_PUBLIC_SERVICEURL!
const loginBlog = process.env.NEXT_PUBLIC_LOGIN_BLOG!
const encodedKey = new TextEncoder().encode(secretKey)
export async function getSession() {
    const cookie = (await cookies()).get("session")?.value;
    if(!cookie) return redirect(`${loginBlog}/auth/signin?serviceURL=${serviceUrl}`)

    try {
        const {payload} =await jwtVerify(cookie,encodedKey,{
           algorithms:["HS256"],
        })
        const isExpired = dayjs().unix() >= payload.exp;
        if(isExpired){
            redirect(`${loginBlog}/auth/signin?serviceURL=${serviceUrl}`)
        }
        return payload.user as Session
        
    } catch (error) {
        redirect(`${loginBlog}/auth/signin?serviceURL=${serviceUrl}`)
    }

}

export async function getCookie() {
    return (await cookies()).get('session')?.value
}

export async function handleToggleSlideBar() {
    const current =(await cookies()).get("sidebar_state")?.value;
    return current as boolean | undefined
}