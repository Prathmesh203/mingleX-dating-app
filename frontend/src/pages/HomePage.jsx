import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, MapPin, Briefcase, Loader } from "lucide-react";
import { Button } from "../components/Button";
import { Card, CardContent } from "../components/Card";
import { getUserFeed } from "../services/userServices";
import { useAuth } from "../context/authContext";
import { sendConnectionRequest } from "../services/connectionService";

export function HomePage() {
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const [likedUsers, setLikedUsers] = useState([]);
  const [dislikedUsers, setDislikedUsers] = useState([]);
  const [page, setPage] = useState(1);
  const { token } = useAuth();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["userFeed", page],
    queryFn: () => getUserFeed(token, page, 10),
    placeholderData: (prev) => prev,
  });

  const users = data?.data?.data?.data || [];
  const currentUser = users[currentUserIndex];

  const handleLike = async () => {
    if (currentUser) {
      await sendConnectionRequest(token, "interested", currentUser._id);
      setLikedUsers([...likedUsers, currentUser._id]);
      nextUser();
    }
  };

  const handleDislike = async () => {
    if (currentUser) {
      await sendConnectionRequest(token, "ignored", currentUser._id);
      setDislikedUsers([...dislikedUsers, currentUser._id]);
      nextUser();
    }
  };

  const nextUser = () => {
    if (currentUserIndex < users.length - 1) {
      setCurrentUserIndex(currentUserIndex + 1);
    } else {
      setPage((prev) => prev + 1);
      setCurrentUserIndex(0);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="h-8 w-8 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (isError || !users.length) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">No users available.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto h-full flex flex-col justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentUser._id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="relative">
              <img
                src={currentUser.profile || "/default-avatar.png"}
                alt={currentUser.firstname}
                className="w-full h-96 object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h2 className="text-white text-2xl font-bold">
                  {currentUser.firstname} {currentUser.lastname},{" "}
                  {currentUser.age}
                </h2>
                <div className="flex items-center gap-2 text-white/90 mt-1">
                  <MapPin className="h-4 w-4" />
                  <span>{currentUser.location || "Unknown"}</span>
                </div>
                <div className="flex items-center gap-2 text-white/90 mt-1">
                  <Briefcase className="h-4 w-4" />
                  <span>{currentUser.occupation || "Not provided"}</span>
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
        {currentUserIndex + 1} of {users.length}
      </div>
    </div>
  );
}
