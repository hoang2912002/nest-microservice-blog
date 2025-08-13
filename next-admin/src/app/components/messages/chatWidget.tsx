'use client'
import { MessageData, useSocket } from "@/app/hook/useSocket";
import { SessionUser } from "@/app/lib/type/sessionType";
import { Button } from "@/components/ui/button";
import { MinusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { cn } from "@/lib/utils";
import { on } from "events";
import Image from "next/image";
type Props = {
    chatSessionId: string,
    session: SessionUser,
    onClose: (sessionId: string) => void,
    position: number,
    socketEmit: <T = any>(
        event: string,
        payload?: any,
        callback?: (response: T) => void
    ) => void,
    socketOn: (event: string, callback: (data: any) => void) => void,
    socketOff: (event: string) => void,
    isConnected:boolean,
    senderInfo:{
        name: string,
        avatar: string
    }
}
const ChatWidget = ({chatSessionId, session, onClose, position, socketEmit, socketOn, socketOff, isConnected, senderInfo }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages,setMessages] = useState([])
    const [inputComment, setInputComment] = useState("")
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const widgetWidth = 344; // px
    const gap = 16; // px
    const baseRight = 16;
    const fetchMessages = () => {
        socketEmit<MessageData[]>(
            'getMessagesBySessionId',
            {
                receiverId: session._id,
                role: session.roleId,
                chatSessionId: chatSessionId
            },
            (allMessages) => {
                setMessages(allMessages);
                setIsOpen(true)
            }
        );
    };
    useEffect(()=> {
        if(isConnected){
            fetchMessages()
        }
    },[isConnected])
    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);
    useEffect(() => {
        const eventName = `chatMessage:${chatSessionId}`;
        if(!isOpen) return
        socketOn(eventName, (newMsg) => {
            setMessages((prev) => [...prev, newMsg]);
        })
        return () => {
            socketOff(eventName)
        }
    },[isOpen])
    const handleInputOnchange = (e:any) => {
        const value = e.target.value;
        setInputComment(value);
        // if (!isTyping && value.trim()) {
        //     // setIsTyping(true);
        //     socket?.emit('isTyping', {
        //         senderId: session._id,
        //         receiverId: '6884bf786d59c6d04e37a0fd',
        //     });
        // }
        // if (!value.trim()) {
        //     // setIsTyping(false);
        //     socket?.emit("stopTyping", {
        //         senderId: session._id,
        //         receiverId: '6884bf786d59c6d04e37a0fd',
        //     });
        // }
        // if (typingTimeout.current) {
        //     clearTimeout(typingTimeout.current);
        // }
        // typingTimeout.current = setTimeout(()=>{
        //     // setIsTyping(false)
        //     socket?.emit("stopTyping", {
        //         senderId: session._id,
        //         receiverId: '6884bf786d59c6d04e37a0fd',
        //     });
        // },5000)
    }
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };
    return (
        <div 
            className="fixed 
                        bottom-0 
                        z-40 
                        h-100
                        bg-white border 
                        rounded-lg shadow-xl flex flex-col"
                style={{
                    width: widgetWidth,
                    right: baseRight + position * (widgetWidth + gap)
                }}
            >
                        
            <div className="p-3 border-b font-semibold bg-blue-600 text-white rounded-t-lg flex justify-between align-middle">
                <div className="flex justify-center align-middle">
                    <Image
                        src={senderInfo?.avatar ?? 'no-image.png'}
                        alt="Avatar"
                        className="w-7 h-7 rounded-full object-cover"
                        width={20}
                        height={20}
                        unoptimized
                    />
                    <p className="ml-2">{isConnected ? senderInfo?.name : "Hỗ trợ trực tuyến"}</p>
                </div>
                <Button onClick={() => {
                    setIsOpen(!isOpen)
                    onClose(chatSessionId)
                }} className="w-5 h-5 rounded-full bg-blue-600 hover:bg-blue-600 shadow-xl">
                    <MinusIcon/>
                </Button>
            </div>
            <div className="flex-1 p-3 overflow-y-auto text-sm flex-col-reverse">
                <div className="flex flex-col p-2.5 space-y-2 max-h-[300px]">
                    {
                    messages.length > 0 ? (
                        <>
                        {
                            messages.map((msg, idx) => {
                                return (
                                    <div
                                        key={idx}
                                        className={cn(
                                        "max-w-[70%] px-4 py-2 rounded-[15px] break-words text-sm",
                                        msg?.senderId === session._id
                                            ? "self-end bg-[#0084ff] text-white rounded-full"
                                            : "self-start bg-[#f1f0f0] text-black rounded-full",
                                        messages.length === +idx + 1 
                                            ? 'mb-2'
                                            : ''
                                        )}
                                    >
                                        {msg?.content}
                                    </div>
                                    
                                )}
                            )

                        }
                        {/* {isTyping && 
                                <div className="text-xs italic text-gray-500 mt-1">Đang gõ...</div>
                        } */}
                        </>
                    ) : (
                        <p className="text-gray-700 text-sm">Xin chào! Tôi có thể giúp gì?</p>
                    )}
                    <div ref={messagesEndRef} />
                </div>

            </div>
            <div className="p-2 border-t flex justify-between">
                <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    className="w-full border px-2 py-1 mx-2 text-sm focus:outline-none rounded-full h-7"
                    value={inputComment}
                    // onChange={(e) => {
                    //     setInputComment(e.target.value)
                    // }}
                    onChange={(e) => handleInputOnchange(e)}
                />
                <Button className="rounded-full w-7 h-7 bg-blue-500 hover:bg-blue-600" type="submit" onClick={() => sendMessage()}>
                    <PaperAirplaneIcon/>
                </Button>

            </div>
        </div>
    )
}

export default ChatWidget