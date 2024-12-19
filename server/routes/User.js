import { Router } from "express";
import {
  getAllUsers,
  getInfo,
  login,
  logout,
  setup,
  signup,
} from "../controllers/User.js";
import isAuthenticated from "../middleware/auth.js";

import multer from "multer";

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/profiles");
  },
  filename: function (req, file, cb) {
    cb(null, `${req.user.email}_${file.originalname}`);
  },
});

let upload = multer({ storage: storage });

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/", isAuthenticated, getInfo);
router.get("/getAllUsers", isAuthenticated, getAllUsers);
router.post("/setup", isAuthenticated, upload.single("image"), setup);
router.get("/logout", isAuthenticated, logout);

export default router;
