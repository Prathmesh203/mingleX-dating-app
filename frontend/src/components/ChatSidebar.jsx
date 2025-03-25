

import React from "react";

const ChatSidebar = ({ users, activeChat, setActiveChat }) => {
  return (
    <div className="w-1/3 border-r border-primary gap-5 flex flex-col">
      <div className="p-4 border-b border-secondary flex items-center">
        <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
          <span className="text-lg">
            <img src="logo.png" alt="" />
          </span>
        </div>
        <h2 className="ml-3 font-semibold">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {users?.map((user) => (
          <div
            key={user._id}
            onClick={() => setActiveChat(user)}
            className={`flex items-center p-3 border-b border-secondary cursor-pointer hover:bg-base-300 rounded-2xl ${
              activeChat?._id === user._id ? "bg-base-100" : ""
            }`}
          >
            <div className="relative">
              <div className="h-12 w-12 rounded-full flex items-center justify-center">
                {user.profile && (
                  <img
                    src={user.profile}
                    alt={user.firstname}
                    className="h-12 w-12 rounded-full"
                  />
                )}
              </div>
            </div>
            <h3 className="font-medium">
              {user.firstname + " " + user.lastname}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;