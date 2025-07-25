import { Server } from "socket.io";
import Message from "./model/Message.js";
import Channel from "./model/Channel.js";
import User from "./model/User.js";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const newMessage = await Message.create(message);

    // Find the created message to get a Mongoose document
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("sender", "id email firstName lastName avatar profileTheme")
      .populate("recipient", "id email firstName lastName avatar profileTheme")
      .exec();

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", populatedMessage);
    }
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", populatedMessage);
    }
  };

  const sendChannelMessage = async (message) => {
    const { sender, content, messageType, fileURL, channelId } = message;
    const senderSocketId = userSocketMap.get(message.sender);

    const newMessage = await Message.create({
      sender,
      content,
      messageType,
      fileURL,
      channel: channelId,
      recipient: null,
      timeStamp: new Date(),
    });

    const messageData = await Message.findById(newMessage._id)
      .populate("sender", "id email firstName lastName avatar profileTheme")
      .exec();

    await Channel.findByIdAndUpdate(channelId, {
      $push: { messages: newMessage._id },
    });

    const channel = await Channel.findById(channelId).populate("members");

    const finalData = { ...messageData._doc, channel: channel._id };

    if (channel && channel.members) {
      channel.members.forEach((member) => {
        const memberSocketId = userSocketMap.get(member._id.toString());
        if (memberSocketId) {
          io.to(memberSocketId).emit("receiveChannelMessage", finalData);
        }
      });
      const adminSocketId = userSocketMap.get(channel.admin._id.toString());
      if (adminSocketId) {
        io.to(adminSocketId).emit("receiveChannelMessage", finalData);
      }
    }
  };

  io.on("connection", (socket) => {
    socket.on("userOnline", async () => {
      await User.findByIdAndUpdate(userId, { status: "online" });
      io.emit("userStatusChanged", { userId, status: "online" });
    });

    const markMsgAsRead = async ({ messageId, senderId, receiverId }) => {
      await Message.findByIdAndUpdate(messageId, { isRead: true, readAt: new Date() });

      const senderSocketId = userSocketMap.get(senderId);
      const receiverSocketId = userSocketMap.get(receiverId);
      console.log('sender socket id is ', senderSocketId);
      console.log('sender socket id is ', receiverSocketId);

      io.to(senderSocketId).emit('messageMarkedAsRead', { messageId });
      // io.to(receiverSocketId).emit('messageMarkedAsRead', { messageId });
    }

    const markChannelMsgAsRead = async ({ messageId, senderId, channelId, readerId }) => {
      await Message.updateOne({ _id: messageId, "readBy.user": { $ne: readerId } }, { $push: { readBy: { user: readerId } } });

      const reader = await User.findById(readerId).select('_id firstName lastName avatar profileTheme')

      const senderSocketId = userSocketMap.get(senderId);
      const readerSocketId = userSocketMap.get(readerId);
      io.to(senderSocketId).emit('channelMessageMarkedAsRead', { messageId, channelId, reader });
      io.to(readerSocketId).emit('channelMessageMarkedAsRead', { messageId, channelId, reader });
    }

    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`${userId} has been connected with socket id ${socket.id}`);
    } else {
      console.log("User id not provided during connection");
    }

    socket.on("sendMessage", sendMessage);
    socket.on("sendChannelMessage", sendChannelMessage);
    socket.on('markAsRead', markMsgAsRead);
    socket.on('markAsRead:channel', markChannelMsgAsRead);

    socket.on("disconnect", async () => {
      await User.findByIdAndUpdate(userId, { status: "offline" });
      io.emit("userStatusChanged", { userId, status: "offline" });
      console.log(`Client disconnected : ${socket.id}`);
      userSocketMap.delete(userId);
    });
  });
};

export default setupSocket;
