import React, { useState, useEffect } from "react";
import UseUserContext from "../hooks/UseUserContext";
import { getUserConnections } from "../services/connectionServices";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import { createConnection } from "../services/chatServices";

const Chat = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const { user } = UseUserContext();
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null); // Store socket instance

  const loggedInUser = {
    _id: user?._id,
    name: user?.firstname + " " + user?.lastname,
  };

  useEffect(() => {
    const getChatData = async () => {
      try {
        const response = await getUserConnections();
        setUsers(response.data);
      } catch (error) {
        console.log("Error fetching user connections", error);
      }
    };
    getChatData();
  }, []);

  useEffect(() => {
    console.log("Initializing socket connection...");
    const newSocket = createConnection(); // Ensure this function correctly returns a socket
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
    });

    newSocket.on("messageReceived", ({ senderName, senderId, text }) => {
      console.log(`Message received from ${senderName}: ${text}`);

      setMessages((prev) => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), { text, sender: "other", timestamp: new Date() }],
      }));
    });

    newSocket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      console.log("Disconnecting socket...");
      newSocket.disconnect();
    };
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !activeChat || !socket) return;

    console.log("Sending message:", {
      senderId: loggedInUser._id,
      senderName: loggedInUser.name,
      receiverId: activeChat._id,
      text: newMessage,
    });

    const userMessage = {
      id: Date.now(),
      text: newMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [activeChat._id]: [...(prev[activeChat._id] || []), userMessage],
    }));

    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u._id === activeChat._id ? { ...u, lastMessage: newMessage } : u
      )
    );

    socket.emit("sendMessage", {
      senderId: loggedInUser._id,
      senderName: loggedInUser.name,
      receiverId: activeChat._id,
      text: newMessage,
    });

    setNewMessage("");
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="flex h-screen bg-base">
      <ChatSidebar
        users={users}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
      />
      <ChatWindow
        activeChat={activeChat}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        formatTime={formatTime}
        loggedInUser={loggedInUser}
      />
    </div>
  );
};

export default Chat;
