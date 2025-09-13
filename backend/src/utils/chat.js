const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('../models/messageModel');

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // authenticating socket connections
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error: No token provided'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Prathmesh@2003');
      socket.user = decoded; 
      next();
    } catch (error) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  // Handle Socket.IO connections
  io.on('connection', (socket) => {
    const userId = socket.user._id;
    console.log(`User ${userId} connected`);

    // Join chat rooms for connections
    socket.on('joinChats', (connections) => {
      connections.forEach((connection) => {
        const otherUserId = connection._id;
        const roomId = [userId, otherUserId].sort().join('_');
        socket.join(roomId);
        console.log(`User ${userId} joined room ${roomId}`);
      });
    });

    // Handle sending messages
    socket.on('sendMessage', async ({ receiverId, text }, callback) => {
      try {
        const senderId = userId;
        const roomId = [senderId, receiverId].sort().join('_');

        // Save message to database
        const message = new Message({
          senderId,
          receiverId,
          text
        });
        const savedMessage = await message.save();

        // Populate sender/receiver data
        const populatedMessage = await Message.findById(savedMessage._id)
          .populate('senderId', 'firstname lastname profile')
          .populate('receiverId', 'firstname lastname profile');

        // Emit message to room
        io.to(roomId).emit('receiveMessage', populatedMessage);

        callback({ status: 'success', message: populatedMessage });
      } catch (error) {
        console.error('Error sending message:', error);
        callback({ status: 'error', message: error.message });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User ${userId} disconnected`);
    });
  });

  return io;
};

module.exports = initializeSocket;