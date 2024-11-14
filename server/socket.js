import { Server } from "socket.io";
import Message from "./model/Message";

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const sendMessage = async (message) => {
    const senderSocketId = userSocketMap.get(message.sender);
    const recipientSocketId = userSocketMap.get(message.recipient);

    const createMessage = await Message.create(message);
  };

  const userSocketMap = new Map();
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
