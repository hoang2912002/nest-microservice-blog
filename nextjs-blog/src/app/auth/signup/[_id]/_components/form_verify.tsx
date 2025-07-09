'use client'

import { useActionState, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { signIn, verifyToken } from "@/app/lib/action/auth"
import { CheckBadgeIcon, CheckIcon } from "@heroicons/react/20/solid"

type Props = {
    email: string,
    _id:string,
}

export default function VerifyForm(props:Props) {
    const [step, setStep] = useState<1 | 2>(1)
    const [stateEmail,actionEmail] = useActionState(verifyToken,undefined);

    // useEffect(()=>{
    //     setStep()
    // },[step])
    // const handleSetStep = (step:number | string) => {
    //     setStep(step)
    // }

    return (
        <Card className="max-w-md mx-auto mt-10 p-6 space-y-4 mt-40">
        <div className="text-center text-sm font-semibold text-gray-700 mb-2">
            Bước {step} / 2
        </div>
        <CardHeader className="p-0">
            <CardTitle className="text-2xl">Kích hoạt tài khoản</CardTitle>
            <CardDescription>
                Mã code mã được gửi tới email, vui lòng kiểm tra email của bạn
            </CardDescription>
        </CardHeader>
        {step === 1 && (
            <form className="space-y-4" action={actionEmail}>
            <div>
                <Label>Mã người dùng</Label>
                <Input
                    id="_id"
                    name="_id"
                    placeholder="johndoe@mail.com"
                    type="text"
                    disabled
                    defaultValue={props._id}
                />
                <Input
                    id="_id"
                    name="_id"
                    type="hidden"
                    defaultValue={props._id}
                />
            </div>
            <div>
                <Label>Mã kích hoạt</Label>
                <Input
                    id="codeId"
                    name="codeId"
                    placeholder="1234567"
                    type="text"
                    defaultValue={props._id}
                />
                
            </div>
            <Button type="submit" className="w-full">Gửi mã xác thực</Button>
            </form>
        )}

        {step === 2 && (
            <>
                <div className="text-xl">
                    <div className="flex justify-center items-center text-center gap-x-2">
                        <CheckIcon className="w-5 h-5 text-green-600" />
                        <p>Kích hoạt tài khoản thành công</p>
                    </div>
                        
                    </div>
                <div className="flex justify-between">
                    <Button type="submit" className="w-48" onClick={() => handleSetStep(1)}>Quay lại</Button>
                    <Button type="submit" className="w-48" onClick={() => handleSetStep(2)}>Xác thực</Button>
                </div>
            </>
        )}
        </Card>
    )
}
