"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { cva } from "class-variance-authority";
import { clsx } from "clsx";

import { Heart, X, MapPin, Briefcase } from 'lucide-react';
import{ cn } from '../components/utils';

import { Button } from '../components/Button';
import { Card, CardContent } from '../components/Card';
import { Badge } from '../components/Badge';
import { Toggle } from '../components/Toggle';



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



const mockUsers = [
  {
    id: 1,
    name: "Emma",
    age: 24,
    image: "https://images.unsplash.com/photo-1688897345095-03fbea551ef9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwcG9ydHJhaXQlMjBkYXRpbmd8ZW58MXx8fHwxNzU3NTQ0OTMzfDA&ixlib=rb-4.1.0&q=80&w=1080",
    location: "New York",
    occupation: "Designer",
    bio: "Love coffee, art galleries, and long walks in Central Park"
  },
  {
    id: 2,
    name: "James",
    age: 28,
    image: "https://images.unsplash.com/photo-1543132220-e7fef0b974e7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx5b3VuZyUyMG1hbiUyMHBvcnRyYWl0JTIwY2FzdWFsfGVufDF8fHx8MTc1NzU3MjY0OXww&ixlib=rb-4.1.0&q=80&w=1080",
    location: "Los Angeles",
    occupation: "Photographer",
    bio: "Adventure seeker, sunset chaser, and coffee enthusiast"
  },
  {
    id: 3,
    name: "Sofia",
    age: 26,
    image: "https://images.unsplash.com/photo-1694299352873-0c29d862e87a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHx3b21hbiUyMHNtaWxpbmclMjBwb3J0cmFpdHxlbnwxfHx8fDE3NTc2MTc3NTl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    location: "San Francisco",
    occupation: "Software Engineer",
    bio: "Tech lover, yoga practitioner, and foodie explorer"
  },
  {
    id: 4,
    name: "Alex",
    age: 29,
    image: "https://images.unsplash.com/photo-1622429081783-afff14ae39c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxtYW4lMjBwb3J0cmFpdCUyMGxpZmVzdHlsZXxlbnwxfHx8fDE3NTc2NDI2MjF8MA&ixlib=rb-4.1.0&q=80&w=1080",
    location: "Chicago",
    occupation: "Marketing Manager",
    bio: "Music lover, gym enthusiast, and weekend traveler"
  }
];

export function HomePage() {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [likedUsers, setLikedUsers] = useState([]);
  const [dislikedUsers, setDislikedUsers] = useState([]);

  const currentUser = mockUsers[currentUserIndex];

  const handleLike = () => {
    if (currentUser) {
      setLikedUsers([...likedUsers, currentUser.id]);
      nextUser();
    }
  };

  const handleDislike = () => {
    if (currentUser) {
      setDislikedUsers([...dislikedUsers, currentUser.id]);
      nextUser();
    }
  };

  const nextUser = () => {
    if (currentUserIndex < mockUsers.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    } else {
      setCurrentUserIndex(0); // Loop back to first user for demo
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No more users to show!</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-full flex flex-col justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentUser.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="relative">
              <img
                src={currentUser.image}
                alt={currentUser.name}
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h2 className="text-white text-2xl font-bold">
                  {currentUser.name}, {currentUser.age}
                </h2>
                <div className="flex items-center gap-2 text-white/90 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{currentUser.location}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90 mt-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{currentUser.occupation}</span>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-gray-700">{currentUser.bio}</p>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-center gap-6 mt-6">
        <Button
          size="lg"
          variant="outline"
          className="rounded-full w-16 h-16 border-2 border-red-200 hover:border-red-300 hover:bg-red-50"
          onClick={handleDislike}
        >
          <X className="h-6 w-6 text-red-500" />
        </Button>
        <Button
          size="lg"
          className="rounded-full w-16 h-16 bg-pink-500 hover:bg-pink-600"
          onClick={handleLike}
        >
          <Heart className="h-6 w-6 text-white fill-white" />
        </Button>
      </div>

      <div className="text-center mt-4 text-sm text-gray-500">
        {currentUserIndex + 1} of {mockUsers.length}
      </div>
    </div>
  );
}
