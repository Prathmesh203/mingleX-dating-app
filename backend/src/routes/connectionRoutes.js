const express = require("express");
const connectionRoutes = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionModel } = require("../models/connectionModels");
const userRouter = require("./userRoutes");

// api to send the connection request 
connectionRoutes.post(
  "/request/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const user = req.user;
      const status = req.params.status;
      const toUserId = req.params.userId;
      const fromUserId = user._id;
      if (fromUserId == toUserId) {
        throw new Error("You cant send request to yourself");
      }
      const validRequest = ["interested", "ignored"];
      const isValid = validRequest.includes(status);
      if (!isValid) {
        throw new Error("Please Send a Valid Connection Request");
      }
      const existingRequest = await ConnectionModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      }); 
      if (existingRequest) {
        throw new Error("You cant send the request back ");
      }
      const availableUser = await ConnectionModel.findById(toUserId); // Fixed to await
      if (!availableUser) {
        throw new Error("cant send request to the user who doesnt exist");
      }
      const connectionRequest = new ConnectionModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        message: "Request send successfully",
        data: data,
      });
    } catch (error) {
      res.status(400).json({ // Changed to status 400 for errors
        message: error.message,
      });
    }
  }
);

// api to accept the connection request 
connectionRoutes.post("/request/user/:status/:requestId", userAuth, async (req, res) => {
  try {
    const { status, requestId } = req.params;
    const loggedInUser = req.user;
    const validStatus = ["accepted", "rejected"];
    const isValid = validStatus.includes(status);
    if (!isValid) {
      throw new Error("Status is not valid ");
    }
    const validRequest = await ConnectionModel.findOne({
      _id: requestId,
      status: "interested",
      toUserId: loggedInUser._id,
    });
    
    if (!validRequest) {
      throw new Error("Request not found ");
    }
    validRequest.status = status;
    const data = await validRequest.save();
    res.json({
      message: "request accepted successfully ",
      data: data
    });
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
});

module.exports = connectionRoutes;