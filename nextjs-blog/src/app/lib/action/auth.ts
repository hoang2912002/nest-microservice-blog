'use server'
import { revalidatePath } from "next/cache";
import { fetchRestAPI } from "../api/fetchRestAPI";
import { SignInFormState, SignUpFormState, VerifyToken, VerifyTokenState } from "../type/formState";
import { signInSchema, signUpSchema, verifyTokenSchema } from "../zod/signInSchema";
import { redirect } from "next/navigation";
import { createSession } from "../session";
import { validate } from "graphql";
import { uploadFile } from "../supabase_upload";

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
    if(!data.success) 
    return {
      data: Object.fromEntries(formData.entries()),
      message: data?.message ? data.message : "Something went wrong",
      ok:false,
      fieldError:data?.fieldError 
    };
    // res.cookie("session",JSON.stringify(data),{
        //     httpOnly: true,
        //     secure: true,
        //     expires: expiredAt,
        //     sameSite: 'lax',
        //     path: '/'
        // })
    await createSession(data.data)
    revalidatePath("/")
    redirect("/");
}

export async function getSession() {
    const cookie = await fetchRestAPI({},'auth/getSession','POST')
    if(!cookie) return null
}


export async function verifyToken(
    state:VerifyTokenState,
    formData:FormData
): Promise<VerifyTokenState> {
    const validate = verifyTokenSchema.safeParse(Object.fromEntries(formData.entries()))
    if(!validate.success)
    return {
        data: Object.fromEntries(formData.entries()),
        errors: validate.error.flatten().fieldErrors
    }
    const data = await fetchRestAPI(Object.fromEntries(formData.entries()),'auth/verify_token','POST')
    if(!data.success) 
    return {
      data: Object.fromEntries(formData.entries()),
      message: "Something went wrong",
      ok:false
    };

    return {
        data: data?.data,
        message: "Đã kích hoạt tài khoản thành công",
        ok:true
    }
}

export async function signUp(
    state: SignUpFormState,
    formData: FormData
): Promise<SignUpFormState> {
    const validate = signUpSchema.safeParse(Object.fromEntries(formData.entries())) 
    formData.append("avatar", "");
    if(!validate.success)
    return {
        data: Object.fromEntries(formData.entries()),
        errors: validate.error.flatten().fieldErrors
    }

    let avatar = ""
    if(validate.data.avatar){
        avatar = await uploadFile(validate?.data?.avatar as File) as string
    }
    const payload = {
        ...validate.data,
        avatar,
    }
    const data = await fetchRestAPI(payload,'auth/signUp','POST')
    if(!data.success) {
        return {
          data: Object.fromEntries(formData.entries()),
          message: "Something went wrong",
          ok:false
        };
    }
    else{
        return {
            data: data?.data,
            message: "Đăng ký người dùng thành công",
            ok:true
        }
        // redirect(`/auth/verify/${data?.data?._id}`);
    }

}
