import { Router } from "express";
import {
  createChannel,
  getAllChannels,
  getSearchedChannels,
  getUserChannels,
} from "../controllers/Channel.js";
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
router.post("/getSearchedChannels", isAuthenticated, getSearchedChannels);
router.get("/getUserChannels", isAuthenticated, getUserChannels);

export default router;
