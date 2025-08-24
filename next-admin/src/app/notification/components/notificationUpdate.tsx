'use client'
import SelectMultiple from "@/app/components/common/selectMultiple"
import { updateComment } from "@/app/lib/action/comment"
import { updateLike } from "@/app/lib/action/like"
import { updateNotification } from "@/app/lib/action/notification"
import { DialogLikeState, DialogLikeValue } from "@/app/lib/type/likeType"
import { LikeType, PostType } from "@/app/lib/type/modelType"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
type CommentArrType = {
    id: number,
    content: string
}
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
interface Props {
    openDialog: DialogLikeState,
    handleShowDialog: (key: keyof DialogLikeState, value:boolean, item?:any, refetchData?: boolean) => void
    postData: PostType,
    isLoading: boolean,
    handleCallRefetch: ((type:string,cb?: (newValues: any) => void) => void)
    valueResponse: DialogLikeValue,
    refetchData: (options?: RefetchOptions) => Promise<QueryObserverResult<{
        likes: LikeType;
        count: number;
    }, Error>>
    senderData: AuthorType,
    isLoadingSender: boolean,
    receiverData: AuthorType,
    isLoadingReceiver: boolean,
    commentData: CommentArrType,
    isLoadingComment: boolean
}
const NotificationEdit = ({
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
    handleCallRefetch, 
    valueResponse, 
    refetchData}: Props) => {
    const [stateNotification, setStateNotification] = useState(initialState)
    const [state, action,isPending] = useActionState(updateNotification,undefined)
    const [updating, setUpdating] = useState(false)
    const [dialogLoaded, setDialogLoaded] = useState(false);
    useEffect(() => {
        if(!isPending && updating){
            handleShowDialog('edit',false, {}, true)
            setDialogLoaded(!dialogLoaded);
            setUpdating(false)
            toast.success('Update notification successful');
            refetchData()
        }
    },[isPending,updating])
    useEffect(() => {
        if (openDialog.edit && !dialogLoaded) {
            setStateNotification(valueResponse.edit)
            // setStateNotification((prev) => ({
            //     ...prev,
            //     ...valueResponse.edit,
            //     newPostId: valueResponse.edit.postId,
            //     newUserId: valueResponse.edit.userId,
            // }));
            setDialogLoaded(!dialogLoaded);
            setUpdating(false)
        }
    },[openDialog, dialogLoaded, valueResponse.edit]) 
    const handleInputChange = (e: any, inputField: string) => {
        const {value} = e?.target
        setStateNotification((prev) => ({
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
            if(stateNotification.type === 'comment' && typeOfKey[inputField] === 'postId'){
                if (val?.user?.name) {
                    extraFields.receiverId = val.user._id;
                }
            }
        }
        setStateNotification((prev) => ({
            ...prev,
            [typeOfKey[inputField]]: keyValue,
            ...extraFields,
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
                            <DialogTitle>Chi tiết thông báo</DialogTitle>
                            <DialogDescription>Chỉnh sửa thông báo bình luận của bài viết.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-1">
                                <Label>Id</Label>
                                <Input type="text" name="id" value={stateNotification?.id ?? ""} readOnly/>
                            </div>
                            <div className="grid gap-1">
                                <Label>Content</Label>
                                <Textarea value={stateNotification?.content ?? ""} name="content"  onChange={(e) => handleInputChange(e,'content')}/>
                                {
                                    state?.errorFields?.includes('content') && <div className="text-red-500">Content is required</div>
                                }
                            </div>
                            <div className="grid gap-1">
                                <Label>Type</Label>
                                <Input type="hidden" name="type" value={stateNotification.type} readOnly/>
                                <SelectMultiple 
                                    key={"TYPE"}
                                    values={typeData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={true} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['id', 'name']}
                                    typeCallRefetch="TYPE" 
                                    initialValue={stateNotification.type}
                                />
                                {
                                    state?.errorFields?.includes('senderId') && <div className="text-red-500">SenderId is required</div>
                                }                
                            </div>
                            <div className="grid gap-1">
                                <Label>Post</Label>
                                <Input type="hidden" name="postId" value={stateNotification.postId ?? ""} readOnly/>
                                <SelectMultiple 
                                    values={postData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={isLoading} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['id', 'title']}
                                    initialValue={stateNotification.postId}
                                    typeCallRefetch="POST"/>
                                {
                                    state?.errorFields?.includes('postId') && <div className="text-red-500">Post is required</div>
                                }                
                            </div>
                            <div className="grid gap-1">
                                <Label>Sender</Label>
                                <Input type="hidden" name="senderId" value={stateNotification.senderId} readOnly/>
                                <SelectMultiple 
                                    key={"SENDER"}
                                    values={senderData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={isLoadingSender} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['_id', 'name']}
                                    typeCallRefetch="SENDER" 
                                    mongoDB={true}
                                    initialValue={stateNotification.senderId}
                                />
                                {
                                    state?.errorFields?.includes('senderId') && <div className="text-red-500">SenderId is required</div>
                                }                
                            </div>
                            <div className="grid gap-1">
                                <Label>Receiver</Label>
                                <Input type="hidden" name="receiverId" value={stateNotification.receiverId} readOnly/>
                                <SelectMultiple 
                                    key={"RECEIVER"}
                                    values={receiverData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={isLoadingReceiver} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['_id', 'name']}
                                    typeCallRefetch="RECEIVER" 
                                    mongoDB={true}
                                    disabled={stateNotification.type==="comment"}
                                    initialValue={stateNotification.receiverId}
                                />
                                {
                                    state?.errorFields?.includes('receiverId') && <div className="text-red-500">ReceiverId is required</div>
                                }                
                            </div>
                            <div className="grid gap-1">
                                <Label>Comment</Label>
                                <Input type="hidden" name="commentId" value={stateNotification.commentId} readOnly/>
                                <SelectMultiple 
                                    key={"COMMENT"}
                                    values={commentData} 
                                    handleCallRefetch={handleCallRefetch} 
                                    isLoading={isLoadingComment} 
                                    handleOnChange_Parent={handleOnChange} 
                                    keyMap={['id', 'content']}
                                    typeCallRefetch="COMMENT" 
                                    initialValue={stateNotification.commentId}
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
                                    checked={!!stateNotification.isRead}
                                        onCheckedChange={(checked) => {
                                            setStateNotification((prev) => ({ ...prev, isRead: checked }))
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
export default NotificationEdit