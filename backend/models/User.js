import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const postSchema = new mongoose.Schema({
  tweet: { type: mongoose.Schema.Types.ObjectId, ref: "Tweet", required: true },
  type: {
    type: String,
    enum: ["tweet", "retweet", "comment"],
    default: "tweet",
  },
  createdAt: { type: Date, default: Date.now },
  username: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    followers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    following: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      default: [],
    },
    bookmarks: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }],
      default: [],
    },
    likedTweets: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Tweet" }],
      default: [],
    },
    profileImage: {
      type: String,
      default: null,
    },
    bannerImage: {
      type: String,
      default: null,
    },
    posts: {
      type: [postSchema],
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
