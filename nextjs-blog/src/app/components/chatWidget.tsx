"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChatBubbleOvalLeftEllipsisIcon, PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { MinusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SessionUser } from "../lib/session";
import { MessageData, useSocket } from "../hooks/useSocket";

type Props = {
    session: SessionUser
}
export default function ChatWidget({session}: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputComment, setInputComment] = useState("")
    const [isTyping, setIsTyping] = useState(false)
    const [messages, setMessages] = useState([])
    const typingTimeout = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    /**
        Giai thích cách hoạt động của Gửi & Nhận Tin Nhắn Qua Socket.io
        1. Hàm useEffect
            fetchMessages(); Lấy hết tất cả các tin nhắn từ trc đến nay của người đó
            on() hàm này sẽ gán 1 sự kiện 'chatMessage' nó sé chờ liên tục cho đến khi có sự kiện từ server trả về 1 arr
            off() ở đây là để ngắt kết nối server đến event 'chatMessage' khi mà isOpen = false
        2. fetchMessages đây là 1 hàm callback để nhận tin nhắn và set value
        3. useSocket 
            Ở đây đang khởi tạo 1 socket để connect đến server 
            Gửi các hàm onMessage (đây là làm callback) đi để nhận các event từ server 
            'chatMessage' là namespace để tách các socket service
    */
    useEffect(()=>{
        if (!isOpen) return;
        console.log(1)
        fetchMessages();
        on('chatMessage', (newMsg) => {
            console.log('On :', newMsg)
            if(typeof newMsg === 'object'){
                setMessages((prev) => [...prev, newMsg]);
                setIsTyping(false)
            }
        });
        on('isTyping', (data) => {
            console.log('isTyping: ',data)
            if (data == session._id) {
            setIsTyping(true);
            }
        });

        on('stopTyping', (data) => {
            console.log('stopTyping: ',data)
            if (data == session._id) {
            setIsTyping(false);
            }
        });
        return () => {
            off('chatMessage');
            off('isTyping');
            off('stopTyping');
        };
    },[isOpen])
    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);
    const fetchMessages = () => {
        emit<MessageData[]>(
            'getAllChatMessages',
            {
                senderId: session._id,
            },
            (allMessages) => {
                setMessages(allMessages);
            }
        );
    };
    const  { on, off, socket, emit } = useSocket(session._id, {
        onMessage: (data) => {
            console.log("🔔 Message received", data);
        }
    },'chatMessage');
    
    const sendMessage = () => {
        if(inputComment.trim()){
            emit(
                'createChatMessage',
                {
                    senderId: session._id,
                    receiverId: '6884bf786d59c6d04e37a0fd',
                    content: inputComment,
                    read: false,
                    status: 'pending',
                },
                (responseData) => {
                    setInputComment("")
                }
            )
        }
    }
    const handleInputOnchange = (e:any) => {
        const value = e.target.value;
        setInputComment(value);
        if (!isTyping && value.trim()) {
            // setIsTyping(true);
            socket?.emit('isTyping', {
                senderId: session._id,
                receiverId: '6884bf786d59c6d04e37a0fd',
            });
        }
        if (!value.trim()) {
            // setIsTyping(false);
            socket?.emit("stopTyping", {
                senderId: session._id,
                receiverId: '6884bf786d59c6d04e37a0fd',
            });
        }
        if (typingTimeout.current) {
            clearTimeout(typingTimeout.current);
        }
        typingTimeout.current = setTimeout(()=>{
            // setIsTyping(false)
            socket?.emit("stopTyping", {
                senderId: session._id,
                receiverId: '6884bf786d59c6d04e37a0fd',
            });
        },5000)
    }
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
    };
    return (
        <>
        {/* Chat bubble button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={
                    cn(
                        "fixed bottom-20 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg",
                        {
                            "hidden" : isOpen
                        }
                    )
                }
            >
                { !isOpen && <ChatBubbleOvalLeftEllipsisIcon className="text-xl"/>}
            </button>

            {isOpen && (
                <div className="fixed bottom-0 right-4 z-40 w-86 h-100 bg-white border rounded-lg shadow-xl flex flex-col">
                    <div className="p-3 border-b font-semibold bg-blue-600 text-white rounded-t-lg flex justify-between align-middle">
                        <p>Hỗ trợ trực tuyến</p>
                        <Button onClick={() => setIsOpen(!isOpen)} className="w-5 h-5 rounded-full bg-blue-600 hover:bg-blue-600 shadow-xl">
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
                                {isTyping && 
                                      <div className="text-xs italic text-gray-500 mt-1">Đang gõ...</div>
                                }
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
        )}
        
        </>
    );
}
