import React, { useEffect } from "react";
import { createConnection } from "../services/chatServices"; // Moved import here

const ChatWindow = ({
  activeChat,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
  formatTime,
  loggedInUser, 
}) => {
  useEffect(() => {
    if (!activeChat) return;

    const socket = createConnection();
    const targetUserId = activeChat?._id;
    const loggedInUserId = loggedInUser?._id;
    socket.emit("joinchat", { loggedInUserId, targetUserId });
    return () => {
      socket.disconnect();
    };
  }, [activeChat, loggedInUser]);

  

  return (
    <div className="flex-1 flex flex-col">
      {activeChat ? (
        <>
          <div className="p-4 border-b bg-base-100 border-gray-700 flex items-center">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-base-100 flex items-center justify-center">
                {activeChat.profile && (
                  <img
                    src={activeChat.profile}
                    alt={activeChat.firstname}
                    className="h-10 w-10 rounded-full"
                  />
                )}
              </div>
            </div>
            <div className="ml-3">
              <h3 className="font-medium">
                {activeChat.firstname + " " + activeChat.lastname}
              </h3>
            </div>
          </div>

          <div className="flex-1 p-4 text-white overflow-y-auto bg-gray-900 bg-opacity-95">
            {messages[activeChat._id]?.map((message) => (
              <div
                key={message.id}
                className={`mb-3 flex ${
                  message.sender === "user"
                    ? "justify-end"
                    : message.sender === "system"
                    ? "justify-center"
                    : "justify-start"
                }`}
              >
                {message.sender === "system" ? (
                  <div className="bg-gray-800 text-gray-400 text-xs py-1 px-3 rounded-lg">
                    {message.text}
                  </div>
                ) : (
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === "user"
                        ? "bg-green-600 rounded-br-none"
                        : "bg-gray-700 rounded-bl-none"
                    }`}
                  >
                    <p>{message.text}</p>
                    <span className="text-xs block mt-1 text-gray-300 text-right">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="bg-gray-800 p-3 flex items-center"
          >
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 bg-gray-700 text-white rounded-lg py-2 px-3 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="bg-green-600 text-white p-2 rounded-full ml-2 hover:bg-green-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-base-100">
          <div className="text-center p-8">
            <div className="h-24 w-24 mx-auto mb-4 rounded-full bg-gray-800 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-semibold">Start a conversation</h2>
            <p className="text-gray-400 mt-2">
              Select a Connections to start Chatting
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatWindow;