'use server'

import { print } from "graphql"
import { FetchGraphQL } from "../api/fetchGraphAPI"
import { GET_ALL_NOTIFICATION, UPDATE_IS_READ_NOTIFICATION } from "../graphQuery/notification"
import { Comment, Notification } from "../type/modelTypes"

export const getNotification = async ({
    receiverId,
    isRead
}:{
    receiverId:string,
    isRead: boolean
}) => {
    if(!receiverId) throw new Error('Can not found user')
    const data = await FetchGraphQL(print(GET_ALL_NOTIFICATION),{receiverId,isRead})
    return {
        getAllNotification: data?.data?.getAllNotification as Notification,
        countAllNotification: data?.data?.countAllNotification as number
    } 
}

export const updateIsReadComment = async (id: number) => {
    if(!id) throw new Error('Can not found notificationId')
    const data = await FetchGraphQL(print(UPDATE_IS_READ_NOTIFICATION),{id})
    return data
}