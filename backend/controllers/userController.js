import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({
        message: "User already exists.",
        success: false,
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
      });
    } else {
      res.status(400).json({
        message: "Invalid user data.",
        success: false,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error. Please try again later.",
      success: false,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password.",
        success: false,
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
        success: false,
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token,
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error. Please try again later.",
      success: false,
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
    success: true,
  });
};

const toggleFollowUser = async (req, res) => {
  try {
    const userToToggle = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToToggle) {
      res.status(404).json({
        message: "User not found",
        success: false,
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
      res.json({ message: "User unfollowed successfully" });
    } else {
      currentUser.following.push(userToToggle._id);
      userToToggle.followers.push(currentUser._id);
      res.json({ message: "User followed successfully" });
    }

    await currentUser.save();
    await userToToggle.save();
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error. Please try again later.",
      success: false,
    });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("-password");

    if (!user) {
      res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.profileImage = req.body.profileImage || user.profileImage;
    user.bannerImage = req.body.bannerImage || user.bannerImage;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      profileImage: updatedUser.profileImage,
      bannerImage: updatedUser.bannerImage,
      followers: updatedUser.followers,
      following: updatedUser.following,
      bookmarks: updatedUser.bookmarks,
      likedTweets: updatedUser.likedTweets,
      message: "Profile updated successfully",
      success: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.user._id },
      followers: { $nin: [req.user._id] },
    }).select("name username profileImage");

    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

export {
  registerUser,
  loginUser,
  logoutUser,
  toggleFollowUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
};
