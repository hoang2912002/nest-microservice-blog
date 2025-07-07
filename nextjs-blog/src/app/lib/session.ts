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
export const createSession = async (session: Session) => {
    // const session = 1
}
const secretKey = process.env.JWT_SECRET_KEY!
const encodedKey = new TextEncoder().encode(secretKey)
export async function getSession() {
    const raw = (await cookies()).get("session")?.value;
    if(!raw) return null
    const cookie = JSON.parse(raw)

    try {
        const {payload} =await jwtVerify(cookie.access_token,encodedKey,{
           algorithms:["HS256"],
        })
        const isExpired = dayjs().unix() >= payload.exp;
        if(isExpired){
            redirect("/auth/signin")
        }
        return cookie.user as Session
        
    } catch (error) {
        console.log(error)
        redirect("/auth/signin")
    }

}