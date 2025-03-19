const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const validate = require("validator");
const bcrypt = require("bcrypt");
const { profileValidation } = require("../utils/validation");
//api to view user's profile 
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("user not found ");
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.json(error.message);
  }
});
// api to edit profile information 
profileRouter.patch("/profile/edit", userAuth, (req, res) => {
  try {
    const isValid = profileValidation(req);
    if (!isValid) {
      throw new Error("data is not valid");
    }
    const loggedInUser = req.user;
    if (!loggedInUser) {
      throw new Error("user not found");
    }
    Object.keys(req.body).forEach(
      (keys) => (loggedInUser[keys] = req.body[keys])
    );
    loggedInUser.save();
    res.json({ message: "profile updated successfully", data: loggedInUser });
  } catch (error) {
    res.status(400).json(error.message);
  }
});
//api to update user's password 
profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    data = req.body;
    const { email, newPassword } = data;

    const user = req.user;

    const validEmail = user.email === email;
    if (!validEmail) {
      throw new Error("please enter your correct email address ");
    }
    const strongPassword = validate.isStrongPassword(newPassword);
    if (!strongPassword) {
      throw new Error("password is not Strong enough");
    }

    const samePassword = await user.validatePassword(newPassword);
    if (samePassword) {
      throw new Error("new and old password cant be same");
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
     await user.save();
    res.json({ message: "password updated successfully", data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = profileRouter;
