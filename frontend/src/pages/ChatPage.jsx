"use client";

import { useState, useMemo } from 'react';
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Card, CardContent } from '../components/Card';
import { Heart, Send, ArrowLeft } from 'lucide-react';

import { Avatar, AvatarImage, AvatarFallback } from '../components/Avatar';



const ScrollArea = ScrollAreaPrimitive.Root;


const mockConversations = [
  {
    id: 1,
    userId: 1,
    userName: "Emma",
    userImage: "https://images.unsplash.com/photo-1688897345095-03fbea551ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBkYXRpbmd8ZW58MXx8fHwxNzU3NTQ0OTMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    lastMessage: "Hey! How was your day?",
    lastMessageTime: new Date('2024-01-15T18:30:00'),
    unreadCount: 2
  },
  {
    id: 2,
    userId: 2,
    userName: "Sofia",
    userImage: "https://images.unsplash.com/photo-1694299352873-0c29d862e87a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx3b21hbiUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTc2MTc3NTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    lastMessage: "That sounds amazing!",
    lastMessageTime: new Date('2024-01-15T16:45:00'),
    unreadCount: 0
  }
];

const mockMessages = {
  1: [
    {
      id: 1,
      senderId: 1,
      text: "Hi there! Thanks for the match!",
      timestamp: new Date('2024-01-15T18:00:00')
    },
    {
      id: 2,
      senderId: 0,
      text: "Hey Emma! Nice to meet you. I loved your photos from Central Park!",
      timestamp: new Date('2024-01-15T18:15:00')
    },
    {
      id: 3,
      senderId: 1,
      text: "Thank you! I love spending time there. Do you go often?",
      timestamp: new Date('2024-01-15T18:25:00')
    },
    {
      id: 4,
      senderId: 1,
      text: "Hey! How was your day?",
      timestamp: new Date('2024-01-15T18:30:00')
    }
  ],
  2: [
    {
      id: 1,
      senderId: 2,
      text: "Hi! I see we both love tech and yoga. That's awesome!",
      timestamp: new Date('2024-01-15T16:00:00')
    },
    {
      id: 2,
      senderId: 0,
      text: "Yes! It's great to find someone with similar interests. Which yoga style do you prefer?",
      timestamp: new Date('2024-01-15T16:30:00')
    },
    {
      id: 3,
      senderId: 2,
      text: "I love vinyasa flow! There's something so peaceful about the movement and breath connection.",
      timestamp: new Date('2024-01-15T16:40:00')
    },
    {
      id: 4,
      senderId: 2,
      text: "That sounds amazing!",
      timestamp: new Date('2024-01-15T16:45:00')
    }
  ]
};

export function ChatPage({ currentUserId = 0 }) {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const message = {
      id: messages[selectedConversation.id]?.length + 1 || 1,
      senderId: currentUserId,
      text: newMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => ({
      ...prev,
      [selectedConversation.id]: [...(prev[selectedConversation.id] || []), message]
    }));

    setNewMessage('');
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return formatTime(date);
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  if (selectedConversation) {
    const conversationMessages = messages[selectedConversation.id] || [];

    return (
      <div className="h-full flex flex-col">
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

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {conversationMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.senderId === currentUserId
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.senderId === currentUserId ? 'text-pink-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

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
      <h1 className="mb-6">Messages</h1>

      <div className="space-y-2">
        {mockConversations.map((conversation) => (
          <Card
            key={conversation.id}
            className="cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => setSelectedConversation(conversation)}
          >
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={conversation.userImage} />
                  <AvatarFallback>{conversation.userName[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold truncate">{conversation.userName}</h3>
                    <span className="text-sm text-gray-500 flex-shrink-0">
                      {formatDate(conversation.lastMessageTime)}
                    </span>
                  </div>
                  <p className="text-gray-600 truncate">{conversation.lastMessage}</p>
                </div>

                {conversation.unreadCount > 0 && (
                  <div className="bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
