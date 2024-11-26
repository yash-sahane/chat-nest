import mongoose from "mongoose";

export const channelSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  members: [{ type: mongoose.Schema.ObjectId, ref: "user", required: true }],
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: "user",
    required: true,
  },
  messages: [
    { type: mongoose.Schema.ObjectId, ref: "message", required: true },
  ],
  avatar: {
    type: String,
    required: false,
  },
  profileTheme: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
});

channelSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

channelSchema.pre("findOneAndUpdate", function (next) {
  this.set({ updatedAt: Date.now() });
  next();
});

const Channel = mongoose.model("channel", channelSchema);
export default Channel;
