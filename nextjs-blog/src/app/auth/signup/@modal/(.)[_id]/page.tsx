'use client'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { signIn, verifyToken } from "@/app/lib/action/auth"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useActionState, useEffect, useState } from "react";
import { ArrowPathIcon, CheckIcon } from "@heroicons/react/20/solid"
import { use } from "react";
import { useRouter } from "next/navigation"
type Props = {
    params: Promise<{
        _id: string;
    }>;
    email: string,
    _id:string,
};
const InterceptorVerifyModalPage = (props: Props) => {
    // const _id = (await (params))._id
    const [step, setStep] = useState<1 | 2>(1)
    const route = useRouter()
    const [pending, setPending] = useState(false);
    const [stateEmail,actionEmail] = useActionState(verifyToken,undefined);
    const params = use(props.params);
    const [open, setOpen] = useState(true); // modal ban đầu mở
    useEffect(() => {
        if (stateEmail?.ok === true) {
        setStep(2); // Nếu xác thực thành công, chuyển step
        }
        setPending(false); // Reset loading
    }, [stateEmail]);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Kích hoạt tài khoản</DialogTitle>
                        <DialogDescription>
                            Mã code mã được gửi tới email, vui lòng kiểm tra email của bạn.
                        </DialogDescription>
                    </DialogHeader>
                    {step === 1 && (
                        <>
                        <form className="space-y-4" action={actionEmail}>
                            <div>
                                <Label>Mã người dùng</Label>
                                <Input
                                    id="_id"
                                    name="_id"
                                    placeholder="johndoe@mail.com"
                                    type="text"
                                    readOnly 
                                    defaultValue={params._id}
                                />
                            </div>
                            <div>
                                <Label>Mã kích hoạt</Label>
                                <Input
                                    id="codeId"
                                    name="codeId"
                                    placeholder="1234567"
                                    type="text"
                                />
                                
                            </div>
                            <Button type="submit" className="w-full">Gửi mã xác thực</Button>
                        </form>
                            {/* <Button type="submit" className="w-full" onClick={() => handleSetStep(2)}>Gửi mã xác thực</Button> */}
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="text-xl">
                                <div className="flex justify-center items-center text-center gap-x-2">
                                    <CheckIcon className="w-5 h-5 text-green-600" />
                                    <p>Kích hoạt tài khoản thành công</p>
                                </div>
                                    
                                </div>
                        </>
                    )}
                    <DialogFooter>
                        {
                            step === 2 && 
                            
                            <div className="flex justify-between w-full">
                                <Button type="submit" className="w-45" onClick={() => setStep(1)}>Quay lại</Button>
                                <DialogClose asChild>
                                    <Button variant="outline" className="w-45" onClick={() => (
                                        setOpen(false),
                                        route.push(`/auth/signin`)
                                    )}>Đóng</Button>
                                </DialogClose>
                                {/* <Button type="submit" className="w-45" onClick={() => handleSetStep(2)}>Xác thực</Button> */}
                            </div>
                        }
                        {/* <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit">Save changes</Button> */}
                    </DialogFooter>
                </DialogContent>
            
        </Dialog>
    );
}

export default InterceptorVerifyModalPage;