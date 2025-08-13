'use client'
import SelectMultiple from "@/app/components/common/selectMultiple"
import { createComment, updateComment } from "@/app/lib/action/comment"
import { DialogCommentState, DialogCommentValue } from "@/app/lib/type/commentType"
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
    openDialog: DialogCommentState,
    handleShowDialog: (key: keyof DialogCommentState, value:boolean, item?:any, refetchData?: boolean) => void
    postData: PostType,
    isLoading: boolean,
    authorData: AuthorType,
    isLoadingAuthor: boolean,
    // handleCallRefetch: ((type:string,cb?: (newValues: any) => void) => void)
    valueResponse: DialogCommentValue
}
const CommentView = ({openDialog,handleShowDialog,postData, isLoading, authorData, isLoadingAuthor, valueResponse}: Props) => {
    const initialState = {
        id:"",
        content:"",
        postId: "",
        authorId: "",
        userName: "",
        post:{
            id:"",
            title:""
        },
        user:{
            _id: "",
            name:""
        }
    }
    const [statePost, setStatePost] = useState(initialState)
    const [updating, setUpdating] = useState(false)
    const [dialogLoaded, setDialogLoaded] = useState(false);
    useEffect(() => {
        if (openDialog.view && !dialogLoaded) {
            setStatePost(valueResponse.view);
            setDialogLoaded(!dialogLoaded);
            setUpdating(false)
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
            <Dialog open={openDialog.view} onOpenChange={() => {
                handleShowDialog('view', false)
                setDialogLoaded(false)
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <form action={(formData) => {
                        setUpdating(true)
                    }}>
                        <DialogHeader>
                            <DialogTitle>Chi tiết bình luận</DialogTitle>
                            <DialogDescription>Xem bình luận về bài viết.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-1">
                                <Label>Id</Label>
                                <Input type="text" name="id" value={statePost?.id ?? ""} readOnly/>
                            </div>
                            <div className="grid gap-1">
                                <Label>UserName</Label>
                                <Input type="text" value={statePost?.userName ?? ""} name="userName" readOnly/>
                            </div>
                            <div className="grid gap-1">
                                <Label>Content</Label>
                                <Textarea value={statePost?.content ?? ""} name="content"  onChange={(e) => handleInputChange(e,'content')} readOnly/>
                            </div>
                            <div className="grid gap-1">
                                <Label>Post</Label>
                                <Input type="hidden" name="postId" value={statePost.post.id ?? ""} readOnly/>
                                <SelectMultiple 
                                    values={postData} 
                                    isLoading={isLoading} 
                                    keyMap={['id', 'title']}
                                    initialValue={statePost.postId}
                                    disabled={true}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label>Author</Label>
                                <Input type="hidden" name="authorId" value={statePost.authorId ?? ""} readOnly/>
                                <SelectMultiple 
                                    values={authorData} 
                                    isLoading={isLoading} 
                                    keyMap={['_id', 'name']}
                                    mongoDB={true}
                                    initialValue={statePost.authorId}
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

export default CommentView