"use client";

import { signIn, signUp } from "@/app/lib/action/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner"
import { Loader2 } from "lucide-react";

const SignUpForm = () => {
    const [image,setImage] = useState("")
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    const wrappedAction = async (prevState: any, formData: FormData) => {
        setIsPending(true); // Bắt đầu loading
        const result = await signUp(prevState, formData);
        return result;
    };
    const [state, action] = useActionState(wrappedAction, undefined)
    useEffect(()=>{
        if (state?.message && state?.ok === true){
            console.log(state)
            toast.success(state?.message)
            // router.push('/auth/verify');

            // Delay nhẹ để Next.js render layout trước
            // setTimeout(() => {
                setIsPending(false); // Chỉ hết pending sau khi push xong
                router.push(`/auth/signup/${state.data?._id}`);
            // }, 500);
        }
        else if(state?.message){
            toast.error(state?.message)
        }
    },[state])
    return (
        <>
            <div className="flex flex-col min-h-[100vh] h-full w-full items-center justify-center px-4 mt-30">
            <Card className="mx-auto max-w-sm min-w-[50vh]">
                <CardHeader>
                    <CardTitle className="text-2xl">Register</CardTitle>
                    <CardDescription>
                        Enter your information to create your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-8">
                        <fieldset disabled={isPending} className="grid gap-4">

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <label htmlFor="name" className="text-sm font-medium">
                                        Name
                                    </label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Nguyễn Văn A"
                                        type="text"
                                        defaultValue={state?.data?.name}
                                    />
                                </div>
                                {!!state?.errors?.name && (
                                    <p className="text-red-500 text-sm">{state.errors.name}</p>
                                )}
                                <div className="grid gap-2">
                                    <label htmlFor="email" className="text-sm font-medium">
                                        Email
                                    </label>
                                    <Input
                                        id="email"
                                        name="email"
                                        placeholder="johndoe@mail.com"
                                        type="email"
                                        autoComplete="email"
                                        defaultValue={state?.data?.email}
                                        
                                    />
                                </div>
                                {!!state?.errors?.email && (
                                    <p className="text-red-500 text-sm">{state.errors.email}</p>
                                )}
                                

                                <div className="grid gap-2">
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="password" className="text-sm font-medium">
                                            Password
                                        </label>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="******"
                                        autoComplete="current-password"
                                        defaultValue={state?.data?.password}
                                    />
                                </div>
                                {!!state?.errors?.name && (
                                    <p className="text-red-500 text-sm">{state.errors.name}</p>
                                )}

                                <div className="grid gap-2">
                                    <label htmlFor="gender" className="text-sm font-medium">
                                        Gender
                                    </label>
                                    <RadioGroup defaultValue="true" className="flex" name="gender">
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="true" id="r1" />
                                            <Label htmlFor="r1">Male</Label>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <RadioGroupItem value="false" id="r2" />
                                            <Label htmlFor="r2">Female</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                {!!state?.errors?.gender && (
                                    <p className="text-red-500 text-sm">{state.errors.gender}</p>
                                )}
                                <div className="grid gap-2">
                                    <div className="flex justify-between items-center">
                                        <label htmlFor="avatar" className="text-sm font-medium">
                                            Avatar
                                        </label>
                                    </div>
                                    <Input
                                        id="avatar"
                                        name="avatar"
                                        type="file"
                                        accept=".png,.jpg,.jpeg"
                                        onChange={(e) => {
                                            if (e.target.files)
                                            setImage(URL.createObjectURL(e.target.files[0]));
                                        }}
                                    />
                                </div>
                                {!!state?.errors?.avatar && (
                                    <p className="text-red-500 text-sm">{state.errors.avatar}</p>
                                )}
                                {(!!image) && (
                                    <Image
                                        src={(!!image ? image : '/no-image.png')}
                                        alt="user-avatar"
                                        width={200}
                                        height={150}
                                    />
                                )}

                                <Button type="submit" className="w-full"  disabled={isPending}>
                                    {isPending ? (
                                        <span className="flex items-center justify-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Signing Up...
                                        </span>
                                    ) : (
                                        "Sign Up"
                                    )}
                                </Button>
                            </div>
                        </fieldset>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        If you have an account?{' '}
                        <Link href="#" className="underline">
                            Sign In
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
        </>
    );
}

export default SignUpForm;