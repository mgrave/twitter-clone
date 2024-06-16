import Tweet from "../models/Tweet.js";
import User from "../models/User.js";

const createTweet = async (req, res) => {
  const { content } = req.body;

  const tweet = await Tweet.create({
    user: req.user._id,
    content,
  });

  res.status(201).json(tweet);
};

const deleteTweet = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    if (tweet.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this tweet" });
    }

    await tweet.deleteOne();

    res.json({ message: "Tweet removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTweets = async (req, res) => {
  const tweets = await Tweet.find()
    .sort({ createdAt: -1 })
    .populate("user", "name username");

  res.json(tweets);
};

const getFollowingTweets = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const followingIds = user.following;

  const tweets = await Tweet.find({ user: { $in: followingIds } })
    .sort({ createdAt: -1 })
    .populate("user", "name username");

  res.json(tweets);
};

const toggleTweetLike = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    const user = await User.findById(req.user._id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const likedIndex = tweet.likes.indexOf(req.user._id);

    if (likedIndex === -1) {
      tweet.likes.push(req.user._id);
      user.likedTweets.push(tweet._id);
    } else {
      tweet.likes.splice(likedIndex, 1);
      user.likedTweets = user.likedTweets.filter(
        (id) => id.toString() !== tweet._id.toString()
      );
    }

    await tweet.save();
    await user.save();

    res.json({ message: "Like toggled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const tweet = await Tweet.findById(req.params.tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const comment = {
      user: req.user._id,
      content,
    };

    tweet.comments.push(comment);
    await tweet.save();

    res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to add comment", error: err.message });
  }
};

const deleteComment = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const comment = tweet.comments.find(
      (comment) => comment._id.toString() === req.params.commentId.toString()
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.user.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to delete this comment" });
    }

    tweet.comments = tweet.comments.filter(
      (comment) => comment._id.toString() !== req.params.commentId.toString()
    );
    await tweet.save();

    res.json({ message: "Comment removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const toggleCommentLike = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const comment = tweet.comments.find(
      (comment) => comment._id.toString() === req.params.commentId.toString()
    );

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const likedIndex = comment.likes.indexOf(req.user._id);

    if (likedIndex === -1) {
      comment.likes.push(req.user._id);
    } else {
      comment.likes.splice(likedIndex, 1);
    }

    await tweet.save();

    res.json({ message: "Comment like toggled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const toggleTweetBookmark = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    const user = await User.findById(req.user._id);

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const bookmarkedIndex = tweet.bookmarks.indexOf(req.user._id);

    if (bookmarkedIndex === -1) {
      tweet.bookmarks.push(req.user._id);
      user.bookmarks.push(tweet._id);
    } else {
      tweet.bookmarks.splice(bookmarkedIndex, 1);
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== tweet._id.toString()
      );
    }

    await tweet.save();
    await user.save();

    res.json({ message: "Bookmark toggled successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  createTweet,
  deleteTweet,
  getTweets,
  getFollowingTweets,
  toggleTweetLike,
  addComment,
  deleteComment,
  toggleCommentLike,
  toggleTweetBookmark,
};
