import mongoose from "mongoose";
const mongo_uri = process.env.MONGO_URI || "mongodb://localhost:27017/";

const connectDB = async () => {
  await mongoose
    .connect(mongo_uri, {
      dbName: "chat-nest",
    })
    .then((c) => console.log("Database connected"))
    .catch((e) => console.log(e.message));
};

export default connectDB;
