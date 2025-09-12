"use client";

import { Heart, MessageCircle, User, Bell, LogOut } from "lucide-react";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useNavigate, useLocation } from "react-router-dom";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

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

function Badge({ className, variant, ...props }) {
  return <div className={cn(badgeVariants({ variant, className }))} {...props} />;
}

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
  }
);

function Button({ className, variant, size, ...props }) {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export function Navigation({
  onLogout,
  unreadMessages = 0,
  unreadNotifications = 0,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { id: "home", icon: Heart, label: "Discover", badge: 0 },
    { id: "chat", icon: MessageCircle, label: "Chat", badge: unreadMessages },
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      badge: unreadNotifications,
    },
    { id: "profile", icon: User, label: "Profile", badge: 0 },
  ];

  const activeTab = location.pathname.replace("/", "") || "home";

  return (
    <>
      {/* Desktop Navigation */}
      <div className="hidden md:flex fixed top-0 left-0 right-0 bg-white border-b z-50">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-pink-500 fill-pink-500" />
            <span className="text-xl font-bold text-gray-900">LoveConnect</span>
          </div>

          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`relative gap-2 ${
                    isActive
                      ? "bg-pink-500 hover:bg-pink-600 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                  onClick={() => navigate(`/${tab.id}`)}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                  {tab.badge > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 min-w-5 h-5"
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}

            <Button
              variant="ghost"
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900 gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
        <div className="flex items-center justify-around px-4 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <Button
                key={tab.id}
                variant="ghost"
                size="sm"
                className={`relative flex-col gap-1 h-auto py-2 px-3 ${
                  isActive ? "text-pink-500" : "text-gray-600"
                }`}
                onClick={() => navigate(`/${tab.id}`)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs">{tab.label}</span>
                {tab.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 bg-red-500 text-xs px-1 min-w-4 h-4"
                  >
                    {tab.badge > 9 ? "9+" : tab.badge}
                  </Badge>
                )}
              </Button>
            );
          })}

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="flex-col gap-1 h-auto py-2 px-3 text-gray-600"
          >
            <LogOut className="h-5 w-5" />
            <span className="text-xs">Logout</span>
          </Button>
        </div>
      </div>
    </>
  );
}
