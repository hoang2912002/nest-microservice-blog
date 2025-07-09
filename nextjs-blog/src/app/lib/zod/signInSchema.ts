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