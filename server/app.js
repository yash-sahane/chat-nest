import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import connectDB from "./database/db.js";
import ErrorHandler, { errMiddleware } from "./middleware/error.js";
import userRouter from "./routes/User.js";
import profileRouter from "./routes/Profile.js";
import chatRouter from "./routes/Chat.js";
import channelRouter from "./routes/Channel.js";
import { createServer } from "http";
import setupSocket from "./socket.js";
import job from "./cron/cron.js";

// job.start();

config();

const app = express();
export const server = createServer(app);
connectDB();

app.get("/", (req, res) => {
  res.send("Hello from Express.js");
});

const port = process.env.PORT || 3001;
server.listen(port, () => {
  console.log("Server is running on port " + port);
});

setupSocket(server);

app.use(
  cors({
    origin: process.env.ORIGIN || "http://localhost:5174",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/user", userRouter);
app.use("/api/profiles", profileRouter);
app.use("/api/chat", chatRouter);
app.use("/api/channel", channelRouter);
app.use("/profiles", express.static("uploads/profiles"));
app.use("/files", express.static("uploads/files"));

app.use((err, req, res, next) => {
  errMiddleware(err, req, res, next);
});

export default app;
