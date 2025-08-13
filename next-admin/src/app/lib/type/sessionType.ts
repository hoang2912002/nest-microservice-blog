export type Session = {
    access_token: string,
    user: SessionUser
}
export type SessionUser = {
    email:string,
    _id:string,
    name:string,
    avatar?:string,
    roleId?:string
}