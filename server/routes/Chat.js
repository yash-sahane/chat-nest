import { Router } from "express";
import {
  downloadFile,
  getChannelChatMessages,
  getChatMessages,
  sendFile,
} from "../controllers/Chat.js";
import isAuthenticated from "../middleware/auth.js";
import multer from "multer";

const router = Router();

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/files");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

let upload = multer({ storage: storage });

router.post("/", isAuthenticated, getChatMessages);
router.post("/getChannelMessages", isAuthenticated, getChannelChatMessages);
router.post("/send_file", isAuthenticated, upload.single("file"), sendFile);
router.get("/download_file/:filename", isAuthenticated, downloadFile);

export default router;
