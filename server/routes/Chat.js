import { Router } from "express";
import { getChatMessages, sendFile } from "../controllers/Chat.js";
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
router.post("/send_file", isAuthenticated, upload.single("file"), sendFile);

export default router;
