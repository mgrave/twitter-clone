import express from "express";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import GridfsStorage from "multer-gridfs-storage";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getImage,
  registerUser,
  loginUser,
  logoutUser,
  getLoggedInUser,
  getUsers,
  getUserByUsername,
  updateUser,
  toggleFollow,
} from "../controllers/userController.js";

const router = express.Router();

// Configuración para las imágenes de perfil y banner combinadas
const profileImagesStorage = new GridfsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);

        // Determina el bucketName en función del tipo de archivo
        let bucketName = "profile_images";
        if (file.fieldname === "bannerImage") {
          bucketName = "banner_images";
        }

        const fileInfo = {
          filename: filename,
          bucketName: bucketName,
        };
        resolve(fileInfo);
      });
    });
  },
});

// Crear una instancia de `multer` usando el almacenamiento combinado
const uploadProfileImages = multer({ storage: profileImagesStorage });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getLoggedInUser);
router.get("/profile/:username", getUserByUsername);
router.get("/", protect, getUsers);

// Usar la instancia combinada de `multer` en el endpoint de actualización del perfil
router.put(
  "/profile/update",
  protect,
  uploadProfileImages.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "bannerImage", maxCount: 1 },
  ]),
  updateUser
);

router.put("/follow/:userId", protect, toggleFollow);

router.get("/profileImage/:filename", getImage("profile_images"));
router.get("/bannerImage/:filename", getImage("banner_images"));

export default router;
