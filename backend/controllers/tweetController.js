import Tweet from "../models/Tweet.js";
import User from "../models/User.js";
import { getGridFS } from "../config/gridfsConfig.js";

const getImage = async (req, res) => {
  const filename = req.params.filename;

  try {
    const gfs = getGridFS("tweet_images"); // Asegúrate de obtener la instancia de GridFS correctamente inicializada

    // Usa la colección de archivos para encontrar el archivo por su nombre
    const file = await gfs.find({ filename }).next(); // Obtiene directamente el primer archivo encontrado

    if (!file) {
      return res.status(404).json({ message: "No file found" });
    }

    // Verifica que el archivo es una imagen basada en su tipo MIME
    if (file.contentType.startsWith("image/")) {
      // Acepta cualquier tipo de imagen
      // Si es una imagen válida, crea un stream de lectura
      const readstream = gfs.openDownloadStreamByName(filename);
      readstream.pipe(res);
    } else {
      res.status(400).json({
        err: "Not an image",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

const recursiveDelete = async (tweetId) => {
  const tweetToDelete = await Tweet.findById(tweetId);

  if (tweetToDelete.image) {
    await deleteImage(tweetToDelete.image);
  }

  await User.updateMany(
    { likedTweets: tweetId },
    { $pull: { likedTweets: tweetId } }
  );
  await User.updateMany(
    { bookmarks: tweetId },
    { $pull: { bookmarks: tweetId } }
  );
  await User.updateMany(
    { posts: { $elemMatch: { tweet: tweetId } } },
    { $pull: { posts: { tweet: tweetId } } }
  );

  const commentsAndRetweets = await Tweet.find({ parentTweet: tweetId });

  for (const childTweet of commentsAndRetweets) {
    await recursiveDelete(childTweet._id);
  }

  if (tweetToDelete.parentTweet) {
    await Tweet.findByIdAndUpdate(tweetToDelete.parentTweet, {
      $pull: { comments: tweetId },
    });
  }

  await tweetToDelete.deleteOne();
};

const deleteImage = async (filename) => {
  try {
    const gfs = getGridFS("tweet_images"); // Obtén la instancia de GridFS correctamente inicializada
    const file = await gfs.find({ filename }).next();

    if (file) {
      // Elimina el archivo de GridFS utilizando el ID del archivo
      await gfs.delete(file._id);
      console.log(`Image ${filename} deleted successfully from GridFS`);
    } else {
      console.log(`Image ${filename} not found in GridFS`);
    }
  } catch (err) {
    console.error(`Error deleting image from GridFS: ${err.message}`);
  }
};

const createTweet = async (req, res) => {
  const { content } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    // Contar el número de tweets que ya existen en la base de datos
    const tweetCount = await Tweet.countDocuments();

    // Verificar si ya se alcanzó el límite de 33 tweets
    if (tweetCount >= 33) {
      return res
        .status(403)
        .json({ message: "Tweet limit reached. Cannot create more tweets." });
    }

    // Crear el nuevo tweet si el límite no se ha alcanzado
    const newTweet = await Tweet.create({
      user: req.user._id,
      content,
      image,
    });

    const postUpdate = {
      tweet: newTweet._id,
      username: req.user.username,
    };

    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: postUpdate },
    });

    const populatedTweet = await Tweet.findById(newTweet._id).populate(
      "user",
      "username profileImage"
    );

    res.status(201).json(populatedTweet);
  } catch (err) {
    res.status(500).json({ message: "Failed to create tweet: " + err.message });
  }
};

const updateTweet = async (req, res) => {
  const tweetId = req.params.tweetId;
  const { content, removeImage } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    tweet.content = content;

    // Elimina la imagen actual si se indica removeImage
    if (removeImage && tweet.image) {
      await deleteImage(tweet.image); // Elimina la imagen de GridFS
      tweet.image = null;
    }

    // Si se sube una nueva imagen, elimina la anterior y asigna la nueva
    if (image) {
      if (tweet.image) {
        await deleteImage(tweet.image); // Elimina la imagen anterior de GridFS
      }
      tweet.image = image; // Asigna la nueva imagen
    }

    const updatedTweet = await tweet.save();
    res
      .status(200)
      .json({ message: "Tweet updated successfully", tweet: updatedTweet });
  } catch (err) {
    res.status(500).json({ message: "Failed to update tweet: " + err.message });
  }
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

    await recursiveDelete(tweet._id);

    await User.findByIdAndUpdate(req.user._id, {
      $pull: { posts: { tweet: tweet._id } },
    });

    res
      .status(200)
      .json({ message: "Tweet and related data removed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete tweet: " + err.message });
  }
};

const getTweets = async (req, res) => {
  try {
    const tweets = await Tweet.find({ parentTweet: null })
      .populate("user", "name username profileImage _id")
      .sort({ createdAt: -1 });

    res.status(200).json({ message: "Tweets retrieved successfully", tweets });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve tweets: " + err.message });
  }
};

const getTweetById = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId)
      .populate("user", "username profileImage name")
      .populate("comments.user", "username profileImage");

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    res.status(200).json({ message: "Tweet retrieved successfully", tweet });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve tweet: " + err.message });
  }
};

const getFollowingTweets = async (req, res) => {
  const userId = req.params._id;
  try {
    const user = await User.findById(userId).populate({
      path: "following",
      populate: {
        path: "posts",
        model: "Tweet",
        populate: [
          {
            path: "tweet",
            model: "Tweet",
            populate: {
              path: "user",
              select: "name username profileImage",
            },
          },
        ],
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const allPosts = [];
    user.following.forEach((followingUser) => {
      allPosts.push(...followingUser.posts);
    });

    const tweetsAndRetweets = allPosts.filter(
      (post) =>
        (post.type === "tweet" || post.type === "retweet") &&
        !post.tweet.parentTweet
    );
    tweetsAndRetweets.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    res.status(200).json({
      message: "Tweets retrieved successfully",
      tweets: tweetsAndRetweets,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to retrieve tweets: " + err.message });
  }
};

const toggleLike = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedIndex = tweet.likes.indexOf(req.user._id);

    if (likedIndex === -1) {
      tweet.likes.push(req.user._id);
      user.likedTweets.push(tweet._id);
    } else {
      tweet.likes = tweet.likes.filter(
        (id) => id.toString() !== user._id.toString()
      );
      user.likedTweets = user.likedTweets.filter(
        (id) => id.toString() !== tweet._id.toString()
      );
    }

    await tweet.save();
    await user.save();

    res.status(200).json({ message: "Tweet like toggled successfully", tweet });
  } catch (err) {
    res.status(500).json({ message: "Failed to toggle like: " + err.message });
  }
};

const toggleBookmark = async (req, res) => {
  try {
    const tweet = await Tweet.findById(req.params.tweetId);
    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const bookmarkedIndex = tweet.bookmarks.indexOf(req.user._id);

    if (bookmarkedIndex === -1) {
      tweet.bookmarks.push(req.user._id);
      user.bookmarks.push(tweet._id);
    } else {
      tweet.bookmarks = tweet.bookmarks.filter(
        (id) => id.toString() !== user._id.toString()
      );
      user.bookmarks = user.bookmarks.filter(
        (id) => id.toString() !== tweet._id.toString()
      );
    }

    await tweet.save();
    await user.save();

    res
      .status(200)
      .json({ message: "Tweet bookmark toggled successfully", tweet });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to toggle bookmark: " + err.message });
  }
};

const toggleRetweet = async (req, res) => {
  const userId = req.user._id;
  const tweetId = req.params.tweetId;

  try {
    const user = await User.findById(userId);
    const tweet = await Tweet.findById(tweetId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!tweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    if (tweet.user.toString() === userId) {
      return res.status(400).json({ message: "Cannot retweet your own tweet" });
    }

    const existingRetweet = user.posts.find(
      (post) => post.tweet.toString() === tweetId && post.type === "retweet"
    );

    if (existingRetweet) {
      user.posts = user.posts.filter(
        (post) =>
          !(post.tweet.toString() === tweetId && post.type === "retweet")
      );
      tweet.retweets = tweet.retweets.filter(
        (retweetUserId) => retweetUserId.toString() !== userId.toString()
      );

      await user.save();
      await tweet.save();

      res
        .status(200)
        .json({ message: "Tweet retweet toggled successfully", tweet });
    } else {
      const newRetweet = {
        tweet: tweetId,
        type: "retweet",
        username: user.username,
      };
      user.posts.push(newRetweet);
      tweet.retweets.push(userId);

      await user.save();
      await tweet.save();

      res.status(200).json({ tweet });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to toggle retweet: " + err.message });
  }
};

const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    const image = req.file ? req.file.filename : null;

    const parentTweet = await Tweet.findById(req.params.tweetId);

    if (!parentTweet) {
      return res.status(404).json({ message: "Tweet not found" });
    }

    const comment = await Tweet.create({
      user: req.user._id,
      content,
      image,
      parentTweet: parentTweet._id,
    });

    parentTweet.comments.push(comment._id);
    await parentTweet.save();

    const commentPost = {
      tweet: comment._id,
      type: "comment",
      username: req.user.username,
    };

    await User.findByIdAndUpdate(req.user._id, {
      $push: { posts: commentPost },
    });

    const updatedTweet = await Tweet.findById(req.params.tweetId)
      .populate("user", "username profileImage")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "username profileImage",
        },
      });

    res
      .status(200)
      .json({ message: "Comment added successfully", tweet: updatedTweet });
  } catch (err) {
    res.status(500).json({ message: "Failed to add comment: " + err.message });
  }
};

export {
  getImage,
  recursiveDelete,
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
};
