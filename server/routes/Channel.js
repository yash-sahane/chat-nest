import { Router } from "express";
import { createChannel } from "../controllers/Channel.js";
import isAuthenticated from "../middleware/auth.js";

const router = Router();

router.post("/create", isAuthenticated, createChannel);

export default router;
