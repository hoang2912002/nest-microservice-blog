'use client'

import SelectMultiple from "@/app/components/common/selectMultiple"
import { createComment } from "@/app/lib/action/comment"
import { createLike } from "@/app/lib/action/like"
import { DialogLikeState } from "@/app/lib/type/likeType"
import { PostType } from "@/app/lib/type/modelType"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2Icon } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

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
}
const initialState = {
    postId: "",
    userId: "",
}
const LikeCreate = ({openDialog,handleShowDialog,postData, isLoading, authorData, isLoadingAuthor, handleCallRefetch}: Props) => {
    const [statePost, setStatePost] = useState(initialState)
    const [state, action,isPending] = useActionState(createLike,undefined)
    const [creating, setCreating] = useState(false)
    const [dialogLoaded, setDialogLoaded] = useState(false);
    useEffect(() => {
        if(!isPending && creating){
            if(state){
                handleShowDialog('create',false, {}, true)
                setCreating(false)
                setDialogLoaded(!dialogLoaded);
                toast.success('Create post successful');
            }
            else{
                setCreating(false)
                toast.error('Create post fail');
            }
        }
    },[isPending,creating])
    useEffect(() => {
        if (openDialog.create && !dialogLoaded) {
            setStatePost(initialState);
            setDialogLoaded(!dialogLoaded);
            setCreating(false)
        }
    },[openDialog, dialogLoaded, initialState]) 
    const handleInputChange = (e: any, inputField: string) => {
        const {value} = e?.target
        setStatePost((prev) => ({
            ...prev,
            [inputField]: value
        }))
    }
    const handleOnChange = (inputField : string,val: any) => {
        setStatePost((prev) => ({
            ...prev,
            postId: inputField === 'POST' ? val : prev.postId,
            userId: inputField === 'AUTHOR' ? val : prev.userId
        }))
    }
    return (
        <>
            <Button variant="outline" onClick={() => {
                handleShowDialog('create',true) 
                setStatePost(initialState)
            }}>Open Dialog</Button>
            <Dialog open={openDialog.create} onOpenChange={() => {
                handleShowDialog('create', false)
                setStatePost(initialState)
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <form action={(formData) => {
                        action(formData)
                        setCreating(true)
                    }}>
                        <DialogHeader>
                            <DialogTitle>Chi tiết bình luận</DialogTitle>
                            <DialogDescription>Thêm mới bình luận về bài viết.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-1">
                                <Label>Post</Label>
                                <Input type="hidden" name="postId" value={statePost.postId} readOnly/>
                                <SelectMultiple 
                                    values={postData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={isLoading} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['id', 'title']}
                                    typeCallRefetch="POST"/>
                                {
                                    state?.errorFields?.includes('postId') && <div className="text-red-500">Post is required</div>
                                }                
                            </div>
                            <div className="grid gap-1">
                                <Label>Author</Label>
                                <Input type="hidden" name="userId" value={statePost.userId} readOnly/>
                                <SelectMultiple 
                                    values={authorData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={isLoading} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['_id', 'name']}
                                    typeCallRefetch="AUTHOR" 
                                    mongoDB={true}
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

export default LikeCreate