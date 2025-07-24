'use client'
import { createComment } from "@/app/lib/action/comment";
import { SessionUser } from "@/app/lib/session";
import { Comment } from "@/app/lib/type/modelTypes";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { any } from "zod";

type Props = {
    postId: number,
    user: SessionUser,
    className?: string,
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<{
        comments: Comment;
        count: number;
    }, Error>>
    defaultBtn: boolean
    comment:Comment
    parentComment:Comment
    repComment_FromChild:boolean
};
const AddComment = ({postId,user,className,refetch,defaultBtn, comment,parentComment,repComment_FromChild}: Props) => {
    const [state, action] = useActionState(createComment,undefined)
    const [openDialog,setOpenDialog] = useState(false)
    useEffect(() => {
        if (state?.ok) {
            setOpenDialog(false); // Đóng khi submit thành công
            toast.success("Comment posted successfully!");
            refetch()
        }
        else if (state?.ok === false) {
            toast.error("Failed to post comment.");
        }
    }, [state,refetch]);
    const handleOpenDialog = () => {
        setOpenDialog(prev => !prev)
    }

    const displayUserName = repComment_FromChild ? `@${comment?.user?.name}` :`@${comment?.user?.name}`
    const displayUserValue = repComment_FromChild ? comment?.user?.name : comment?.user?.name
  return (
    <>
        {defaultBtn 
        ? <Button onClick={()=>handleOpenDialog()} className="">Leave Your Comment</Button>
        : <p onClick={()=>handleOpenDialog()} className="flex items-start text-sm text-justify text-gray-600">Comment</p>
        }
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        {/* <DialogTrigger asChild={openDialog}>
        </DialogTrigger> */}
        <DialogContent>
            <DialogTitle>Write Your Comment</DialogTitle>
            <form action={action} className={cn(className)}>
                <input hidden name="postId" defaultValue={postId} />
                <Label htmlFor="comment">Your Comment</Label>
                <div className="border-t border-x rounded-t-md">
                    <Textarea
                        className="border-none active:outline-none focus-visible:ring-0 shadow-none"
                        name="content"
                        defaultValue={!defaultBtn ? displayUserName : ""}
                        // onChange={(e)=>handleOnchangeTextArea(e,parentComment?.user?.name)}
                    />
                    {!!state?.errors?.content && (
                    <p className="text-red-500 animate-shake">
                        {state.errors.content}
                    </p>
                    )}
                    <Input type="hidden" name="authorId" defaultValue={user._id}/>
                    <Input type="hidden" name="parentId" defaultValue={!defaultBtn ? parentComment?.id : undefined}/>
                    <Input type="hidden" name="userName" defaultValue={!defaultBtn ? displayUserValue : user.name}/>

                </div>
                <p className="border rounded-b-md p-2">
                    <span className="text-slate-400">Write as </span>
                    <span className="text-slate-700">{user.name}</span>
                </p>
                <Button type="submit" className="mt-2">Submit</Button>
            </form>
        </DialogContent>
        </Dialog>
    </>
  );
};

export default AddComment;