const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only JPEG, JPG, and PNG files are allowed!"));
  },
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB limit
});

profileRouter.patch("/profile/upload-picture", userAuth, upload.single("profilePicture"), async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      throw new Error("User not found");
    }

    let profileUrl = user.profile;
    if (req.file) {
      const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
      profileUrl = base64Image;
    }

    user.profile = profileUrl;
    await user.save();

    res.json({ message: "Profile picture updated successfully", data: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = profileRouter;