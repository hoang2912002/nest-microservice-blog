"use client";

import { signIn } from "@/app/lib/action/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useActionState, useEffect } from "react";
import { toast } from "sonner"

const SignInForm = () => {
    const [state, action] = useActionState(signIn, undefined)
    useEffect(()=>{
        if (state?.message && state?.ok === true){
            toast.success(state?.message)
        }
        else if(state?.message){
            toast.error(state?.message)
        }
    },[state])
    return (
        <>
            <div className="flex flex-col min-h-[50vh] h-full w-full items-center justify-center px-4 mt-30">
            <Card className="mx-auto max-w-sm min-w-[30vh]">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Enter your email and password to login to your account.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form action={action} className="space-y-8">
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium">
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="username"
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
                                    <Link
                                        href="#"
                                        className="ml-auto inline-block text-sm underline"
                                    >
                                        Forgot your password?
                                    </Link>
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
                            {!!state?.errors?.password && (
                                <p className="text-red-500 text-sm">{state.errors.password}</p>
                            )}

                            <Button type="submit" className="w-full">
                                Login
                            </Button>
                            <Button variant="outline" className="w-full">
                                Login with Google
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{' '}
                        <Link href="#" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
        </>
    );
}

export default SignInForm;