import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import multer from "multer";
import userRoutes from "./routes/userRoutes.js";
import tweetRoutes from "./routes/tweetRoutes.js";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

const __dirname = path.resolve(path.dirname(""));

app.use(
  "/profileUploads",
  express.static(path.join(__dirname, "profileUploads"))
);

app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

app.use("/api/user", userRoutes);
app.use("/api/tweets", tweetRoutes);

app.get("/uploads", (req, res) => {
  const fs = require("fs");
  fs.readdir(path.resolve(__dirname, "uploads"), (err, files) => {
    if (err) {
      res
        .status(500)
        .json({ message: "Error reading uploads directory", error: err });
    } else {
      res.json(files);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
