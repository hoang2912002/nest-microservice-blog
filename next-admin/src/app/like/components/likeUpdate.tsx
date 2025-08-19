'use client'
import SelectMultiple from "@/app/components/common/selectMultiple"
import { updateComment } from "@/app/lib/action/comment"
import { updateLike } from "@/app/lib/action/like"
import { DialogLikeState, DialogLikeValue } from "@/app/lib/type/likeType"
import { LikeType, PostType } from "@/app/lib/type/modelType"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

const initialState = {
    id:"",
    postId: "",
    userId: "",
    post:{
        id:"",
        title:""
    },
    user:{
        _id: "",
        name:""
    },
    newPostId: "",
    newUserId: "",
}
type AuthorType =  {
    _id: string,
    name: string
}

interface Props {
    openDialog: DialogLikeState,
    handleShowDialog: (key: keyof DialogLikeState, value:boolean, item?:any, refetchData?: boolean) => void
    postData: PostType,
    isLoading: boolean,
    authorData: AuthorType,
    isLoadingAuthor: boolean,
    handleCallRefetch: ((type:string,cb?: (newValues: any) => void) => void)
    valueResponse: DialogLikeValue,
    refetchData: (options?: RefetchOptions) => Promise<QueryObserverResult<{
        likes: LikeType;
        count: number;
    }, Error>>
}
const LikeEdit = ({openDialog,handleShowDialog,postData, isLoading, authorData, isLoadingAuthor, handleCallRefetch, valueResponse, refetchData}: Props) => {
    const [statePost, setStatePost] = useState(initialState)
    const [state, action,isPending] = useActionState(updateLike,undefined)
    const [updating, setUpdating] = useState(false)
    const [dialogLoaded, setDialogLoaded] = useState(false);
    useEffect(() => {
        if(!isPending && updating){
            handleShowDialog('edit',false, {}, true)
            setDialogLoaded(!dialogLoaded);
            setUpdating(false)
            toast.success('Update comment successful');
            refetchData()
        }
    },[isPending,updating])
    useEffect(() => {
        if (openDialog.edit && !dialogLoaded) {
            console.log(valueResponse.edit)
            setStatePost((prev) => ({
                ...prev,
                ...valueResponse.edit,
                newPostId: valueResponse.edit.postId,
                newUserId: valueResponse.edit.userId,
            }));
            setDialogLoaded(!dialogLoaded);
            setUpdating(false)
        }
    },[openDialog, dialogLoaded, valueResponse.edit]) 
    
    const handleOnChange = (inputField : string,val: any) => {
        console.log(inputField)
        setStatePost((prev) => ({
            ...prev,
            newPostId: inputField === 'POST' ? val : prev.postId,
            newUserId: inputField === 'AUTHOR' ? val : prev.userId
        }))
    }
    return (
        <>
            <Dialog open={openDialog.edit} onOpenChange={() => {
                handleShowDialog('edit', false)
                setDialogLoaded(false)
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <form action={(formData) => {
                        action(formData)
                        setUpdating(true)
                    }}>
                        <DialogHeader>
                            <DialogTitle>Chi tiết lượt thích</DialogTitle>
                            <DialogDescription>Chỉnh sửa lượt thích.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-1">
                                <Label>Id</Label>
                                <Input type="text" name="id" value={statePost?.id ?? ""} readOnly/>
                            </div>
                            <div className="grid gap-1">
                                <Label>Post</Label>
                                <Input type="hidden" name="postId" value={statePost.postId ?? ""} readOnly/>
                                <Input type="hidden" name="newPostId" value={statePost.newPostId ?? ""} readOnly/>
                                <SelectMultiple 
                                    values={postData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={isLoading} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['id', 'title']}
                                    initialValue={statePost.newPostId}
                                    typeCallRefetch="POST"/>
                                {
                                    state?.errorFields?.includes('postId') && <div className="text-red-500">Post is required</div>
                                }                
                            </div>
                            <div className="grid gap-1">
                                <Label>User</Label>
                                <Input type="hidden" name="userId" value={statePost.userId ?? ""} readOnly/>
                                <Input type="hidden" name="newUserId" value={statePost.newUserId ?? ""} readOnly/>
                                <SelectMultiple 
                                    values={authorData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={isLoading} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['_id', 'name']}
                                    typeCallRefetch="AUTHOR" 
                                    mongoDB={true}
                                    initialValue={statePost.newUserId}
                                />
                                {
                                    state?.errorFields?.includes('userId') && <div className="text-red-500">UserId is required</div>
                                }                
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
export default LikeEdit