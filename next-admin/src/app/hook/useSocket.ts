'use client'
import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

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
export const useSocket = (userId: string, options: UseSocketOptions, subUrl = "", role= "1010-001") => {
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
    console.log('vào rồi')
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
