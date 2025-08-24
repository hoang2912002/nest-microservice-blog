import z from "zod";

export const CreateNotificationSchema = z.object({
    content: z.string(),
    type: z.string(),
    postId: z.preprocess((val) => {
        if(typeof val === 'string'){
            return parseInt(val)
        }
        return val
    },z.number()),
    senderId: z.string(),
    receiverId: z.string(),
    commentId: z.preprocess((val) => {
        if(typeof val === 'string'){
            return parseInt(val)
        }
        return val
    },z.number()),
    isRead: z.preprocess((val) => {
        if(val === 'on') return true
        return false
    },z.boolean())
})

export const UpdateNotificationSchema = z.object({
    id: z.preprocess((val) => {
        if(typeof val === 'string'){
            return parseInt(val)
        }
        return val
    },z.number()),
    content: z.string(),
    type: z.string(),
    postId: z.preprocess((val) => {
        if(typeof val === 'string'){
            return parseInt(val)
        }
        return val
    },z.number()),
    senderId: z.string(),
    receiverId: z.string(),
    commentId: z.preprocess((val) => {
        if(typeof val === 'string'){
            return parseInt(val)
        }
        return val
    },z.number()),
    isRead: z.preprocess((val) => {
        if(val === 'on') return true
        return false
    },z.boolean())
})