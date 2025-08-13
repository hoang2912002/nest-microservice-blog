'use client'
import { handleChunkFile } from "@/app/helper/common"
import { createPost, mergeChunks } from "@/app/lib/action/post"
import { PostType } from "@/app/lib/type/modelType"
import { DialogState } from "@/app/lib/type/postType"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import dayjs from "dayjs"
import { CalendarIcon, Loader2Icon } from "lucide-react"
import Image from "next/image"
import { startTransition, useActionState, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

type AuthorType = {
    _id: string,
    name: string
}

interface Props {
    openDialog: DialogState,
    handleShowDialog: (key: keyof DialogState, value: boolean, item?: any, refetchData?: boolean) => void,
    authorData: AuthorType,
    isLoading: boolean
}
const PostCreate = ({
    openDialog,
    handleShowDialog,
    authorData,
    isLoading
}:Props) => {
    const initialState = {
        title: "",
        content: "",
        user: {
            id: "",
            name: ""
        },
        createdAt: dayjs().format("YYYY-MM-DD"),
        thumbnail: "/no-image.png",
        published: false,
        thumbnailFile: null
        
    } as any
    const [statePost, setStatePost] = useState(initialState)
    const [state,action,isPending] = useActionState(createPost,undefined)
    const [openCalendar, setOpenCalendar] = useState(false)
    const [date, setDate] = useState<Date | undefined>(dayjs().format("YYYY-MM-DD"))
    const [month, setMonth] = useState<Date | undefined>(date)
    const [dialogLoaded, setDialogLoaded] = useState(false);
    const [creating,setCreating] = useState(false)
    const handleSubmit  = async (e: React.FormEvent<HTMLFormElement>) => {
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
        setCreating(true)
    }
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
    const handleInputChange = (e, inputField:any) => {
        const value = e.target.value 
        setStatePost((prev) => ({
            ...prev,
            [inputField]: value
        }))
    }
    return (
        <>
            <Button variant="outline" onClick={() => handleShowDialog('create',true)}>Open Dialog</Button>
            <Dialog open={openDialog.create} onOpenChange={() => {
                handleShowDialog('create', false)
                setStatePost(initialState)
            }}>
                {/* <DialogTrigger asChild>
                    <Button variant="outline" onClick={() => handleShowDialog('create',true)}>Open Dialog</Button>
                </DialogTrigger> */}
                <DialogContent className="sm:max-w-[600px]">
                    <form onSubmit={handleSubmit}>

                        <DialogHeader>
                            <DialogTitle>Chi tiết bài viết</DialogTitle>
                            <DialogDescription>Cập nhật thông tin chi tiết về bài viết.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">

                            <div className="grid gap-1">
                                <Label>Title</Label>
                                <Input value={statePost?.title ?? ""} name="title" onChange={(e) => handleInputChange(e,'title')}/>
                                {
                                    state?.errorFields?.includes('title') && <div className="text-red-500">Title is required</div>
                                }
                            </div>
                            <div className="grid gap-1">
                                <Label>Content</Label>
                                <Textarea value={statePost?.content ?? ""} name="content"  onChange={(e) => handleInputChange(e,'content')}/>
                                {
                                    state?.errorFields?.includes('content') && <div className="text-red-500">Content is required</div>
                                }
                                {/* <Input  value={statePost?.content ?? ""} /> */}
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
                                            {!isLoading && authorData?.length > 0 &&
                                                authorData?.map((val) => {
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
                                {
                                    state?.errorFields?.includes('authorId') && <div className="text-red-500">AuthorId is required</div>
                                }                
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
                                    <Input type="hidden" name="createdAt" value={statePost?.createdAt} onChange={()=>{}} />
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
                                                    if(date instanceof Date){
                                                        setDate(date)
                                                        setOpenCalendar(false)
                                                        setStatePost((prev: PostType) => ({
                                                            ...prev,
                                                            createdAt: date,
                                                        }));
                                                    }
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                {
                                    state?.errorFields?.includes('createdAt') && <div className="text-red-500">CreatedAt is required</div>
                                } 
                            </div>
                            <div className="grid gap-1">
                                <Label>Thumbnail</Label>
                                <Input type="file" name="thumbnail" onChange={(e) => {
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
                                {
                                    state?.errorFields?.includes('thumbnail') && <div className="text-red-500">Thumbnail is required</div>
                                } 
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

export default PostCreate