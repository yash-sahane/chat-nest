import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: false,
  },
  channel: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "channel",
    required: false,
  },
  messageType: {
    type: String,
    enum: ["text", "image", "video", "file"],
    required: true,
  },
  content: {
    type: String,
    validate: {
      validator: function (value) {
        return this.messageType === "text" ? true : false;
      },
    },
  },
  fileURL: {
    type: String,
    validate: {
      validator: function (value) {
        return this.messageType === "file" ||
          this.messageType === "image" ||
          this.messageType === "video"
          ? true
          : false;
      },
    },
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: {
    type: Date,
    default: null,
  },
  readBy: [{ user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, readAt: { type: Date, default: Date.now } }],
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("message", messageSchema);

export default Message;
