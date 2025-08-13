'use client'
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { ROLE } from '../common';

interface NotificationData {
  content: string;
}

export interface MessageData {
  chatSessionId: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: string;
}

export interface UseSocketOptions {
  onNotification?: (data: NotificationData) => void;
  onMessage?: (data: MessageData) => void;
  onTyping?: (data: any) => void
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL!;
export const useSocket = (userId: string, options: UseSocketOptions, subUrl = "", role = ROLE.USER) => {
  /**
   * I. Config Socket IO
   * 1. socketRef = useRef<Socket | null>(null)
   *    Dùng để lưu trữ socket giữa các lần render component mà ko bị re-render
   *    Nó ko giống các biến const let var sẽ bị re-render khi mà 1 comment render lại
   * 2. const socket = io(`${SOCKET_URL}/${subUrl}` 
   *    Đây là dòng connect socket đến server
   * 3. Sau đó gán socket vào biến  socketRef.current của useRef tái sử dụng
   * 4. options.onNotification | onMessage | onTyping
   *    Kiểm tra xem nếu mà biến truyền vào có 1 trong 3 callback này thì gán message cho nó
   * 5. socket.disconnect();
   *    Sẽ đóng kết nối socket đến server khi có sự kiện unmount react 
   * II.Các hàm tiện ích trả về 
   * 1. Emit
   *    Dùng để gửi event từ client đến server
   * 2. On 
   *    Hàm này dùng để lắng nghe các sự kiện bên ngoài những event như notification, message, typing
   *    Chỉ được kích hoạt khi isConnected = true
   * 3. Off
   *    Dùng để ngừng lắng nghe sư kiện khi unmount tránh bị leak 
   *
   * Lưu ý: socketRef.current là để lưu trữ biến socket hiện tại có thể dùng emit, on, off cho nó
   * 
   */
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    if (!userId) return;

    const socket = io(`${SOCKET_URL}/${subUrl}`, {
      query: { userId, role }, // Gửi userId để socket-service lưu vào onlineUsers
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
      console.log('✅ Socket connected:', socket.id);
    });

    // socket.on('notification', (data: NotificationData) => {
    //   console.log('📩 Notification:', data);
    //   onNotification(data);
    // });
    if (options.onNotification) {
      socket.on('notification', options.onNotification);
    }

    if (options.onMessage) {
      console.log('onMessage',options.onMessage)
      socket.on('message', options.onMessage);
    }

    if (options.onTyping) {
      socket.on('typing', options.onTyping);
    }

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    return () => {
      socket.disconnect();
      setIsConnected(false)
    };
  }, [userId]);

  const emit = <T = any> (event: string, data: any, callback?: (response: T) => void) => {
    if (callback) {
      socketRef.current?.emit(event, data, callback);
    } else {
      socketRef.current?.emit(event, data);
    }
  };
  const on = (event: string, callback: (...args: any[]) => void) => {
    if (isConnected && socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    if (isConnected && socketRef.current) {
      if (callback) {
        socketRef.current.off(event, callback);
      } else {
        socketRef.current.off(event);
      }
    }
  };
  return {
    emit,
    socket: socketRef.current,
    on,
    off,
    isConnected
  }
};
