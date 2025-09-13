const mongoose = require("mongoose");
const validator = require("validator");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
      minLength: 3,
      MaxLength: 20,
      trim: true,
    },
    lastname: {
      type: String,
      minLength: 3,
      MaxLength: 20,
      trim: true,
      require: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      immutable: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,

      min: 17,
      max: 50,
    },
    location: {
      type: String,
      trim: true,
      default: "Not specified",
    },
    occupation: {
      type: String,
      trim: true,
      default: "Not specified",
    },
    bio: {
      type: String,
      default: "No Bio",
      MaxLength: 300,
    },
    profile: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    },
    gender: {
      type: String,
      trim: true,
      validate(value) {
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data not valid ");
        }
      },
    },
    dob: {
      type: Date,
    },
    interest: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);
UserSchema.methods.getJwt = async function () {
  const user = this;
  const token = await jsonwebtoken.sign({ _id: user._id }, "Prathmesh@2003");
  return token;
};
UserSchema.methods.validatePassword = async function (passwordByUser) {
  const user = this;
  const passwordHash = user.password;
  const validPassword = await bcrypt.compare(passwordByUser, passwordHash);
  return validPassword;
};
const User = mongoose.model("User", UserSchema);
module.exports = User;
