import express from "express";
import {
  createTweet,
  deleteTweet,
  getTweets,
  getFollowingTweets,
  addComment,
  deleteComment,
  toggleTweetLike,
  toggleCommentLike,
  toggleTweetBookmark,
} from "../controllers/tweetController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, createTweet).get(getTweets);

router.route("/following").get(protect, getFollowingTweets);

router.route("/:tweetId").delete(protect, deleteTweet);

router.route("/:tweetId/like").put(protect, toggleTweetLike);

router.route("/:tweetId/comment/:commentId").post(protect, addComment);

router
  .route("/:tweetId/comment/:commentId")
  .delete(protect, deleteComment)
  .put(protect, toggleCommentLike);

router.route("/:tweetId/bookmark").put(protect, toggleTweetBookmark);

export default router;
