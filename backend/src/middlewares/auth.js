const jwt = require("jsonwebtoken");
const User = require("../models/userModels");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("token not found ");
    }
    const decodedMessage = await jwt.verify(token, "Prathmesh@2003");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found ");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};
module.exports = {
  userAuth,
};
