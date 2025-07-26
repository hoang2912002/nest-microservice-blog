'use client'
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface NotificationData {
  content: string;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
export const useSocket = (userId: string, onNotification: (data: NotificationData) => void) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, {
      query: { userId }, // Gửi userId để socket-service lưu vào onlineUsers
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
    });

    socket.on('notification', (data: NotificationData) => {
      console.log('📩 Notification:', data);
      onNotification(data);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [userId]);
};
