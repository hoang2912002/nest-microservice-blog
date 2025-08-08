'use client'
import { createComment } from "@/app/lib/action/comment"
import { DialogCommentState } from "@/app/lib/type/commentType"
import { PostType } from "@/app/lib/type/modelType"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2Icon } from "lucide-react"
import { useActionState, useState } from "react"

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
    isLoadingAuthor: boolean
}
const CommentCreate = ({openDialog,handleShowDialog,postData, isLoading, authorData, isLoadingAuthor}: Props) => {
    const initialState = {
        content:"",
        postId: "",
        authorId: "",
        userName: "",
    }
    const [statePost, setStatePost] = useState(initialState)
    const [state, action] = useActionState(createComment,undefined)
    const [creating, setCreating] = useState(false)
    const handleSubmit = (e) => {

    } 
    const handleInputChange = (e: any, inputField: string) => {
        const {value} = e?.target
        setStatePost((prev) => ({
            ...prev,
            [inputField]: value
        }))
    }
    console.log(postData)
    return (
        <>
            <Button variant="outline" onClick={() => handleShowDialog('create',true)}>Open Dialog</Button>
            <Dialog open={openDialog.create} onOpenChange={() => {
                handleShowDialog('create', false)
                setStatePost(initialState)
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <form onSubmit={handleSubmit}>
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
                                <Select value={statePost?.authorId} name="authorId">
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select author" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Posts</SelectLabel>
                                            {!isLoading && postData?.length > 0 &&
                                                postData?.map((val) => {
                                                    return (
                                                        <SelectItem
                                                            value={val.id}
                                                            key={val.id}
                                                            className={val.id === statePost?.postId ? "bg-muted font-semibold" : ""}
                                                        >
                                                            {val.title}
                                                        </SelectItem>

                                                    )
                                                }
                                                )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {
                                    state?.errorFields?.includes('authorId') && <div className="text-red-500">Post is required</div>
                                }                
                            </div>
                            <div className="grid gap-1">
                                <Label>Author</Label>
                                <Select value={statePost?.user?._id} name="authorId">
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select author" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Authors</SelectLabel>
                                            {!isLoadingAuthor && authorData?.length > 0 &&
                                                authorData?.map((val) => {
                                                    return (
                                                        <SelectItem
                                                            value={val._id}
                                                            key={val._id}
                                                            className={val._id === statePost?.authorId ? "bg-muted font-semibold" : ""}
                                                        >
                                                            {val.name}
                                                        </SelectItem>

                                                    )
                                                }
                                                )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
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