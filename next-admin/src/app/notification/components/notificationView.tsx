'use client'
import SelectMultiple from "@/app/components/common/selectMultiple"
import { createComment, updateComment } from "@/app/lib/action/comment"
import { PostType } from "@/app/lib/type/modelType"
import { DialogNotificationState, DialogNotificationValue } from "@/app/lib/type/notificationType"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Loader2Icon } from "lucide-react"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"

type AuthorType =  {
    _id: string,
    name: string
}

type CommentArrType = {
    id: number,
    content: string
}
const typeData = [
    {id:"comment",name:"Comment"},
    {id:"reply_comment",name: "Reply comment"}
]
interface Props {
    openDialog: DialogNotificationState,
    handleShowDialog: (key: keyof DialogNotificationState, value:boolean, item?:any, refetchData?: boolean) => void
    postData: PostType,
    isLoading: boolean,
    senderData: AuthorType,
    isLoadingSender: boolean,
    receiverData: AuthorType,
    isLoadingReceiver: boolean,
    commentData: CommentArrType,
    isLoadingComment: boolean
    // handleCallRefetch: ((type:string,cb?: (newValues: any) => void) => void)
    valueResponse: DialogNotificationValue
}
const NotificationView = ({
    openDialog,
    handleShowDialog,
    postData, 
    isLoading, 
    senderData, 
    isLoadingSender, 
    receiverData,
    isLoadingReceiver,
    commentData,
    isLoadingComment,
    valueResponse
}: Props) => {
    const initialState = {
        id: "",
        type: "",
        content:"",
        senderId:"",
        receiverId:"",
        postId: "",
        commentId:"",
        isRead: false,
    }
    const [statePost, setStatePost] = useState(initialState)
    const [updating, setUpdating] = useState(false)
    const [dialogLoaded, setDialogLoaded] = useState(false);
    useEffect(() => {
        if (openDialog.view && !dialogLoaded) {
            console.log(valueResponse.view)
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
                            <DialogTitle>Chi tiết thông báo bình luận</DialogTitle>
                            <DialogDescription>Xem chi tiết thông báo bình luận về bài viết.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-1">
                                <Label>Id</Label>
                                <Input type="text" name="id" value={statePost?.id ?? ""} disabled={true}/>
                            </div>
                            <div className="grid gap-1">
                                <Label>Content</Label>
                                <Textarea value={statePost?.content ?? ""} name="content"  onChange={(e) => handleInputChange(e,'content')} disabled={true}/>
                            </div>
                            <div className="grid gap-1">
                                <Label>Type</Label>
                                <SelectMultiple 
                                    key={"TYPE"}
                                    values={typeData} 
                                    isLoading={true} 
                                    keyMap={['id', 'name']}
                                    initialValue={statePost.type}
                                    typeCallRefetch="TYPE" 
                                    disabled={true}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label>Post</Label>
                                <SelectMultiple 
                                    values={postData} 
                                    isLoading={isLoading} 
                                    keyMap={['id', 'title']}
                                    initialValue={statePost.postId}
                                    disabled={true}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label>Sender</Label>
                                <Input type="hidden" name="authorId" value={statePost.senderId ?? ""} readOnly/>
                                <SelectMultiple 
                                    values={senderData} 
                                    isLoading={isLoadingSender} 
                                    keyMap={['_id', 'name']}
                                    mongoDB={true}
                                    initialValue={statePost.senderId}
                                    disabled={true}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label>Receiver</Label>
                                <Input type="hidden" name="authorId" value={statePost.receiverId ?? ""} readOnly/>
                                <SelectMultiple 
                                    values={receiverData} 
                                    isLoading={isLoadingReceiver} 
                                    keyMap={['_id', 'name']}
                                    mongoDB={true}
                                    initialValue={statePost.receiverId}
                                    disabled={true}
                                />
                            </div>
                            <div className="grid gap-1">
                                <Label htmlFor="airplane-mode">Read</Label>
                                <Switch
                                    id="isRead"
                                    name="isRead"
                                    checked={!!statePost.isRead}
                                        onCheckedChange={(checked) => {
                                            setStatePost((prev) => ({ ...prev, isRead: checked }))
                                        }
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

export default NotificationView