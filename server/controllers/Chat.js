import ErrorHandler from "../middleware/error.js";
import Message from "../model/Message.js";

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
