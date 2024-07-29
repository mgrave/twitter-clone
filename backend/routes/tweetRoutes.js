import express from "express";
import multer from "multer";
import {
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
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
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

router.route("/following").get(protect, getFollowingTweets);

router.route("/:tweetId/like").put(protect, toggleLike);

router.route("/:tweetId/bookmark").put(protect, toggleBookmark);

router.route("/:tweetId/retweet").post(protect, toggleRetweet);

router
  .route("/:tweetId/comment")
  .post(protect, upload.single("image"), addComment);

export default router;
