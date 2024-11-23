import { fileURLToPath } from "url";
import ErrorHandler from "../middleware/error.js";
import Message from "../model/Message.js";
import path from "path";

export const getChatMessages = async (req, res, next) => {
  try {
    const user1 = req.user;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return next(new ErrorHandler(400, "Both users are required"));
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    });

    return res.json({
      success: true,
      data: messages,
    });
  } catch (e) {
    console.log(e);
  }
};

export const sendFile = async (req, res, next) => {
  try {
    const fileName = req.file.filename;
    if (!fileName) {
      return next(ErrorHandler(404, "File not found"));
    }
    return res.json({
      success: true,
      data: fileName,
    });
  } catch (e) {
    console.log(e);
  }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const downloadFile = async (req, res, next) => {
  try {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, "../uploads/files", fileName);
    res.download(filePath);
  } catch (e) {
    console.log(e);
  }
};
