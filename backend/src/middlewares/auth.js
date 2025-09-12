const jwt = require("jsonwebtoken");
const User = require("../models/userModels");

const userAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error("token not found");
    }
    const token = authHeader.split(' ')[1];
    const decodedMessage = await jwt.verify(token, "Prathmesh@2003");
    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).send(error.message); // Changed to 401 for unauthorized
  }
};

module.exports = {
  userAuth,
};