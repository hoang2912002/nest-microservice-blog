import { print } from "graphql"
import { FetchGraphQL } from "../api/fetchGraphAPI"

const getListChatMessage = async ({
    receiverId,
    isRead
}:{
    receiverId: string,
    isRead : boolean
}) => {
    if(!receiverId) throw new Error('Can not found user')
    const data = await FetchGraphQL(print(GET_ALL_NOTIFICATION),{receiverId,isRead})
    return {
        getAllNotification: data?.data?.getAllNotification as Notification,
        countAllNotification: data?.data?.countAllNotification as number
    }  
}