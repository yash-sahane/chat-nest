import { Router } from "express";
import { createChannel, getAllChannels } from "../controllers/Channel.js";
import isAuthenticated from "../middleware/auth.js";

const router = Router();

import multer from "multer";

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/profiles");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

export let upload = multer({ storage: storage });

router.post("/create", isAuthenticated, upload.single("image"), createChannel);
router.get("/getChannels", isAuthenticated, getAllChannels);

export default router;
