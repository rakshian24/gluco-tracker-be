import express from "express";
import {
  signInUser,
  signUpUser,
  signOutUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signUp", signUpUser);
router.post("/signIn", signInUser);
router.post("/signOut", signOutUser);
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);

export default router;
