const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { ConnectionModel } = require("../models/connectionModels");
const User = require("../models/userModels");
//api to get user connections
userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const loggedInUser = user._id;
    const connections = await ConnectionModel.find({
      status: "interested",
      toUserId: loggedInUser,
    }).populate("fromUserId", "firstname lastname profile gender age interest");
    const data = connections
    res.json({
      message: "connection fetched successful",
      data: data,
    });
  } catch (error) {
    res.json({
      message: error.message,
    });
  }
});

//api to get user's requests
userRouter.get("/user/request", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const loggedinUserId = user._id;
  
    const requests = await ConnectionModel.find({
      $or: [
        { toUserId: loggedinUserId, status: "accepted" },
        { fromUserId: loggedinUserId, status: "accepted" },
      ],
    })
      .populate("fromUserId", "firstname lastname profile gender age interest")
      .populate("toUserId", "firstname lastname profile gender age interest");
  
    const data = requests.map((connection) => 
      connection.fromUserId._id.toString() === loggedinUserId.toString()
        ? connection.toUserId
        : connection.fromUserId
    );
  
    res.json({
      message: "Connections fetched successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
  
});

//feed api
userRouter.get("/user/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit > 50 ? (limit = 50) : limit;
    const skip = (page - 1) * 10;
    const connections = await ConnectionModel.find({
      $or: [
        // fetching all the connection in which fromUserId or to userId is the LoggedInUser's id
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id },
      ],
    }).select("fromUserId toUserId");
    const ignoredUsers = new Set(); // the set data structure cant contain the duplicate values, so we created a set and stored all the connections in that array.
    connections.forEach((element) => {
      ignoredUsers.add(element.fromUserId);
      ignoredUsers.add(element.toUserId);
    });

    const users = await User.find({
      $and: [
        {
          _id: {
            $nin: Array.from(ignoredUsers), // the users should not in the array
            $ne: loggedInUser._id,
          },
        },
      ],
    })
      .skip(skip)
      .limit(limit);
    res.json({
      message: "user fetched successfully",
      data: users,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

module.exports = userRouter;
