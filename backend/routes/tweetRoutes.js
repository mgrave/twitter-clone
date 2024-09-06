import express from "express";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import GridfsStorage from "multer-gridfs-storage";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getImage,
  createTweet,
  getTweets,
  getTweetById,
  getFollowingTweets,
  updateTweet,
  deleteTweet,
  toggleLike,
  toggleBookmark,
  toggleRetweet,
  addComment,
} from "../controllers/tweetController.js";

const router = express.Router();

const storage = new GridfsStorage({
  url: process.env.MONGO_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "tweet_images",
        };
        resolve(fileInfo);
      });
    });
  },
});

const upload = multer({ storage });

router
  .route("/")
  .post(protect, upload.single("image"), createTweet)
  .get(getTweets);

router
  .route("/:tweetId")
  .get(getTweetById)
  .put(protect, upload.single("image"), updateTweet)
  .delete(protect, deleteTweet);

router.route("/following/:_id").get(protect, getFollowingTweets);

router.route("/:tweetId/like").put(protect, toggleLike);

router.route("/:tweetId/bookmark").put(protect, toggleBookmark);

router.route("/:tweetId/retweet").post(protect, toggleRetweet);

router
  .route("/:tweetId/comment")
  .post(protect, upload.single("image"), addComment);

router.route("/image/:filename").get(getImage);

export default router;
