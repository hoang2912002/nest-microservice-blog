'use client'
import Link from "next/link"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react"
import { useMutation, useQuery } from "@tanstack/react-query"
import { Skeleton } from "@/components/ui/skeleton"
import { Notification } from "../lib/type/modelTypes";
import { toast } from "sonner";
import { MessageCircleMore, Tally1 } from "lucide-react"
import { SessionUser } from "@/app/lib/type/sessionType"
import { useSocket } from "@/app/hook/useSocket"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { convertTimeChat, ROLE } from "@/app/helper/common"
import ChatWidget from "./chatWidget"
import { usePreloadedAudio } from "@/app/hook/useAudio"
type Props = {
    session: SessionUser
}
export interface ListMessageData {
    chatSessionId: string;
    senderId: string;
    receiverId: string;
    content: string;
    createdAt: string;
}
export interface ResponseListMessage {
    _id: string,
    lastMessage: string,
    lastMessageAt: string,
    senderId: string,
    senderInfo: {
        name: string,
        avatar: string,
    },
    chatSessionId: string,
    read: boolean
}
const ChatMessage = ({ session }: Props) => {
    const [isRead_Notification, setIsRead_Notification] = useState(true)
    const [isOpen, setIsOpen] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState<ResponseListMessage[]>([])
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [isLoading, setIsLoading] = useState(false)
    const audioRef = usePreloadedAudio("/mixkit-correct-answer-tone-2870.wav");
    const [openChatSessions, setOpenChatSessions] = useState<string[]>([]);
    const [senderInfoMap, setSenderInfoMap] = useState<Record<string, any>>({});
    const data = {
        getAllNotification: [],
    }
    
    const fetchMessages = () => {
        setIsLoading(true)
        emit<ListMessageData[]>(
            'getAllListChatMessages',
            {
                receiverId: session._id,
                role: session.roleId
            },
            (allMessages) => {
                setMessages(allMessages);
                setIsLoading(false)
            }
        );
    };
    const setIsReadMessage = (chatSessionId: string) => {
        emit<ListMessageData[]>(
            'setStateMessage',
            {
                receiverId: session._id,
                chatSessionId: chatSessionId
            },
            (allMessages) => {
                setMessages(allMessages);
            }
        );
    };
    const { on, off, socket, emit, isConnected } = useSocket(session._id, {
        onMessage: (data) => {
            console.log("🔔 Message received", data);
        }
    }, 'chatMessage',session.roleId);
    useEffect(() => {
        // if (!isOpen) {
        //     return
        // };
        fetchMessages();
        on('chatMessage', (newMsg) => {
            if (
                newMsg &&
                Array.isArray(newMsg?.messageData) && // bỏ qua nếu là array
                newMsg?.role === ROLE.ADMIN
            ) {
                setMessages(newMsg.messageData);
                setIsTyping(false)
                if (audioRef?.current) {
                    audioRef.current.currentTime = 0; // reset về đầu
                    audioRef.current.play().catch(err => {
                    console.log("Không thể phát audio:", err);
                    });
                }
            }
        });
        on('isTyping', (data) => {
            console.log('isTyping: ', data)
            if (data == session._id) {
                setIsTyping(true);
            }
        });

        on('stopTyping', (data) => {
            console.log('stopTyping: ', data)
            if (data == session._id) {
                setIsTyping(false);
            }
        });
        return () => {
            off('chatMessage');
            off('isTyping');
            off('stopTyping');
        };
    }, [isConnected])
    
    useEffect(() => {
        //Lấy chatSessionId và thông tin user
        const saved = localStorage.getItem("openChatSessionIds");
        const savedSenderInfo = localStorage.getItem("senderInfo_ChatSession");

        try {
            const parsedIds = saved ? JSON.parse(saved) : [];
            const parsedSenderInfo = savedSenderInfo ? JSON.parse(savedSenderInfo) : {};

            if (Array.isArray(parsedIds)) {
                setOpenChatSessions(parsedIds);
            }

            if (parsedSenderInfo && typeof parsedSenderInfo === "object") {
                setSenderInfoMap(parsedSenderInfo);
            }
        } catch (err) {
            console.error("Error parsing localStorage data", err);
            setOpenChatSessions([]);
            setSenderInfoMap({});
        }
    }, []);
    //Chuyển tab
    const handleChange_TypeNotification = (type: boolean) => {
        setIsRead_Notification(type)
        setTimeout(() => {
            // refetch()
        }, 100)
    }
    //Mở widget Chat
    const handleOpenChat = (data: ResponseListMessage) => {
        setOpenChatSessions((prev) => {
            if (prev.includes(data.chatSessionId)) return prev; // tránh mở trùng
            const updated = [...prev, data.chatSessionId];
            localStorage.setItem("openChatSessionIds", JSON.stringify(updated)); // lưu nhiều session
            return updated;
        });
        const senderMap = JSON.parse(localStorage.getItem("senderInfo_ChatSession") || "{}");
        senderMap[data.chatSessionId] = data.senderInfo; // data.senderInfo phải chứa thông tin người gửi
        localStorage.setItem("senderInfo_ChatSession", JSON.stringify(senderMap));

        setIsReadMessage(data.chatSessionId)
        setIsOpen(false)
    };
    const handleCloseChat = (sessionId: string) => {
        setOpenChatSessions((prev) => {
            const updated = prev.filter(id => id !== sessionId);
            localStorage.setItem("openChatSessionIds", JSON.stringify(updated));
            return updated;
        });
    };
    return (
        <>
            <Popover open={isOpen} onOpenChange={() => setIsOpen(!isOpen)}>
                <PopoverTrigger>
                    <div className="
                        relative 
                        w-10 h-10 
                        flex items-center justify-center 
                        rounded-full 
                        bg-white dark:bg-[#3a3b3c]
                        border border-gray-100 dark:border-gray-600
                        shadow-sm hover:shadow-lg
                        transition"
                    >
                        <MessageCircleMore
                            className="text-gray-500 dark:text-[#e4e6eb]"
                            size={23}
                        />
                    </div>
                </PopoverTrigger>

                <PopoverContent className="z-50 w-96 p-4 shadow-lg rounded-md mr-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Chat message</h3>
                    <div className="flex w-full max-w-sm flex-col gap-6">
                        <Tabs defaultValue="all" onValueChange={(value) => handleChange_TypeNotification(value === 'all')}>
                            <TabsList>
                                <TabsTrigger value="all">All</TabsTrigger>
                                <TabsTrigger value="notRead">Not read</TabsTrigger>
                            </TabsList>
                            {
                                isLoading
                                    ? Array.from({ length: 12 }).map((_, index) => (
                                        <div key={index} className=" my-2 bg-white space-y-3 transition">
                                            <div className="flex">
                                                <Skeleton className="h-13 w-13 rounded-full" />
                                                <div className="">
                                                    <Skeleton className="h-5 w-[150px] mb-2" />
                                                    <Skeleton className="h-4 w-[250px]" />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                    : <>
                                        <TabsContent value="all">
                                            <div className="space-y-3 max-h-96 overflow-y-auto">
                                                {messages.length === 0 ? (
                                                    <p className="text-sm text-gray-500">Không có thông báo nào.</p>
                                                ) : (
                                                    messages?.map((mes) => {
                                                        return (
                                                            <div
                                                                key={`${mes._id}`}
                                                                className="flex items-start gap-3 p-2 rounded-md hover:bg-gray-100 transition"
                                                                onClick={() => handleOpenChat(mes)}
                                                            >
                                                                <Image
                                                                    src={mes?.senderInfo?.avatar ?? 'no-image.png'}
                                                                    alt="Avatar"
                                                                    className="w-10 h-10 rounded-full object-cover"
                                                                    width={40}
                                                                    height={40}
                                                                    unoptimized
                                                                />
                                                                <div className="flex-1">
                                                                    {/* Dòng 1 */}
                                                                    <p className="text-base text-gray-800">
                                                                        <span className="font-semibold">{mes?.senderInfo?.name}</span>
                                                                    </p>

                                                                    {/* Dòng 2 */}
                                                                    <div className="flex items-center gap-1">
                                                                        <span
                                                                            className={cn(
                                                                                "text-sm truncate overflow-hidden whitespace-nowrap max-w-[170px]",
                                                                                !mes?.read ? "font-medium" : "text-gray-500"
                                                                            )}
                                                                        >
                                                                            {mes?.lastMessage}
                                                                        </span>
                                                                        <span className="text-sm text-gray-500">
                                                                            | {convertTimeChat(new Date(mes?.lastMessageAt))}
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                        )
                                                    }
                                                    ))
                                                }
                                            </div>
                                        </TabsContent>
                                    </>
                            }
                        </Tabs>
                    </div>
                </PopoverContent>
            </Popover>
            {openChatSessions.map((sessionId, index) => {
                const senderInfo = senderInfoMap?.[sessionId] || null
                return (
                    <ChatWidget
                        key={sessionId}
                        chatSessionId={sessionId}
                        senderInfo={senderInfo}
                        session={session}
                        onClose={() => handleCloseChat(sessionId)}
                        position={index}
                        socketEmit={emit}
                        socketOn={on}
                        socketOff={off}
                        isConnected={isConnected}
                    />
                )
            })}
        </>
    )
}

export default ChatMessage