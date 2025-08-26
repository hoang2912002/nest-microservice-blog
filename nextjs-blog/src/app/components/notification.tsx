'use client'
import Link from "next/link"
import { SessionUser } from "../lib/session"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    BellIcon
} from "@heroicons/react/20/solid";
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import { useSocket } from "../hooks/useSocket"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getNotification, updateIsReadComment } from "../lib/action/notification"
import { Skeleton } from "@/components/ui/skeleton"
import { Notification } from "../lib/type/modelTypes";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
type Props = {
    user: SessionUser
}
interface UpdateCommentResponse {
  success: boolean;
  message: string;
  data?: any;
  statusCode: number;
  fieldError?: string;
}
const Notification = ({ user }: Props) => {
    //Nếu mà isRead bằng false là hiển thị thông báo chưa đọc
    const [isRead_Notification, setIsRead_Notification] = useState(true)
    const router = useRouter();
    const {data, isLoading, refetch } = useQuery({
        queryKey: ['GET_NOTIFICATION',user?._id],
        queryFn: async() => {
            return await getNotification({ 
                receiverId: user?._id,
                isRead: isRead_Notification
            })
        }
    })
    useSocket(user._id, {
        onNotification: (data) => {
            console.log("🔔 Notification received", data);
            refetch();
        },
    },'notification');
    const handleChange_TypeNotification = (type: boolean) => {
        setIsRead_Notification(type)
        setTimeout(()=>{
            refetch()
        },100)
    }
    const handleOnclick = (notification: Notification) => {
        if (!notification) return;
        isReadComment.mutate(notification?.id)
        const url = `/blog/${notification?.post?.slug}/${notification?.post?.id}?commentId=${notification.commentId}&notificationId=${notification.id}`;
        router.push(url);

    }
    const isReadComment = useMutation<UpdateCommentResponse, Error, number>({
        mutationFn:(id: number) => updateIsReadComment(id),
        onSuccess: () => refetch(),
        onError: () => toast.error("Không thể hủy thích bài viết này")
    })
    return (
        <>
            <Popover>
                <PopoverTrigger>
                    <div className="relative cursor-pointer">
                        <BellIcon className="w-7 h-7 text-gray-700" />
                        {data?.countAllNotification as number > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5">
                                {data?.countAllNotification}
                            </span>
                        )}
                    </div>
                </PopoverTrigger>

                <PopoverContent className="z-50 w-96 p-4 shadow-lg rounded-md">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Notification</h3>
                    <div className="flex w-full max-w-sm flex-col gap-6">
                        <Tabs defaultValue="all" onValueChange={(value) => handleChange_TypeNotification(value === 'all')}>
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="notRead">Not read</TabsTrigger>
                            </TabsList>
                            {
                                isLoading 
                                ? Array.from({length:12}).map((_,index)=>(
                                    <div  key={index} className="ml-4 mb-2 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition">
                                        <div className="flex">
                                            <Skeleton className="h-12 w-12 rounded-full" />
                                            <div className="">
                                                <Skeleton className="h-5 w-[250px] mb-2" />
                                                <Skeleton className="h-4 w-[100px]" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[250px]" />
                                        </div>
                                    </div>
                                ))
                                : <>
                                    <TabsContent value="all">
                                        <div className="space-y-3 max-h-96 overflow-y-auto">
                                            {data?.getAllNotification?.length === 0 ? (
                                                <p className="text-sm text-gray-500">Không có thông báo nào.</p>
                                            ) : (
                                                data?.getAllNotification?.map((noti) => {
                                                    return (
                                                        <div
                                                            key={`all-${noti.id}`}
                                                            onClick={()=>handleOnclick(noti)}
                                                            // href={`/blog/${noti?.post?.slug}/${noti?.post?.id}?commentId=${noti?.commentId}&notificationId=${noti?.id}`}
                                                            className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-100 transition"
                                                        >
                                                            <Image
                                                                src={noti.sender.avatar}
                                                                alt="Avatar"
                                                                className="w-10 h-10 rounded-full object-cover"
                                                                width={10}
                                                                height={10}
                                                            />
                                                            <div className="flex-1">
                                                                <p className="text-sm text-gray-800">
                                                                    <span className="font-semibold">{noti.senderName}</span> {noti.content}
                                                                </p>
                                                                <span className="text-xs text-gray-400">
                                                                    {/* {formatDistanceToNow(new Date(noti.createdAt), { addSuffix: true })} */}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                ))
                                            }
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="notRead">
                                        <div className="space-y-3 max-h-96 overflow-y-auto">
                                            {data?.getAllNotification?.length === 0 ? (
                                                <p className="text-sm text-gray-500">Không có thông báo nào.</p>
                                            ) : (
                                                data?.getAllNotification?.map((noti) => (
                                                    <div
                                                        key={`all-${noti.id}`}
                                                        onClick={()=>handleOnclick(noti)}
                                                        // href={`/blog/${noti?.post?.slug}/${noti?.post?.id}?commentId=${noti?.commentId}&notificationId=${noti?.id}`}
                                                        className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-100 transition"
                                                    >
                                                   
                                                        <Image
                                                            src={noti.sender.avatar}
                                                            alt="Avatar"
                                                            className="w-10 h-10 rounded-full"
                                                            width={10}
                                                            height={10}
                                                        />
                                                        <div className="flex-1">
                                                            <p className="text-sm text-gray-800">
                                                                <span className="font-semibold">{noti.senderName}</span> {noti.content}
                                                            </p>
                                                            <span className="text-xs text-gray-400">
                                                                {/* {formatDistanceToNow(new Date(noti.createdAt), { addSuffix: true })} */}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </TabsContent>
                                </>
                            }
                        </Tabs>
                    </div>
                </PopoverContent>
            </Popover>

        </>
    )
}

export default Notification