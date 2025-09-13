"use client";

import { useState, useMemo, useCallback, useEffect } from 'react';
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { io } from 'socket.io-client';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent } from '../components/Card';
import { Heart, Send, ArrowLeft, Loader, X } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '../components/Avatar';
import { useAuth } from '../context/authContext';
import { getUserConnections, getMessages } from '../services/userServices';
import { useQuery } from '@tanstack/react-query';

export function ChatPage({ currentUserId = 0 }) {
  const { token } = useAuth();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [socket, setSocket] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['userConnections', token],
    queryFn: () => getUserConnections(token),
    enabled: !!token,
    staleTime: 30000,
    gcTime: 300000,
    select: (data) => data?.data || [],
  });

  const connections = useMemo(() => data?.data?.data || [], [data]);
  console.log('Connections:', connections);

  // Fetch message history for selected conversation
  const { data: messageData, isLoading: messagesLoading, error: messagesError } = useQuery({
    queryKey: ['messages', selectedConversation?.id, token],
    queryFn: () => getMessages(token, selectedConversation?.id),
    enabled: !!token && !!selectedConversation?.id,
    staleTime: 30000,
    select: (data) => data?.data || [],
  });
  console.log('Message Data:', messageData);

  // Update messages when messageData changes
  useEffect(() => {
    if (messageData && selectedConversation?.id) {
      const roomId = [currentUserId, selectedConversation.id].sort().join('_');
      console.log('Updating messages for roomId:', roomId, 'with data:', messageData);
      setMessages((prev) => {
        if (JSON.stringify(prev[roomId]) !== JSON.stringify(messageData)) {
          return { ...prev, [roomId]: messageData };
        }
        return prev;
      });
    }
  }, [messageData, selectedConversation?.id, currentUserId]);

  // Initialize Socket.IO and set up message listener
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
      // Join chat rooms
      if (connections.length > 0) {
        console.log('Emitting joinChats with connections:', connections);
        newSocket.emit('joinChats', connections);
      }
    });

    newSocket.on('receiveMessage', (message) => {
      console.log('Received message:', message);
      const { senderId, receiverId } = message;
      const roomId = [senderId._id, receiverId._id].sort().join('_');
      console.log('Updating messages for roomId:', roomId);
      setMessages((prev) => {
        const currentMessages = prev[roomId] || [];
        if (!currentMessages.some((msg) => msg._id === message._id)) {
          return {
            ...prev,
            [roomId]: [...currentMessages, message],
          };
        }
        return prev;
      });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [token, connections]);

  // Handle sending messages
  const handleSendMessage = useCallback(() => {
    if (!newMessage.trim() || !selectedConversation || !socket) return;

    const message = {
      receiverId: selectedConversation.id,
      text: newMessage.trim(),
    };

    socket.emit('sendMessage', message, (response) => {
      if (response.status === 'error') {
        console.error('Failed to send message:', response.message);
      } else {
        console.log('Message sent:', response.message);
      }
    });

    setNewMessage('');
  }, [newMessage, selectedConversation, socket]);

  const formatTime = useCallback((date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }, []);

  const formatDate = useCallback((date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const inputDate = new Date(date);

    if (inputDate.toDateString() === today.toDateString()) {
      return formatTime(inputDate);
    } else if (inputDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return inputDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  }, [formatTime]);

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex justify-center items-center py-12">
          <Loader className="h-8 w-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-500">Loading conversations...</span>
        </div>
      </div>
    );
  }

  // Error state for connections
  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="text-center py-12">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <X className="h-8 w-8 text-red-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">Failed to load conversations</h3>
          <p className="text-gray-500 mt-1">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  if (selectedConversation) {
    const roomId = [currentUserId, selectedConversation.id].sort().join('_');
    const conversationMessages = messages[roomId] || [];
    console.log('Conversation Messages for roomId:', roomId, conversationMessages);

    return (
      <div className="h-full flex flex-col" key={roomId}>
        <div className="border-b p-4 flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedConversation(null)}
            className="p-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-10 w-10">
            <AvatarImage src={selectedConversation.userImage} />
            <AvatarFallback>{selectedConversation.userName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{selectedConversation.userName}</h3>
            <p className="text-sm text-gray-500">Online</p>
          </div>
        </div>

        <ScrollAreaPrimitive.Root className="flex-1 p-4">
          <ScrollAreaPrimitive.Viewport className="h-full w-full">
            <div className="space-y-4">
              {messagesLoading ? (
                <div className="flex justify-center items-center py-4">
                  <Loader className="h-6 w-6 animate-spin text-gray-500" />
                </div>
              ) : messagesError ? (
                <div className="text-center py-4">
                  <p className="text-red-500">Failed to load messages</p>
                </div>
              ) : conversationMessages?.data?.data?.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-gray-500">No messages yet</p>
                </div>
              ) : (
                conversationMessages?.data?.data?.map((message) => (
                  <div
                    key={message._id}
                    className={`flex ${message.senderId._id === currentUserId ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        message.senderId._id === currentUserId
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          message.senderId._id === currentUserId ? 'text-pink-100' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollAreaPrimitive.Viewport>
          <ScrollAreaPrimitive.Scrollbar orientation="vertical" />
        </ScrollAreaPrimitive.Root>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} className="bg-pink-500 hover:bg-pink-600">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Messages</h1>

      <div className="space-y-2">
        {connections.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700">No conversations</h3>
            <p className="text-gray-500 mt-1">Connect with users to start chatting.</p>
          </div>
        )}
        {connections.map((user) => (
          <Card
            key={user._id}
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() =>
              setSelectedConversation({
                id: user._id,
                userName: `${user.firstname} ${user.lastname}`,
                userImage: user.profile,
              })
            }
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user.profile} />
                  <AvatarFallback>{user.firstname[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold truncate">{`${user.firstname} ${user.lastname}`}</h3>
                    <span className="text-sm text-gray-500 flex-shrink-0">
                      {formatDate(new Date())}
                    </span>
                  </div>
                  <p className="text-gray-600 truncate">Start a conversation</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}