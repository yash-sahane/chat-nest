import { Router } from "express";
import { login, logout, setup, signup } from "../controllers/User.js";
import isAuthenticated from "../middleware/auth.js";
import upload from "../multer.js";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/setup", isAuthenticated, upload.single("image"), setup);
router.get("/logout", isAuthenticated, logout);

export default router;
