'use client'
import { PostType } from "@/app/lib/type/modelType"
import { DialogState, DialogValue } from "@/app/lib/type/postType"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Popover } from "@radix-ui/react-popover"
import dayjs from "dayjs"
import { CalendarIcon } from "lucide-react"
import Image from "next/image"

type Props = {
    openDialog: DialogState
    valueResponse: DialogValue
    handleShowDialog: (key: keyof DialogState, value: boolean) => void;
}
const PostView = ({ openDialog, valueResponse, handleShowDialog }: Props) => {
    const post = valueResponse.view;
    return (
        <Dialog open={openDialog.view} onOpenChange={() => handleShowDialog('view', false)}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Chi tiết bài viết</DialogTitle>
                    <DialogDescription>Xem thông tin chi tiết về bài viết.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-1">
                        <Label>Title</Label>
                        <Input readOnly value={post?.title || ""} />
                    </div>
                    <div className="grid gap-1">
                        <Label>Slug</Label>
                        <Input readOnly value={post?.slug || ""} />
                    </div>
                    <div className="grid gap-1">
                        <Label>CreatedAt</Label>
                        <div className="relative flex gap-2">
                            <Input
                                id="date"
                                value={dayjs(post?.createdAt).format('MMMM DD, YYYY')} // → "June 01, 2025"
                                placeholder="June 01, 2025"
                                className="bg-background pr-10"
                                readOnly
                            />
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                    id="date-picker"
                                    variant="ghost"
                                    className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                                    >
                                    <CalendarIcon className="size-3.5" />
                                    <span className="sr-only">Select date</span>
                                    </Button>
                                </PopoverTrigger>
                            </Popover>
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <Label>Thumbnail</Label>
                        <div className="border border-input rounded-md px-3 py-2 w-full flex justify-center  shadow-xs transition-[color,box-shadow] outline-none">
                            <Image
                                src={post?.thumbnail || '/no-image.png'}
                                alt={post?.title || ""}
                                width={100}
                                height={100}
                                className="rounded"
                            />
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <Label>Content</Label>
                        <Textarea readOnly value={post?.content || ""} />
                        {/* <Input readOnly value={post?.content || ""} /> */}
                    </div>
                    <div className="grid gap-1">
                        <Label>Author</Label>
                        <Input readOnly value={post?.user?.name || ""} />
                    </div>
                    {/* Bạn có thể thêm các field khác tùy theo cấu trúc PostType */}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Đóng</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PostView