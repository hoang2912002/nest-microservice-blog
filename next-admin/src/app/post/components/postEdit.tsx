'use client'
import PostEditForm from "./formEdit"
import { mergeChunks, updatePost } from "@/app/lib/action/post"
import { Button } from "@/components/ui/button"
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select, SelectContent, SelectGroup, SelectItem,
    SelectLabel, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react"
import dayjs from "dayjs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader, Loader2Icon } from "lucide-react"
import { PostType } from "@/app/lib/type/modelType"
import { Calendar } from "@/components/ui/calendar"
import { handleChunkFile } from "@/app/helper/common"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { DialogState, DialogValue } from "@/app/lib/type/postType"

type AuthorType = {
    _id: string,
    name: string
}
type Props = {
    openDialog: DialogState
    valueResponse: DialogValue
    handleShowDialog: (key: keyof DialogState, value: boolean, item?: any, refetchData?: boolean) => void;
    authorData: [AuthorType]
    isLoading: boolean
}
const PostEdit = ({ openDialog, valueResponse, handleShowDialog, authorData, isLoading }: Props) => {
    // return (
    //     <>
    //         {/* { openDialog.edit && valueResponse.edit && 
    //             <PostEditForm
    //                 post={valueResponse.edit}
    //                 handleShowDialog={handleShowDialog}
    //                 authorData={authorData}
    //                 isLoading={isLoading}
    //                 openDialog={openDialog}
    //             />
    //         } */}
    //     </>
    // );
    const inputRef = useRef<HTMLInputElement | null>(null);
    const initialValue = useMemo(() => valueResponse.edit, [valueResponse.edit])
    const [state, action, isPending] = useActionState(updatePost, valueResponse.edit)
    const [openCalendar, setOpenCalendar] = useState(false)
    const [date, setDate] = useState<Date | undefined>(dayjs(valueResponse.edit?.createdAt).format("YYYY-MM-DD"))
    const [month, setMonth] = useState<Date | undefined>(date)
    const [statePost, setStatePost] = useState([])
    const [pending, startTransition] = useTransition();
    const [updating, setUpdating] = useState(false);
    const [dialogLoaded, setDialogLoaded] = useState(false);
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const form = document.querySelector('form');
        if (!form) return;

        const formElement = e.currentTarget
        const formData = new FormData(form); // Lấy từ form
        let thumbnailUrl = statePost.thumbnail as string;
        if(statePost?.thumbnailFile){
            const fileName = await handleChunkFile(statePost?.thumbnailFile)
            thumbnailUrl = await mergeChunks(fileName as string)
            formData.set('thumbnail', thumbnailUrl?.data?.getMergeFile); // Ghi đè giá trị
        }
        else{
            formData.set('thumbnail', thumbnailUrl); // Ghi đè giá trị
        }

        // ✅ Gửi tới action
        startTransition(() => {
            action(formData);
        });
        setUpdating(true);
    }
    useEffect(() => {
        if (!isPending && updating) {
            handleShowDialog('edit', false, {}, true);
            toast.success('Update post successful');
        }
    }, [isPending, updating]);

    useEffect(() => {
         if (openDialog.edit && !dialogLoaded) {
            setStatePost(valueResponse.edit);
            setDialogLoaded(!dialogLoaded);
            setUpdating(false)
        }
    },[openDialog, dialogLoaded])

    const handleInputChange = (e,inputField) => {
        const value = e.target.value
        setStatePost((prev) => ({
            ...prev,
            [inputField]: value
        }))
    }
    return (
        <Dialog open={openDialog.edit} onOpenChange={() => {
            handleShowDialog('edit', false)
            setDialogLoaded(false)
        }}>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit}>

                    <DialogHeader>
                        <DialogTitle>Chi tiết bài viết</DialogTitle>
                        <DialogDescription>Cập nhật thông tin chi tiết về bài viết.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">

                        <div className="grid gap-1">
                            <Label>Title</Label>
                            <Input type="hidden" defaultValue={statePost?.id ?? 0} name="id"/>
                            <Input value={statePost?.title ?? ""} name="title" onChange={(e) => handleInputChange(e,'title')}/>
                        </div>
                        <div className="grid gap-1">
                            <Label>Content</Label>
                            <Textarea value={statePost?.content ?? ""} name="content"  onChange={(e) => handleInputChange(e,'content')}/>
                            {/* <Input  value={statePost?.content ?? ""} /> */}
                        </div>
                        <div className="grid gap-1">
                            <Label>Author</Label>
                            <Select 
                                value={statePost?.user?._id} 
                                name="authorId"
                                onValueChange={(value) => {
                                    const selectedUser = authorData.find((author) => author._id === value);
                                    if (selectedUser) {
                                    setStatePost((prev) => ({
                                        ...prev,
                                        user: selectedUser,
                                        authorId: selectedUser._id
                                    }));
                                    }
                                }}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select author" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Authors</SelectLabel>
                                        {!isLoading && authorData?.length > 0 &&
                                            authorData.map((val) => {
                                                return (
                                                    <SelectItem
                                                        value={val._id}
                                                        key={val._id}
                                                        className={val._id === statePost?.user?._id ? "bg-muted font-semibold" : ""}
                                                    >
                                                        {val.name}
                                                    </SelectItem>

                                                )
                                            }
                                            )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                        </div>
                        <div className="grid gap-1">
                            <Label>CreatedAt</Label>
                            <div className="relative flex gap-2">
                                <Input
                                    id="createdAt"
                                    value={statePost?.createdAt ? dayjs(statePost.createdAt).format('MMMM DD, YYYY') : ""}
                                    placeholder="June 01, 2025"
                                    className="bg-background pr-10"
                                    onChange={(e) => {}}
                                    readOnly
                                />
                                <Input readOnly ref={inputRef} type="hidden" name="createdAt" value={statePost?.createdAt ?? ""} onChange={()=>{}} />
                                <Popover open={openCalendar} onOpenChange={setOpenCalendar}>
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
                                    <PopoverContent
                                        className="w-auto overflow-hidden p-0"
                                        align="end"
                                        alignOffset={-8}
                                        sideOffset={10}
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            captionLayout="dropdown"
                                            month={month}
                                            onMonthChange={setMonth}
                                            onSelect={(date) => {
                                                setDate(date)
                                                setOpenCalendar(false)
                                                setStatePost((prev: PostType) => ({
                                                    ...prev,
                                                    createdAt: date,
                                                }));
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="grid gap-1">
                            <Label>Thumbnail</Label>
                            <Input ref={inputRef} type="file" name="thumbnail" onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    const previewUrl = URL.createObjectURL(file); // tạo url tạm
                                    setStatePost((prev: PostType) => ({
                                        ...prev,
                                        thumbnailFile: file,
                                        thumbnail: previewUrl
                                    }));
                                }
                            }} />
                            <div className="border border-input rounded-md px-3 py-2 w-full flex justify-center  shadow-xs transition-[color,box-shadow] outline-none">
                                <Image
                                    src={statePost?.thumbnail ?? '/no-image.png'}
                                    alt={statePost?.title ?? ""}
                                    width={100}
                                    height={100}
                                    className="rounded"
                                />
                            </div>
                        </div>
                        <div className="grid gap-1">
                            <Label htmlFor="airplane-mode">Published</Label>
                            <Switch
                            id="published"
                            name="published"
                            checked={!!statePost.published}
                            onCheckedChange={(checked) =>
                                setStatePost((prev) => ({ ...prev, published: checked }))
                            }
                            />                        
                        </div>
                        {/* Bạn có thể thêm các field khác tùy theo cấu trúc PostType */}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Đóng</Button>
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
    )
};

export default PostEdit