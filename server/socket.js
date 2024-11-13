import { Server } from "socket.io";
import { server } from "./app";

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = new Map();
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId) {
    userSocketMap.set(userId, socket.id);
    console.log(`${userId} has been connected with socket id ${socket.id}`);
  } else {
    console.log("User id not provided during connection");
  }

  socket.on("disconnect", () => {
    console.log(`Client disconnected : ${socket.id}`);
    userSocketMap.delete(userId);
  });
});

export default io;
