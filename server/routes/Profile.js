import { Router } from "express";
import {
  getAllProfiles,
  getAllProfilesForDMList,
} from "../controllers/Profile.js";
import isAuthenticated from "../middleware/auth.js";

const router = Router();

router.post("/getProfiles", isAuthenticated, getAllProfiles);
router.get("/getProfilesForDMList", isAuthenticated, getAllProfilesForDMList);

export default router;
