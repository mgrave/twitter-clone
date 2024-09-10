import User from "../models/User.js";
import Tweet from "../models/Tweet.js";
import generateToken from "../utils/generateToken.js";
import { getGridFS } from "../config/gridfsConfig.js";
import { recursiveDelete } from "./tweetController.js";

const getImage = (bucketName) => {
  return async (req, res) => {
    const filename = req.params.filename;

    try {
      const gfs = getGridFS(bucketName); // Obtén la instancia de GridFS para el bucket correcto

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
};

const deleteImage = async (filename, bucketName) => {
  try {
    const gfs = getGridFS(bucketName); // Inicializa GridFS con el bucket correcto
    const file = await gfs.find({ filename }).next();

    if (file) {
      await gfs.delete(file._id);
      console.log(`Image ${filename} deleted successfully from ${bucketName}`);
    } else {
      console.log(`Image ${filename} not found in ${bucketName}`);
    }
  } catch (err) {
    console.error(`Error deleting image from ${bucketName}: ${err.message}`);
  }
};

const recursiveDeleteUser = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
      console.log(`User with ID ${userId} not found.`);
      return;
    }

    // Eliminar imágenes de perfil y banner si existen
    if (user.profileImage) {
      await deleteImage(user.profileImage, "profile_images");
    }
    if (user.bannerImage) {
      await deleteImage(user.bannerImage, "banner_images");
    }

    // Obtener todos los tweets que el usuario ha "likado", guardado o retweeteado
    const userLikedTweets = user.likedTweets;
    const userBookmarkedTweets = user.bookmarks;

    // Actualizar los tweets que el usuario ha "likado"
    await Tweet.updateMany(
      { _id: { $in: userLikedTweets } },
      { $pull: { likes: userId } }
    );

    // Actualizar los tweets que el usuario ha guardado
    await Tweet.updateMany(
      { _id: { $in: userBookmarkedTweets } },
      { $pull: { bookmarks: userId } }
    );

    // Obtener todos los tweets que el usuario ha retweeteado
    const userRetweets = user.posts
      .filter((post) => post.type === "retweet")
      .map((post) => post.tweet);

    // Actualizar los tweets que el usuario ha retweeteado
    await Tweet.updateMany(
      { _id: { $in: userRetweets } },
      { $pull: { retweets: userId } }
    );

    // Eliminar todos los tweets del usuario
    const userTweets = await Tweet.find({ user: userId });
    for (const tweet of userTweets) {
      await recursiveDelete(tweet._id);
    }

    // Eliminar el propio usuario
    await user.deleteOne();
    console.log(`User ${userId} and related data deleted successfully.`);

    // Eliminar las referencias de seguidores en otros usuarios
    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
  } catch (error) {
    console.error(`Error deleting user ${userId}: ${error.message}`);
  }
};

// Registrar usuario con temporizador para eliminarlo después de 5 minutos
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Verificar límite de usuarios
    const userCount = await User.countDocuments();
    if (userCount >= 30) {
      return res
        .status(400)
        .json({ message: "User limit reached. Please try again later." });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Crear el nuevo usuario
    const user = new User({ name, username, email, password });
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

      // Programar la eliminación automática después de 5 minutos
      setTimeout(async () => {
        await recursiveDeleteUser(savedUser._id);
      }, 60000); // 300000ms = 5 minutos
    } else {
      res.status(400).json({ message: "Failed to save user." });
    }
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to register user: " + err.message });
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
    const users = await User.aggregate([
      { $match: { _id: { $ne: req.user._id } } }, // Excluir el usuario actual
      { $sample: { size: 8 } }, // Seleccionar 8 usuarios aleatorios
      { $project: { name: 1, username: 1, profileImage: 1 } }, // Seleccionar solo los campos necesarios
    ]);

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
    console.log(req.files.profileImage);
    // Manejo de la imagen de perfil
    if (req.files && req.files.profileImage) {
      const profileImageFile = req.files.profileImage[0];
      console.log(profileImageFile.filename);
      if (user.profileImage) {
        await deleteImage(user.profileImage, "profile_images");
      }
      user.profileImage = profileImageFile.filename;
    }

    // Manejo de la imagen de banner
    if (req.files && req.files.bannerImage) {
      const bannerImageFile = req.files.bannerImage[0];
      if (user.bannerImage) {
        await deleteImage(user.bannerImage, "banner_images");
      }
      user.bannerImage = bannerImageFile.filename;
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
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: error.message });
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
  getImage,
  registerUser,
  loginUser,
  logoutUser,
  getLoggedInUser,
  getUsers,
  getUserByUsername,
  updateUser,
  toggleFollow,
};
