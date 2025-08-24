'use client'
import SelectMultiple from "@/app/components/common/selectMultiple"
import { handleChunkFile } from "@/app/helper/common"
import { createComment } from "@/app/lib/action/comment"
import { createNotification } from "@/app/lib/action/notification"
import { mergeChunks } from "@/app/lib/action/post"
import { createUser } from "@/app/lib/action/user"
import { DialogCommentState } from "@/app/lib/type/commentType"
import { CommentType, PostType, RoleType, UserType } from "@/app/lib/type/modelType"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { Eye, EyeOff, Loader2Icon } from "lucide-react"
import Image from "next/image"
import { startTransition, useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

type AuthorType =  {
    _id: string,
    name: string
}

interface Props {
    openDialog: DialogCommentState,
    handleShowDialog: (key: keyof DialogCommentState, value:boolean, item?:any, refetchData?: boolean) => void
    userData: UserType,
    isLoading: boolean,
    roleData: RoleType,
    isLoadingRole: boolean,
}
const initialState = {
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
const keyOfResData = {
    TYPE:"id",
    POST: "id",
    SENDER: "_id",
    RECEIVER: "_id",
    COMMENT: "id",
}
const genderData = [
    {id:"0", name:"Male"},
    {id:"1", name: "Female"}
]
const UserCreate = ({
    openDialog,
    handleShowDialog,
    userData, 
    isLoading, 
    roleData, 
    isLoadingRole, 
}: Props) => {
    const [stateUser, setStateUser] = useState(initialState)
    const [state, action,isPending] = useActionState(createUser,undefined)
    const [creating, setCreating] = useState(false)
    const [dialogLoaded, setDialogLoaded] = useState(false);
    const [showPass, setShowPass] = useState(false)
    useEffect(() => {
        if(!isPending && creating){
            setCreating(false)
            if(state?.errorFields?.length <= 0){
                handleShowDialog('create',false, {}, true)
                toast.success('Create user successful');
            }
            else{
                toast.error('Create user error');
                setTimeout(() => {
                    state.errorFields = []
                },3000)
            }
        }
    },[isPending,creating])
    useEffect(() => {
        if (openDialog.create && !dialogLoaded) {
            setStateUser(initialState);
            setDialogLoaded(!dialogLoaded);
            setCreating(false)
        }
    },[openDialog, dialogLoaded]) 
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

        // ✅ Gửi tới action
        startTransition(() => {
            action(formData);
        });
        setCreating(true)
    }
    return (
        <>
            <Button variant="outline" onClick={() => {
                handleShowDialog('create',true) 
                setStateUser(initialState)
            }}>Open Dialog</Button>
            <Dialog open={openDialog.create} onOpenChange={() => {
                handleShowDialog('create', false)
                setStateUser(initialState)
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <form onSubmit={handleSubmit}>
                        <DialogHeader>
                            <DialogTitle>Chi tiết người dùng</DialogTitle>
                            <DialogDescription>Thêm mới thông tin về người dùng.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
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
                                <Label>Password</Label>
                                <div className="flex">
                                    <Input type={showPass ? "text" : "password"} name="password" value={stateUser.password} onChange={(e) => handleInputChange(e,"password")}/>
                                    <Button type="button" onClick={() => setShowPass(!showPass)}>
                                        {showPass ? <EyeOff/> : <Eye/>}
                                    </Button>
                                </div>
                                {
                                    state?.errorFields?.includes('password') && <div className="text-red-500">Password is required</div>
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
                                creating ? 
                                    <Button type="button" disabled>
                                        <Loader2Icon className="animate-spin" /> Creating
                                    </Button>
                                :   <Button type="submit">
                                        Create
                                    </Button>
                            }
                        </DialogFooter>
                    </form>

                </DialogContent>
            </Dialog>
        </>
    )
}

export default UserCreate