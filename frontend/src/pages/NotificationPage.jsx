"use client";

import { useState } from 'react';
import { Heart, MessageCircle, Star, Gift, Clock } from 'lucide-react';
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import {Avatar, AvatarImage, AvatarFallback} from '../components/Avatar';
import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { cn } from '../components/utils';


const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);


const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);


const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow",
  {
    variants: {
      variant: {
        default: "",
      },
    },
  },
);


const mockNotifications = [
  {
    id: 1,
    type: 'match',
    userName: 'Emma',
    userImage: 'https://images.unsplash.com/photo-1688897345095-03fbea551ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBkYXRpbmd8ZW58MXx8fHwxNzU3NTQ0OTMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'You have a new match! Start chatting now.',
    timestamp: new Date('2024-01-15T19:30:00'),
    isRead: false
  },
  {
    id: 2,
    type: 'like',
    userName: 'Sofia',
    userImage: 'https://images.unsplash.com/photo-1694299352873-0c29d862e87a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx3b21hbiUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTc2MTc3NTl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'liked your profile',
    timestamp: new Date('2024-01-15T18:45:00'),
    isRead: false
  },
  {
    id: 3,
    type: 'message',
    userName: 'James',
    userImage: 'https://images.unsplash.com/photo-1543132220-e7fef0b974e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0JTIwY2FzdWFsfGVufDF8fHx8MTc1NzU3MjY0OXww&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'sent you a message',
    timestamp: new Date('2024-01-15T17:20:00'),
    isRead: true
  },
  {
    id: 4,
    type: 'super_like',
    userName: 'Alex',
    userImage: 'https://images.unsplash.com/photo-1622429081783-afff14ae39c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtYW4lMjBwb3J0cmFpdCUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NTc2NDI2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'super liked your profile!',
    timestamp: new Date('2024-01-15T16:10:00'),
    isRead: true
  },
  {
    id: 5,
    type: 'like',
    userName: 'Maya',
    userImage: 'https://images.unsplash.com/photo-1688897345095-03fbea551ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBkYXRpbmd8ZW58MXx8fHwxNzU3NTQ0OTMzfDA&ixlib=rb-4.1.0&q=80&w=1080',
    message: 'liked your profile',
    timestamp: new Date('2024-01-15T14:30:00'),
    isRead: true
  }
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <Heart className="h-5 w-5 text-red-500 fill-red-500" />;
      case 'match':
        return <Heart className="h-5 w-5 text-pink-500 fill-pink-500" />;
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-500" />;
      case 'super_like':
        return <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />;
      case 'gift':
        return <Gift className="h-5 w-5 text-purple-500" />;
      default:
        return <Heart className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'match':
        return 'bg-pink-50 border-pink-200';
      case 'super_like':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const formatTime = (date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="bg-pink-500">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={markAllAsRead}
          >
            Mark all as read
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`cursor-pointer transition-colors ${
              !notification.isRead ? 'bg-blue-50 border-blue-200' : ''
            } ${getNotificationColor(notification.type)}`}
            onClick={() => markAsRead(notification.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={notification.userImage} />
                    <AvatarFallback>{notification.userName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold">{notification.userName}</span>
                      <span className="text-gray-700 ml-1">{notification.message}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      <span className="text-sm text-gray-500">
                        {formatTime(notification.timestamp)}
                      </span>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </div>

                  {notification.type === 'match' && (
                    <Button
                      size="sm"
                      className="mt-2 bg-pink-500 hover:bg-pink-600"
                    >
                      Start Chatting
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Clock className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-700">No notifications yet</h3>
          <p className="text-gray-500 mt-1">When you get likes, matches, or messages, they'll appear here.</p>
        </div>
      )}
    </div>
  );
}
