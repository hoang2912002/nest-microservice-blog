'use client'
import SelectMultiple from "@/app/components/common/selectMultiple"
import { createComment, updateComment } from "@/app/lib/action/comment"
import { PostType, RoleType, UserType } from "@/app/lib/type/modelType"
import { DialogNotificationState, DialogNotificationValue } from "@/app/lib/type/notificationType"
import { DialogUserState, DialogUserValue } from "@/app/lib/type/useType"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Loader2Icon } from "lucide-react"
import Image from "next/image"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

const initialState = {
    _id: "",
    name: "",
    gender:"",
    email:"",
    password:"",
    avatar:"/no-image.png",
    roleId: "",
    accountType:"LOCAL",
    isActive: false,
    avatarFile: null
}
const typeOfKey = {
    GENDER:"gender",
    ROLE:"roleId"
}
const genderData = [
    {id:"0", name:"Male"},
    {id:"1", name: "Female"}
]
interface Props {
    openDialog: DialogUserState,
    handleShowDialog: (key: keyof DialogUserState, value:boolean, item?:any, refetchData?: boolean) => void
    userData: UserType,
    isLoading: boolean,
    roleData: RoleType,
    isLoadingRole: boolean,
    valueResponse: DialogUserValue
}
const UserView = ({
    openDialog,
    handleShowDialog,
    userData, 
    isLoading, 
    roleData, 
    isLoadingRole, 
    valueResponse
}: Props) => {
    
    const [stateUser, setStateUser] = useState(initialState)
    const [updating, setUpdating] = useState(false)
    const [dialogLoaded, setDialogLoaded] = useState(false);
    useEffect(() => {
        if (openDialog.view && !dialogLoaded) {
            setStateUser(valueResponse.view);
            setDialogLoaded(!dialogLoaded);
            setUpdating(false)
        }
    },[openDialog, dialogLoaded]) 
    const handleInputChange = (e: any, inputField: string) => {
        const {value} = e?.target
        setStateUser((prev) => ({
            ...prev,
            [inputField]: value
        }))
    }
    const handleOnChange = (inputField : string,val: any) => {
        setStateUser((prev) => ({
            ...prev,
            postId: inputField === 'POST' ? val : prev.postId,
            authorId: inputField === 'AUTHOR' ? val : prev.authorId
        }))
    }
    return (
        <>
            <Dialog open={openDialog.view} onOpenChange={() => {
                handleShowDialog('view', false)
                setDialogLoaded(false)
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <form action={(formData) => {
                        setUpdating(true)
                    }}>
                        <DialogHeader>
                            <DialogTitle>Chi tiết người dùng</DialogTitle>
                            <DialogDescription>Xem chi tiết về thông tin người dùng.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-1">
                                <Label>Id</Label>
                                <Input type="text" name="id" value={stateUser?._id ?? ""} disabled={true}/>
                            </div>
                            <div className="grid gap-1">
                                <Label>Full name</Label>
                                <Input value={stateUser?.name ?? ""} name="name"  onChange={(e) => handleInputChange(e,'name')} disabled={true}/>
                            </div>
                            <div className="grid gap-1">
                                <Label>Gender</Label>
                                <SelectMultiple 
                                    key={"GENDER"}
                                    values={genderData} 
                                    isLoading={true} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['id',"name"]}
                                    typeCallRefetch="GENDER" 
                                    disabled={true}
                                    initialValue={stateUser?.gender && stateUser?.gender === true ? '0' : '1'}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label>Gmail</Label>
                                <Input type="text" name="email" 
                                    value={stateUser.email} onChange={(e)=>handleInputChange(e,"email")}
                                    disabled={true}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label>Thumbnail</Label>
                                <div className="border border-input rounded-md px-3 py-2 w-full flex justify-center  shadow-xs transition-[color,box-shadow] outline-none">
                                    <Image
                                        src={stateUser?.avatar ?? '/no-image.png'}
                                        alt={stateUser?.name ?? "avatar"}
                                        width={100}
                                        height={100}
                                        className="rounded"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-1">
                                <Label>Role</Label>
                                <Input type="hidden" name="roleId" value={stateUser.roleId} readOnly/>
                                <SelectMultiple 
                                    key={"ROLE"}
                                    values={roleData} 
                                    isLoading={isLoading} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['slug', 'name']}
                                    typeCallRefetch="ROLE" 
                                    mongoDB={true}
                                    initialValue={stateUser.roleId}
                                    disabled={true}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label>Account type</Label>
                                <Input type="text" name="accountType" 
                                    value={stateUser.accountType} disabled={true}/>
                                              
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="airplane-mode">Account active</Label>
                                <Switch
                                    id="isActive"
                                    name="isActive"
                                    checked={!!stateUser.isActive}
                                    onCheckedChange={(checked) => {
                                        setStateUser((prev) => ({ ...prev, isActive: checked }))}
                                    }
                                disabled={true}
                                />                        
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default UserView