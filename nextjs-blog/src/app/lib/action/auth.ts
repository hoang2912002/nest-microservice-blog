import { revalidatePath } from "next/cache";
import { fetchRestAPI } from "../api/fetchRestAPI";
import { SignInFormState } from "../type/formState";
import { signInSchema } from "../zod/signInSchema";
import { redirect } from "next/navigation";

export async function signIn (
    state: SignInFormState,
    formData: FormData
): Promise<SignInFormState> {
    const validate = signInSchema.safeParse(Object.fromEntries(formData.entries()))
    if(!validate.success)
    return {
        data: Object.fromEntries(formData.entries()),
        errors: validate.error.flatten().fieldErrors
    }
    const data = await fetchRestAPI(Object.fromEntries(formData.entries()),'auth/login','POST')
    if(!data) 
    return {
      data: Object.fromEntries(formData.entries()),
      message: "Something went wrong",
    };
    
    // revalidatePath("/")
    redirect("/");
}

export async function getSession() {
    const cookie = await fetchRestAPI({},'auth/getSession','POST')
    if(!cookie) return null
}