'use client'

import { deleteUser } from "@/app/lib/action/user"
import { DialogUserState, DialogUserValue } from "@/app/lib/type/useType"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2Icon } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

type Props = {
    openDialog: DialogUserState,
    valueResponse:DialogUserValue,
    handleShowDialog: (key: keyof DialogUserState, value:boolean, item?:any, refetchData?: boolean) => void
}
const initialState = {
    _id: "",
    name: "",
}
const UserDelete = ({openDialog,valueResponse,handleShowDialog}: Props) => {
    const [stateUser, setStateUser] = useState(initialState)
    const [state, action, isPending] = useActionState(deleteUser,undefined)
    const [deleting, setDeleting] = useState(false)
    const [dialogLoaded,setDialogLoaded] = useState(false)
    useEffect(() => {
        if(!isPending && deleting){
            setDeleting(false)
            if(!state?.errorFields || state?.errorFields?.length <= 0){
                handleShowDialog('delete',false, {}, true)
                toast.success('Update user successful');
                setDialogLoaded(false)
            }
            else{
                toast.error('Update user error');
                setTimeout(() => {
                    state.errorFields = []
                },3000)
            }
        }
    },[isPending,deleting])
    useEffect(() => {
        if (openDialog.delete && !dialogLoaded) {
            console.log(valueResponse?.delete)
            setStateUser(valueResponse?.delete)
            setDialogLoaded(!dialogLoaded);
            setDeleting(false)
        }
    },[openDialog, dialogLoaded, valueResponse.delete]) 
    return (
        <>
            <Dialog open={openDialog.delete} onOpenChange={() => {
                handleShowDialog('delete', false)
                setDialogLoaded(false)
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <form action={(formData) => {
                        action(formData)
                        setDeleting(true)
                    }}>
                        <DialogHeader>
                            <DialogTitle>Thông tin người dùng</DialogTitle>
                            <DialogDescription>Xóa thông tin của người dùng với id: {stateUser._id}.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <p>Bạn có chắc chắn muốn xóa thông tin của người dùng: {stateUser.name}</p>
                            <Input type="hidden" name="_id" value={stateUser._id} readOnly/>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            {
                                deleting ? 
                                    <Button type="button" disabled>
                                        <Loader2Icon className="animate-spin" /> Deleting
                                    </Button>
                                :   <Button type="submit" variant="destructive">
                                        Delete
                                    </Button>
                            }
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>
        </>
    )
}
export default UserDelete