import z from "zod";

export const CreateCommentSchema = z.object({
    content: z.string().min(1),
    authorId: z.string(),
    postId: z.preprocess((val) => {
        if(typeof val === 'string') return parseInt(val)
        return val;
    },z.number()),
    userName: z.string()
})

export const UpdateCommentSchema = z.object({
    id: z.preprocess((val) => {
        if(typeof val === 'string') return parseInt(val)
        return val;
    },z.number()),
    content: z.string().min(1),
    authorId: z.string(),
    postId: z.preprocess((val) => {
        if(typeof val === 'string') return parseInt(val)
        return val;
    },z.number()),
    userName: z.string()
})