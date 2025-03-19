const mongoose = require("mongoose");
const User = require('./userModels')
const connectionRequestSchema = mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref:User
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: "string",
      enum: {
        values: ["accepted", "rejected", "interested", "ignored"],
        message: "{VALUE}  is incorrect status ",
      },
    },
  },
  {
    timestamps: true,
  }
);
connectionRequestSchema.pre("save", function (next) {
  const request = this;
  if (request.fromUserId === request.toUserId) {
    throw new Error("you cant send request to yourself ");
  }
  next();
});
connectionRequestSchema.index({fromUserId:1, toUserId:1});
const ConnectionModel = mongoose.model(
  "ConnectionModel",
  connectionRequestSchema
);

module.exports = {
  ConnectionModel,
};
