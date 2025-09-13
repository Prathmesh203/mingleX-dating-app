const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const validate = require("validator");
const bcrypt = require("bcrypt");
const { profileValidation } = require("../utils/validation");
const { default: upload } = require("../middlewares/multer");

// api to view user's profile 
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("user not found");
    }

    const { password, __v, createdAt, updatedAt, ...Data } = req.user.toObject();

    res.json(Data);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



profileRouter.patch(
  "/profile/edit",
  userAuth,
  upload.single("profile"), // <--- multer middleware
  async (req, res) => {
    try {
      const isValid = profileValidation(req);
      if (!isValid) {
        throw new Error("data is not valid");
      }

      const loggedInUser = req.user;
      if (!loggedInUser) {
        throw new Error("user not found");
      }

      // ✅ Update only provided fields
      Object.keys(req.body).forEach((key) => {
        if (req.body[key] !== undefined && req.body[key] !== null) {
          loggedInUser[key] = req.body[key];
        }
      });

      // ✅ Handle profile picture (from memory buffer)
      if (req.file) {
        const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
          "base64"
        )}`;
        loggedInUser.profile = base64Image;
      }

      await loggedInUser.save();

      res.json({
        message: "Profile updated successfully",
        data: loggedInUser,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);


// api to update user's password 
profileRouter.patch("/profile/updatePassword", userAuth, async (req, res) => {
  try {
    const data = req.body;
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