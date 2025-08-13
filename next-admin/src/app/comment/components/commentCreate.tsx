'use client'
import SelectMultiple from "@/app/components/common/selectMultiple"
import { createComment } from "@/app/lib/action/comment"
import { DialogCommentState } from "@/app/lib/type/commentType"
import { PostType } from "@/app/lib/type/modelType"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import { Loader2Icon } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

type AuthorType =  {
    _id: string,
    name: string
}

interface Props {
    openDialog: DialogCommentState,
    handleShowDialog: (key: keyof DialogCommentState, value:boolean, item?:any, refetchData?: boolean) => void
    postData: PostType,
    isLoading: boolean,
    authorData: AuthorType,
    isLoadingAuthor: boolean,
    handleCallRefetch: ((type:string,cb?: (newValues: any) => void) => void)
}
const CommentCreate = ({openDialog,handleShowDialog,postData, isLoading, authorData, isLoadingAuthor, handleCallRefetch}: Props) => {
    const initialState = {
        content:"",
        postId: "",
        authorId: "",
        userName: "",
    }
    const [statePost, setStatePost] = useState(initialState)
    const [state, action,isPending] = useActionState(createComment,undefined)
    const [creating, setCreating] = useState(false)
    const [dialogLoaded, setDialogLoaded] = useState(false);
    useEffect(() => {
        if(!isPending && creating){
            handleShowDialog('create',false, {}, true)
            setCreating(false)
            toast.success('Create post successful');
        }
    },[isPending,creating])
    useEffect(() => {
        if (openDialog.create && !dialogLoaded) {
            setStatePost(initialState);
            setDialogLoaded(!dialogLoaded);
            setCreating(false)
        }
    },[openDialog, dialogLoaded]) 
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
            authorId: inputField === 'AUTHOR' ? val : prev.authorId
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
                            <Input type="hidden" value={statePost.userName} name="userName"/>
                            <div className="grid gap-1">
                                <Label>Content</Label>
                                <Textarea value={statePost?.content ?? ""} name="content"  onChange={(e) => handleInputChange(e,'content')}/>
                                {
                                    state?.errorFields?.includes('content') && <div className="text-red-500">Content is required</div>
                                }
                            </div>
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
                                <Input type="hidden" name="authorId" value={statePost.authorId} readOnly/>
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
                                    state?.errorFields?.includes('authorId') && <div className="text-red-500">AuthorId is required</div>
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

export default CommentCreate