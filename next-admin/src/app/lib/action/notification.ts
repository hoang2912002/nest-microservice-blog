'use server'
import { convertTakeSkip } from "@/app/helper/common"
import { FetchGraphQL } from "../api/fetchGraphAPI"
import { print } from "graphql"
import { CREATE_NOTIFICATION_BY_ADMIN, GET_ALL_NOTIFICATION_BY_ADMIN } from "../graphQuery/notification"
import { CreateNotificationState } from "../type/notificationType"
import { CreateNotificationSchema } from "../zod/notificationSchema"

export const getAllNotification = async ({
    page,
    pageSize
}:{
    page?: number,
    pageSize?: number
}) => {
    const {skip, take} = convertTakeSkip({page,pageSize})
    const data = await FetchGraphQL(print(GET_ALL_NOTIFICATION_BY_ADMIN),{
        skip, take
    }, false)
    return {
        getAllNotification_ByAdmin: data?.data?.getAllNotification_ByAdmin,
        countAllNotification_ByAdmin: data?.data?.countAllNotification_ByAdmin
    }
}

export const createNotification = async (
    state: CreateNotificationState,
    formData: FormData
) => {
    const validate = CreateNotificationSchema.safeParse(Object.fromEntries(formData.entries()))
    if(!validate.success){
        const errors = validate.error.issues;
        const paths = errors.map(err => err.path.join('.'));
        return {
            errorFields: paths
        }
    }
    const data = await FetchGraphQL(print(CREATE_NOTIFICATION_BY_ADMIN),{
        input: validate.data
    },false)
    return data?.data?.createNotification_ByAdmin
}