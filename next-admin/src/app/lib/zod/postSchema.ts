import * as z from "zod";

export const UpdatePostSchema = z.object({
    id: z.preprocess((val) => {
        if (typeof val === 'string') {
        return parseInt(val);
        }
        return val;
    }, z.number()),
    title: z.string(),
    authorId: z.string(),
    content: z.string(),
    thumbnail: z.string(),
    published: z
        .string()
        .optional()
        .transform((val) => val === 'on'),
    createdAt: z.preprocess((val) => {
        if (typeof val === 'string' || val instanceof Date) {
        return new Date(val);
        }
        return val;
    }, z.date())
})

export const CreatePostSchema = z.object({
    title: z.string().trim().min(1, 'Title is required'),
    authorId: z.string().trim(),
    content: z.string().trim().min(1, 'Content is required'),
    thumbnail: z.string().trim(),
    published: z
        .string()
        .optional()
        .transform((val) => val === 'on'),
    createdAt: z.preprocess((val) => {
        if (typeof val === 'string' || val instanceof Date) {
        return new Date(val);
        }
        return val;
    }, z.date())
})