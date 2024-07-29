import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  registerUser,
  loginUser,
  logoutUser,
  getLoggedInUser,
  getUsers,
  getUserByUsername,
  updateUser,
  toggleFollow,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Configuración del almacenamiento de multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userDir = path.join("profileUploads", req.user.username);

    // Crea la carpeta del usuario si no existe
    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    cb(null, userDir);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", logoutUser);

router.get("/me", protect, getLoggedInUser);

router.get("/profile/:username", getUserByUsername);

router.get("/", protect, getUsers);

router.put(
  "/profile/update",
  protect,
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  updateUser
);

router.put("/follow/:userId", protect, toggleFollow);

export default router;
