import { Router } from "express";
import { getChatMessages } from "../controllers/Chat.js";
import isAuthenticated from "../middleware/auth.js";

const router = Router();

router.post("/", isAuthenticated, getChatMessages);

export default router;
