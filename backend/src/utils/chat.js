const socket = require('socket.io');

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);

    socket.on("joinchat", ({ loggedInUserId, targetUserId }) => {
      const room = [loggedInUserId, targetUserId].sort().join("_");
      console.log(`User ${loggedInUserId} joining room: ${room}`);
      socket.join(room);
    });

    socket.on("sendMessage", ({ senderId, senderName, receiverId, text }) => {
      const room = [senderId, receiverId].sort().join("_");
      console.log(`Message from ${senderName} (${senderId}) to room ${room}: ${text}`);

      io.to(room).emit("messageReceived", { senderName, senderId, text });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });
};

module.exports = initializeSocket;
