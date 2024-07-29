import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const deleteImage = (imagePath) => {
  const fullPath = path.resolve(imagePath);
  console.log(fullPath);
  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error(`Error deleting image: ${err}`);
    }
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const user = new User({
      name,
      username,
      email,
      password,
    });

    const savedUser = await user.save();

    if (savedUser) {
      res.status(201).json({
        _id: savedUser._id,
        name: savedUser.name,
        username: savedUser.username,
        email: savedUser.email,
        token: generateToken(savedUser._id),
        message: "User registered successfully",
      });
    } else {
      res.status(400).json({
        message: "Failed to save user.",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to register user: " + err.message,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token,
      message: "User logged in successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to login user: " + err.message,
    });
  }
};

const logoutUser = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "strict",
  });

  res.status(200).json({
    message: "User logged out successfully.",
  });
};

const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
      message: "Logged in user retrieved successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to retrieve logged in user: " + err.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
    }).select("name username profileImage");

    res.status(200).json({
      users,
      message: "Users retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch users: " + error.message,
    });
  }
};

const getUserByUsername = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user,
      message: "User profile retrieved successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to retrieve user profile: " + err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (req.files && req.files.profileImage) {
      if (user.profileImage) {
        deleteImage(
          path.join(
            __dirname,
            "..",
            "profileUploads",
            user.username,
            user.profileImage
          )
        );
      }
      user.profileImage = req.files.profileImage[0].filename;
    }

    if (req.files && req.files.bannerImage) {
      if (user.bannerImage) {
        deleteImage(
          path.join(
            __dirname,
            "..",
            "profileUploads",
            user.username,
            user.bannerImage
          )
        );
      }
      user.bannerImage = req.files.bannerImage[0].filename;
    }

    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
      bannerImage: updatedUser.bannerImage,
      following: updatedUser.following,
      followers: updatedUser.followers,
      posts: updatedUser.posts,
      createdAt: updatedUser.createdAt,
      message: "Profile updated successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to update profile: " + err.message,
    });
  }
};

const toggleFollow = async (req, res) => {
  try {
    const userToToggle = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToToggle) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isFollowing = currentUser.following.includes(userToToggle._id);

    if (isFollowing) {
      currentUser.following = currentUser.following.filter(
        (id) => id.toString() !== userToToggle._id.toString()
      );
      userToToggle.followers = userToToggle.followers.filter(
        (id) => id.toString() !== currentUser._id.toString()
      );
      res.status(200).json({ message: "User unfollowed successfully" });
    } else {
      currentUser.following.push(userToToggle._id);
      userToToggle.followers.push(currentUser._id);
      res.status(200).json({ message: "User followed successfully" });
    }

    await currentUser.save();
    await userToToggle.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to toggle follow status: " + err.message,
    });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  getLoggedInUser,
  getUsers,
  getUserByUsername,
  updateUser,
  toggleFollow,
};
