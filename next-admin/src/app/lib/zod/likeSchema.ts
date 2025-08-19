import z from "zod";

export const UpdateLikeSchema = z.object({
    id: z.preprocess((val) => {
            if(typeof val === 'string') return parseInt(val)
            return val;
        },z.number()),
    userId: z.string(),
    postId: z.preprocess((val) => {
        if(typeof val === 'string') return parseInt(val)
        return val;
    },z.number()),
    newPostId: z.preprocess((val) => {
        if(typeof val === 'string') return parseInt(val)
        return val;
    },z.number()),
    newUserId: z.string(),
})

export const CreateLikeSchema = z.object({
    userId: z.string(),
    postId: z.preprocess((val) => {
        if(typeof val === 'string') return parseInt(val)
        return val;
    },z.number()),
})