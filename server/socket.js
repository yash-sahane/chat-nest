import { Server } from "socket.io";
import Message from "./model/Message.js";

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
    console.log(message);

    const senderSocketId = userSocketMap.get(message.senderId);
    const recipientSocketId = userSocketMap.get(message.recipientId);

    const newMessage = (await Message.create(message))
      .populate("sender", "id email firstName lastName avatar profileTheme")
      .populate("recipient", "id email firstName lastName avatar profileTheme");

    if (senderSocketId) {
      io.to(senderSocketId).emit("receiveMessage", newMessage);
    }
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("receiveMessage", newMessage);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`${userId} has been connected with socket id ${socket.id}`);
    } else {
      console.log("User id not provided during connection");
    }

    socket.on("sendMessage", sendMessage);

    socket.on("disconnect", () => {
      console.log(`Client disconnected : ${socket.id}`);
      userSocketMap.delete(userId);
    });
  });
};

export default setupSocket;
