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
  messageType: {
    type: String,
    enum: ["text", "file"],
    required: true,
  },
  content: {
    type: String,
    required: {
      validate: {
        validator: function (value) {
          return this.messageType === "text" ? true : false;
        },
      },
    },
  },
  fileURL: {
    type: String,
    validate: {
      validator: function (value) {
        return this.messageType === "text" ? false : true;
      },
    },
  },
  timeStamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model("message", messageSchema);

export default Message;
