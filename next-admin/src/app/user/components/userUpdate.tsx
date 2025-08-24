'use client'
import SelectMultiple from "@/app/components/common/selectMultiple"
import { handleChunkFile } from "@/app/helper/common"
import { updateComment } from "@/app/lib/action/comment"
import { updateLike } from "@/app/lib/action/like"
import { updateNotification } from "@/app/lib/action/notification"
import { mergeChunks } from "@/app/lib/action/post"
import { updateUser } from "@/app/lib/action/user"
import { DialogLikeState, DialogLikeValue } from "@/app/lib/type/likeType"
import { LikeType, PostType, RoleType, UserType } from "@/app/lib/type/modelType"
import { DialogUserValue } from "@/app/lib/type/useType"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { Eye, EyeOff, Loader2Icon } from "lucide-react"
import Image from "next/image"
import { startTransition, useActionState, useEffect, useState } from "react"
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
    openDialog: DialogLikeState,
    handleShowDialog: (key: keyof DialogLikeState, value:boolean, item?:any, refetchData?: boolean) => void
    valueResponse: DialogUserValue,
    // refetchData: (options?: RefetchOptions) => Promise<QueryObserverResult<{
    //     likes: LikeType;
    //     count: number;
    // }, Error>>
    userData: UserType,
    isLoading: boolean,
    roleData: RoleType,
    isLoadingRole: boolean,
    
}
const UserEdit = ({
    openDialog,
    handleShowDialog,
    userData,
    isLoading,
    roleData,
    isLoadingRole,
    valueResponse}: Props) => {
    const [stateUser, setStateUser] = useState(initialState)
    const [state, action,isPending] = useActionState(updateUser,undefined)
    const [updating, setUpdating] = useState(false)
    const [dialogLoaded, setDialogLoaded] = useState(false);
    useEffect(() => {
        if(!isPending && updating){
            setUpdating(false)
            if(!state?.errorFields || state?.errorFields?.length <= 0){
                handleShowDialog('edit',false, {}, true)
                toast.success('Update user successful');
            }
            else{
                toast.error('Update user error');
                setTimeout(() => {
                    state.errorFields = []
                },3000)
            }
        }
    },[isPending,updating])
    useEffect(() => {
        if (openDialog.edit && !dialogLoaded) {
            setStateUser(valueResponse.edit)
            setDialogLoaded(!dialogLoaded);
            setUpdating(false)
        }
    },[openDialog, dialogLoaded, valueResponse.edit]) 
    const handleInputChange = (e: any, inputField: string) => {
        const {value} = e?.target
        setStateUser((prev) => ({
            ...prev,
            [inputField]: value
        }))
    }
    const handleOnChange = (inputField: keyof typeof typeOfKey,val: any) => {
        const keyValue = val;
        const extraFields = {} as Record<string, any>; // luôn là object
        setStateUser((prev) => ({
            ...prev,
            [typeOfKey[inputField]]: keyValue,
            ...extraFields,
        }))
    }
    const handleSubmit  = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = document.querySelector('form');
        if (!form) return;

        const formElement = e.currentTarget
        const formData = new FormData(form); // Lấy từ form
        let avatarUrl = stateUser.avatar !== '/no-image.png' ? stateUser.avatar : "" as string;
        if(stateUser?.avatarFile){
            const fileName = await handleChunkFile(stateUser?.avatarFile)
            avatarUrl = await mergeChunks(fileName as string)
            formData.set('avatar', avatarUrl?.data?.getMergeFile); // Ghi đè giá trị
        }
        else{
            formData.set('avatar', avatarUrl); // Ghi đè giá trị
        }
        if(!stateUser?.isActive){
            formData.set('isActive', "off")
        }

        // ✅ Gửi tới action
        startTransition(() => {
            action(formData);
        });
        setUpdating(true)
    }
    return (
        <>
            <Dialog open={openDialog.edit} onOpenChange={() => {
                handleShowDialog('edit', false)
                setDialogLoaded(false)
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Chi tiết thông báo</DialogTitle>
                            <DialogDescription>Chỉnh sửa thông báo bình luận của bài viết.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-1">
                                <Label>Id</Label>
                                <Input type="text" name="_id" value={stateUser?._id ?? ""} readOnly/>
                            </div>
                            <div className="grid gap-1">
                                <Label>Name</Label>
                                <Input name="name" type="text" onChange={(e) => handleInputChange(e,"name")} value={stateUser.name}/>
                                {
                                    state?.errorFields?.includes('name') && <div className="text-red-500">Name is required</div>
                                }
                            </div>

                            <div className="grid gap-1">
                                <Label>Gender</Label>
                                <Input type="hidden" name="gender" value={stateUser.gender} readOnly/>
                                <SelectMultiple 
                                    key={"GENDER"}
                                    values={genderData} 
                                    isLoading={true} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['id',"name"]}
                                    typeCallRefetch="GENDER"
                                    initialValue={stateUser?.gender && stateUser?.gender === true ? '0' : '1' } 
                                />
                                {
                                    state?.errorFields?.includes('gender') && <div className="text-red-500">Gender is required</div>
                                }                
                            </div>

                            <div className="grid gap-1">
                                <Label>Gmail</Label>
                                <Input type="text" name="email" value={stateUser.email} onChange={(e)=>handleInputChange(e,"email")}/>
                                {
                                    state?.errorFields?.includes('email') && <div className="text-red-500">Email is required</div>
                                }                
                            </div>
                            
                            <div className="grid gap-1">
                                <Label>Thumbnail</Label>
                                <Input type="file" name="avatar" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const previewUrl = URL.createObjectURL(file); // tạo url tạm
                                        setStateUser((prev: UserType) => ({
                                            ...prev,
                                            avatarFile: file,
                                            avatar: previewUrl
                                        }));
                                    }
                                }} />
                                <div className="border border-input rounded-md px-3 py-2 w-full flex justify-center  shadow-xs transition-[color,box-shadow] outline-none">
                                    <Image
                                        src={stateUser?.avatar ?? '/no-image.png'}
                                        alt={stateUser?.name ?? "avatar"}
                                        width={100}
                                        height={100}
                                        className="rounded"
                                    />
                                </div>
                                {
                                    state?.errorFields?.includes('thumbnail') && <div className="text-red-500">Thumbnail is required</div>
                                } 
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
                                />
                                {
                                    state?.errorFields?.includes('roleId') && <div className="text-red-500">Role ID is required</div>
                                }                
                            </div>
                            <div className="grid gap-1">
                                <Label>Account type</Label>
                                <Input type="text" name="accountType" value={stateUser.accountType} readOnly/>
                                {
                                    state?.errorFields?.includes('accountType') && <div className="text-red-500">Account type is required</div>
                                }                
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="airplane-mode">Account active</Label>
                                <Switch
                                    id="isActive"
                                    name="isActive"
                                    checked={!!stateUser.isActive}
                                    onCheckedChange={(checked) => {
                                        setStateUser((prev) => ({ ...prev, isActive: checked }))
                                    }
                                }
                                />                        
                            </div>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            {
                                updating ? 
                                    <Button type="button" disabled>
                                        <Loader2Icon className="animate-spin" /> Updating
                                    </Button>
                                :   <Button type="submit">
                                        Update
                                    </Button>
                            }
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>
        </>
    )
}
export default UserEdit