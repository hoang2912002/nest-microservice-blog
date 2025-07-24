import * as z from "zod";

export const signInSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6).trim()
});


export const verifyTokenSchema = z.object({
  _id: z.string(),
  codeId: z.string(),
})

export const signUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  gender: z.string().transform(value=>value === 'true'),
  avatar: z.instanceof(File).optional(),
  password: z
    .string()
    .min(6)
    .trim(),
})

export const commentFormSchema = z.object({
  postId: z.string().transform((val) => parseInt(val))
    .refine((val) => !isNaN(val)),
  content: z.string(),
  authorId: z.string(),
  userName: z.string(),
  parentId: z.string()
  .nullable()
  .transform((val) => ([null, undefined].includes(val) ? null : parseInt(val)))
})