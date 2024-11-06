import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import connectDB from "./database/db.js";
import ErrorHandler, { errMiddleware } from "./middleware/error.js";
import userRouter from "./routes/User.js";
import profileRouter from "./routes/Profile.js";

const app = express();
connectDB();

config();

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("Server is running on port " + port);
});

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

app.use((err, req, res, next) => {
  errMiddleware(err, req, res, next);
});

export default app;
