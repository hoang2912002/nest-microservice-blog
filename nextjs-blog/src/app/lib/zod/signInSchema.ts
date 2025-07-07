import * as z from "zod";

export const signInSchema = z.object({
  username: z.string().email(),
  password: z.string().min(6).trim()
});