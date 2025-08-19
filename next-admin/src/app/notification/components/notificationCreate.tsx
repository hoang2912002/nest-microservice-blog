'use client'
import SelectMultiple from "@/app/components/common/selectMultiple"
import { createComment } from "@/app/lib/action/comment"
import { createNotification } from "@/app/lib/action/notification"
import { DialogCommentState } from "@/app/lib/type/commentType"
import { CommentType, PostType } from "@/app/lib/type/modelType"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
    senderData: AuthorType,
    isLoadingSender: boolean,
    handleCallRefetch: ((type:string,cb?: (newValues: any) => void) => void),
    receiverData: AuthorType,
    isLoadingReceiver: boolean,
    commentData: CommentType,
    isLoadingComment: boolean,
}
const initialState = {
    type: "",
    content:"",
    senderId:"",
    receiverId:"",
    postId: "",
    commentId:"",
    isRead: false,
}
const typeOfKey = {
    TYPE:"type",
    POST: "postId",
    SENDER: "senderId",
    RECEIVER: "receiverId",
    COMMENT: "commentId",
}
const keyOfResData = {
    TYPE:"id",
    POST: "id",
    SENDER: "_id",
    RECEIVER: "_id",
    COMMENT: "id",
}
const typeData = [
    {id:"comment",name:"Comment"},
    {id:"reply_comment",name: "Reply comment"}
]
const NotificationCreate = ({
    openDialog,
    handleShowDialog,
    postData, 
    isLoading, 
    senderData, 
    isLoadingSender, 
    handleCallRefetch,
    receiverData,
    isLoadingReceiver,
    commentData,
    isLoadingComment,
}: Props) => {
    const [statePost, setStatePost] = useState(initialState)
    const [state, action,isPending] = useActionState(createNotification,undefined)
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
    const handleOnChange = (inputField: keyof typeof typeOfKey,val: any) => {
        let keyValue = val;
        const extraFields = {} as Record<string, any>; // luôn là object
        if(typeof val === 'object'){
            const keyField = keyOfResData[inputField]; // ví dụ "_id" hay "id"
            keyValue = val[keyField];
            if(statePost.type === 'comment' && typeOfKey[inputField] === 'postId'){
                if (val?.user?.name) {
                    extraFields.receiverId = val.user._id;
                }
            }
        }
        setStatePost((prev) => ({
            ...prev,
            [typeOfKey[inputField]]: keyValue,
            ...extraFields,
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
                            <DialogTitle>Chi tiết thông báo</DialogTitle>
                            <DialogDescription>Thêm mới thông báo bình luận về bài viết.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-1">
                                <Label>Content</Label>
                                <Textarea value={statePost?.content ?? ""} name="content"  onChange={(e) => handleInputChange(e,'content')}/>
                                {
                                    state?.errorFields?.includes('content') && <div className="text-red-500">Content is required</div>
                                }
                            </div>

                            <div className="grid gap-1">
                                <Label>Type</Label>
                                <Input type="hidden" name="type" value={statePost.type} readOnly/>
                                <SelectMultiple 
                                    key={"TYPE"}
                                    values={typeData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={true} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['id', 'name']}
                                    typeCallRefetch="TYPE" 
                                />
                                {
                                    state?.errorFields?.includes('senderId') && <div className="text-red-500">SenderId is required</div>
                                }                
                            </div>

                            <div className="grid gap-1">
                                <Label>Post</Label>
                                <Input type="hidden" name="postId" value={statePost.postId} readOnly/>
                                <SelectMultiple 
                                    key={"POST"}
                                    values={postData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={isLoading} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['id', 'title']}
                                    returnObjectData={true}
                                    typeCallRefetch="POST"/>
                                {
                                    state?.errorFields?.includes('postId') && <div className="text-red-500">Post is required</div>
                                }                
                            </div>
                            
                            <div className="grid gap-1">
                                <Label>Sender</Label>
                                <Input type="hidden" name="senderId" value={statePost.senderId} readOnly/>
                                <SelectMultiple 
                                    key={"SENDER"}
                                    values={senderData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={isLoading} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['_id', 'name']}
                                    typeCallRefetch="SENDER" 
                                    mongoDB={true}
                                />
                                {
                                    state?.errorFields?.includes('senderId') && <div className="text-red-500">SenderId is required</div>
                                }                
                            </div>
                            <div className="grid gap-1">
                                <Label>Receiver</Label>
                                <Input type="hidden" name="receiverId" value={statePost.receiverId} readOnly/>
                                <SelectMultiple 
                                    key={"RECEIVER"}
                                    values={receiverData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={isLoading} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['_id', 'name']}
                                    typeCallRefetch="RECEIVER" 
                                    mongoDB={true}
                                    disabled={statePost.type==="comment"}
                                    initialValue={statePost.type==="comment" ? statePost.receiverId : null}
                                />
                                {
                                    state?.errorFields?.includes('receiverId') && <div className="text-red-500">ReceiverId is required</div>
                                }                
                            </div>
                            <div className="grid gap-1">
                                <Label>Comment</Label>
                                <Input type="hidden" name="commentId" value={statePost.commentId} readOnly/>
                                <SelectMultiple 
                                    key={"COMMENT"}
                                    values={commentData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={isLoading} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['id', 'content']}
                                    typeCallRefetch="COMMENT" 
                                />
                                {
                                    state?.errorFields?.includes('commentId') && <div className="text-red-500">CommentId is required</div>
                                }                
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

export default NotificationCreate