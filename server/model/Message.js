import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  },
  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: String,
    required: () => {
      return this.messageType === "text";
    },
  },
  fileURL: {
    type: String,
    required: () => {
      return this.messageType === "file";
    },
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("message", messageSchema);

export default Message;
