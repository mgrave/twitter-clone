import express from "express";
import {
  toggleFollowUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logoutUser);
router.route("/getUsers").get(protect, getUsers);
router.route("/profile/:userId").get(protect, getUserProfile);
router.route("/profile/update").put(protect, updateUserProfile);
router.route("/follow/:userId").put(protect, toggleFollowUser);

export default router;
