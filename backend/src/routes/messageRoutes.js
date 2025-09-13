const express = require('express');
const router = express.Router();
const Message = require('../models/messageModel');
const { userAuth } = require('../middlewares/auth'); 

router.get('/messages/:otherUserId', userAuth, async (req, res) => {
  try {
    const { otherUserId } = req.params;
    const loggedInUser = req.user;

    const messages = await Message.find({
      $or: [
        { senderId: loggedInUser._id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: loggedInUser._id }
      ]
    })
      .sort({ timestamp: 1 })
      .populate('senderId', 'firstname lastname profile')
      .populate('receiverId', 'firstname lastname profile')
      .limit(50);

    res.json({
      message: 'Messages fetched successfully',
      data: messages
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

module.exports = router;