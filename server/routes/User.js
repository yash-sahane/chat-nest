import { Router } from "express";
import { login, setup, signup } from "../controllers/User.js";
import isAuthenticated from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/setup", isAuthenticated, setup);

export default router;
