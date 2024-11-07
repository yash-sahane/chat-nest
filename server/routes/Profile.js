import { Router } from "express";
import { getAllProfiles } from "../controllers/Profile.js";
import isAuthenticated from "../middleware/auth.js";

const router = Router();

router.post("/getProfiles", isAuthenticated, getAllProfiles);

export default router;
