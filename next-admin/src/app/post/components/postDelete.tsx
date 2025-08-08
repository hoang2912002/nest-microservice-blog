'use client'
import { deletePost } from "@/app/lib/action/post";
import { PostType } from "@/app/lib/type/modelType";
import { DialogState, DialogValue } from "@/app/lib/type/postType";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation } from "@tanstack/react-query";
import { useActionState } from "react";
import { toast } from "sonner";

interface Props {
    openDialog: DialogState
    valueResponse: DialogValue
    handleShowDialog: (key: keyof DialogState, value: boolean, item?: any, refetchData?: boolean) => void;
}
const PostDelete = ({ openDialog, valueResponse, handleShowDialog }: Props) => {
    const deletePostById = useMutation({
        mutationFn: () => deletePost(valueResponse.delete.id),
        onSuccess: () => handleShowDialog('delete',false,{},true),
        onError: () => toast.error("Cannot delete this post")
    }) 
    return (
        <Dialog open={openDialog.delete} onOpenChange={() => handleShowDialog('delete', false)}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Chi tiết bài viết</DialogTitle>
                    <DialogDescription>Xóa bài viết.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-1">
                        <Label>Are you sure for delete post with id: {valueResponse.delete.id}</Label>
                        <Input type="hidden" defaultValue={valueResponse.delete.id ?? 0} name="id"/>
                        
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </DialogClose>
                    <Button variant="destructive" type="submit" onClick={() => deletePostById.mutate()}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}   

export default PostDelete