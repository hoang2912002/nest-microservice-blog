'use server'
import { cookies } from "next/headers"
import {jwtVerify, SignJWT} from 'jose'
import { redirect } from "next/navigation"
import  dayjs from 'dayjs';
export type Session = {
    access_token: string,
    user: SessionUser
}
export type SessionUser = {
    email:string,
    _id:string,
    name:string,
    avatar?:string
}
export const createSession = async (payload: Session) => {
    const session = await new SignJWT(payload).setProtectedHeader({alg:"HS256"}).
    setIssuedAt().setExpirationTime("7d").sign(encodedKey);

    const expiredAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    (await cookies()).set("session",session,{
        httpOnly:true,
        secure:false,
        expires:expiredAt,
        sameSite:'lax',
        path:'/',
        domain:'.localhost'
    });
}
const secretKey = process.env.JWT_SECRET_KEY!
const encodedKey = new TextEncoder().encode(secretKey)
export async function getSession() {
    const cookie = (await cookies()).get("session")?.value;
    if(!cookie) return null

    try {
        const {payload} =await jwtVerify(cookie,encodedKey,{
           algorithms:["HS256"],
        })
        const isExpired = dayjs().unix() >= payload.exp;
        if(isExpired){
            redirect("/auth/signin")
        }
        return payload.user as Session
        
    } catch (error) {
        redirect("/auth/signin")
    }

}

export async function deleteSession() {
    const deleteCookie = await (await cookies()).delete('session')
    
}
export async function getCookie() {
    return (await cookies()).get("session")?.value
}