/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import {
  FaRegComment,
  FaRegHeart,
  FaHeart,
  FaRegBookmark,
  FaBookmark,
} from "react-icons/fa";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { RiImageAddLine } from "react-icons/ri";
import { RiImageEditLine } from "react-icons/ri";
import { SlOptions } from "react-icons/sl";
import instance from "../utils/axiosConfig.js";
import { useAuth } from "../utils/AuthContext.jsx";
import { useNavigate } from "react-router-dom";
import { IoClose } from "react-icons/io5";
import { timeSince } from "../utils/timeSince.js";
import { ProfileAvatar } from "./ProfileAvatar.jsx";

const SERVER = import.meta.env.VITE_SERVER_URL;
const Tweet = ({
  tweet,
  onClick,
  onTweetDelete,
  type,
  rtUser,
  onCommentClick,
}) => {
  const {
    user,
    content: initialContent,
    image: initialImage,
    likes: initialLikes,
    comments,
    retweets: initialRetweets,
    createdAt,
    bookmarks: initialBookmarks,
    _id,
  } = tweet;

  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isRetweeted, setIsRetweeted] = useState(false);
  const [likes, setLikes] = useState(initialLikes);
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [retweets, setRetweets] = useState(initialRetweets);
  const [showOptions, setShowOptions] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const username = currentUser.username;

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [tweetImage, setTweetImage] = useState(initialImage);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadImage, setUploadImage] = useState(null);
  const [removeImage, setRemoveImage] = useState(false);
  const optionsRef = useRef(null);

  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // Calculamos la fecha solo una vez
    setFormattedDate(timeSince(createdAt));
  }, [createdAt]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchTweetData = async () => {
      try {
        const response = await instance.get(`/api/tweets/${_id}`);
        if (response.status === 200) {
          setLikes(response.data.tweet.likes);
          setBookmarks(response.data.tweet.bookmarks);
          setRetweets(response.data.tweet.retweets);

          setIsLiked(response.data.tweet.likes.includes(currentUser._id));

          setIsBookmarked(
            response.data.tweet.bookmarks.includes(currentUser._id)
          );

          setIsRetweeted(
            response.data.tweet.retweets.includes(currentUser._id)
          );
        }
      } catch (error) {
        console.error("Error al obtener los datos del tweet:", error);
      }
    };

    const checkFollowingStatus = async () => {
      try {
        const response = await instance.get(
          `/api/user/profile/${user.username}`
        );
        if (response.status === 200) {
          setIsFollowing(
            response.data.user.followers.includes(currentUser._id)
          );
        }
      } catch (error) {
        console.error("Error al verificar el estado de seguimiento:", error);
      }
    };

    fetchTweetData();
    checkFollowingStatus();
  }, []);

  const handleLike = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Usar el valor anterior de isLiked para asegurarse de que se actualice correctamente
    setIsLiked((prevIsLiked) => {
      if (!prevIsLiked) {
        setLikes([...likes, username]); // Agregar like si no está marcado
      } else {
        setLikes(likes.filter((user) => user !== username)); // Quitar like si ya está marcado
      }
      return !prevIsLiked; // Invertir el estado de like
    });

    try {
      const response = await instance.put(`/api/tweets/${_id}/like`);
      if (response.status === 200) {
        setLikes(response.data.tweet.likes); // Actualizar likes con el valor del servidor
      } else {
        setIsLiked((prev) => !prev); // Revertir el cambio si la respuesta no es exitosa
      }
    } catch (error) {
      console.error("Error al dar like al tweet:", error);
      setIsLiked((prev) => !prev); // Revertir el cambio en caso de error
    }
  };

  const handleBookmark = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Usar el valor anterior de isBookmarked para asegurarte de que se actualice correctamente
    setIsBookmarked((prevIsBookmarked) => {
      if (!prevIsBookmarked) {
        setBookmarks([...bookmarks, username]); // Agregar bookmark si no está marcado
      } else {
        setBookmarks(bookmarks.filter((user) => user !== username)); // Quitar bookmark si ya está marcado
      }
      return !prevIsBookmarked; // Invertir el estado de bookmark
    });

    try {
      const response = await instance.put(`/api/tweets/${_id}/bookmark`);
      if (response.status === 200) {
        setBookmarks(response.data.tweet.bookmarks); // Actualizar bookmarks con el valor del servidor
      } else {
        setIsBookmarked((prev) => !prev); // Revertir el cambio si la respuesta no es exitosa
      }
    } catch (error) {
      console.error("Error al guardar el tweet:", error);
      setIsBookmarked((prev) => !prev); // Revertir el cambio en caso de error
    }
  };

  const handleRetweet = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    // Usar el valor anterior de isRetweeted para asegurarse de que se actualice correctamente
    setIsRetweeted((prevIsRetweeted) => {
      if (!prevIsRetweeted) {
        setRetweets([...retweets, username]); // Agregar retweet si no está marcado
      } else {
        setRetweets(retweets.filter((user) => user !== username)); // Quitar retweet si ya está marcado
      }
      return !prevIsRetweeted; // Invertir el estado de retweet
    });

    try {
      const response = await instance.post(`/api/tweets/${_id}/retweet`);
      if (response.status === 200) {
        setRetweets(response.data.tweet.retweets); // Actualizar retweets con el valor del servidor
      } else {
        setIsRetweeted((prev) => !prev); // Revertir el cambio si la respuesta no es exitosa
      }
    } catch (error) {
      console.error("Error al retweetear:", error);
      setIsRetweeted((prev) => !prev); // Revertir el cambio en caso de error
    }
  };

  const handleProfileClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/${user.username}`);
  };

  const handleOptionsClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setShowOptions(!showOptions);
  };

  const handleFollow = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const response = await instance.put(`/api/user/follow/${user._id}`);
      if (response.status === 200) {
        setIsFollowing(!isFollowing);
      }
    } catch (error) {
      console.error("Error al seguir/dejar de seguir al usuario:", error);
    }
    setShowOptions(false);
  };

  const handleDelete = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await instance.delete(`/api/tweets/${_id}`);
      onTweetDelete(_id);
    } catch (error) {
      console.error("Error al eliminar el tweet:", error);
    }
    setShowOptions(false);
  };

  const handleEdit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsEditing(true);
    setShowOptions(false);
  };

  const handleImageUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.target.files[0];
    setUploadImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleImageChange = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTweetImage(null);
    const file = e.target.files[0];
    setUploadImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setTweetImage(null);
    setImagePreview(null);
    setRemoveImage(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const formData = new FormData();
      formData.append("content", content);

      if (removeImage) {
        formData.append("removeImage", true);
      } else if (tweetImage) {
        formData.append("image", tweetImage);
      } else if (imagePreview && uploadImage) {
        formData.append("image", uploadImage);
      }

      const response = await instance.put(`/api/tweets/${_id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        setIsEditing(false);
        setContent(response.data.tweet.content);
        setTweetImage(response.data.tweet.image);
        setImagePreview(null);
        setRemoveImage(false);
      }
    } catch (error) {
      console.error("Error al editar el tweet:", error);
    }
  };

  const handleCancelEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditing(false);
    setContent(initialContent);
    setTweetImage(initialImage);
    setImagePreview(null);
  };

  const handleClick = (event) => {
    event.stopPropagation();
    onClick(tweet);
  };

  const handleCommentClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onCommentClick();
  };

  return (
    <div
      className="border-b border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 hover:bg-opacity-70 transition-colors duration-300 dark:hover:bg-gray-300 dark:hover:bg-opacity-5"
      onClick={handleClick}
    >
      <div className={`${type !== "retweet" ? "pt-4" : "pt-1"}`}>
        {type === "retweet" && (
          <div className="ml-10 flex items-center">
            <HiArrowPathRoundedSquare
              size={16}
              className="text-gray-600 dark:text-white"
            />
            <span className="ml-2 text-gray-600 font-semibold text-sm dark:text-white">
              {rtUser === username ? "reposteaste" : `@${rtUser} reposteó`}
            </span>
          </div>
        )}
        <div className="flex px-4 pb-1 flex-col">
          <div className="flex w-full">
            <ProfileAvatar
              name={user.name}
              username={user.username}
              profileImage={user.profileImage}
              profileClick={handleProfileClick}
            />
            <div className="ml-2 w-[calc(100%-48px)]">
              <div className="flex items-center justify-between h-[40px] xxsm">
                <span className="flex xxsm-n">
                  <h1
                    className="font-bold hover:underline text-black dark:text-white xxsm-un"
                    onClick={handleProfileClick}
                  >
                    {user.name}
                  </h1>
                  <p
                    className="text-gray-500 flex items-center ml-1 xxsm-un"
                    onClick={handleProfileClick}
                  >
                    @{user.username} · {formattedDate}
                  </p>
                </span>
                <div className="relative text-gray-500" ref={optionsRef}>
                  {!isEditing ? (
                    <>
                      <div
                        className="p-2.5 hover:bg-sky-400 hover:bg-opacity-15 rounded-full cursor-pointer hover:text-sky-500 transition-colors duration-300"
                        onClick={handleOptionsClick}
                      >
                        <SlOptions size={"16"} className="text-inherit" />
                      </div>
                      {showOptions && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden dark:bg-black dark:border-gray-600">
                          {user._id === currentUser._id ? (
                            <>
                              {!isEditing ? (
                                <button
                                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-700 hover:bg-opacity-5 transition-colors duration-300 dark:text-white dark:hover:bg-gray-300 dark:hover:bg-opacity-15"
                                  onClick={handleEdit}
                                >
                                  Editar
                                </button>
                              ) : (
                                <></>
                              )}
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-700 hover:bg-opacity-5 transition-colors duration-300 dark:text-white dark:hover:bg-gray-300 dark:hover:bg-opacity-15"
                                onClick={handleDelete}
                              >
                                Eliminar
                              </button>
                            </>
                          ) : (
                            <button
                              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-700 hover:bg-opacity-5 transition-colors duration-300 dark:text-white"
                              onClick={handleFollow}
                            >
                              {isFollowing ? "Dejar de seguir" : "Seguir"}
                            </button>
                          )}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex gap-1">
                      <button
                        className="block w-full text-left px-2 py-1 text-black border border-gray-800 hover:bg-gray-900 hover:bg-opacity-5 transition-colors duration-300 rounded-lg dark:text-white dark:border-gray-600 dark:hover:bg-gray-800"
                        onClick={handleCancelEdit}
                      >
                        Cancelar
                      </button>
                      <button
                        className="block w-full text-left px-2 py-1 text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-300 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                        onClick={handleSaveEdit}
                      >
                        Guardar
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {!isEditing ? (
                <p className="text-black dark:text-white break-words">
                  {content}
                </p>
              ) : (
                <div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="mt-2 p-1 border border-gray-300 rounded-lg w-full resize-none dark:text-white dark:bg-black dark:border-gray-600"
                  />
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-auto rounded-2xl"
                      />
                      <button
                        className="absolute top-1 right-1 w-[32px] h-[32px]"
                        onClick={handleRemoveImage}
                      >
                        <div className="absolute w-[32px] h-[32px] opacity-70 bg-slate-950 rounded-full top-0 right-0"></div>
                        <IoClose
                          size={20}
                          className="absolute top-1.5 right-1.5 text-white"
                        />
                      </button>

                      <label
                        className="absolute z-50 translate-y-[-50%] top-[50%] translate-x-[-50%] left-[50%] h-[40px] w-[40px] rounded-full bg-gray-700 text-white hover:bg-sky-200 hover:text-sky-400 cursor-pointer flex items-center justify-center transition-colors duration-300"
                        htmlFor="edit-image-tweet"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <RiImageEditLine
                          className="cursor-pointer"
                          size={"20"}
                        />
                        <input
                          id="edit-image-tweet"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            handleImageChange(e);
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                  )}
                </div>
              )}
              {tweetImage && (
                <div className="relative">
                  <img
                    src={`${SERVER}/api/tweets/image/${tweetImage}`}
                    alt="tweet"
                    className="mt-2 rounded-lg max-h-[550px]"
                  />
                  {isEditing && (
                    <>
                      <button
                        className="absolute top-1 right-1 w-[32px] h-[32px]"
                        onClick={handleRemoveImage}
                      >
                        <div className="absolute w-[32px] h-[32px] opacity-70 bg-slate-950 rounded-full top-0 right-0"></div>
                        <IoClose
                          size={20}
                          className="absolute top-1.5 right-1.5 text-white"
                        />
                      </button>
                      <label
                        className="absolute z-50 translate-y-[-50%] top-[50%] translate-x-[-50%] left-[50%] h-[40px] w-[40px] rounded-full bg-gray-700 text-white hover:bg-sky-200 hover:text-sky-400 cursor-pointer flex items-center justify-center transition-colors duration-300"
                        htmlFor="edit-image-tweet"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <RiImageEditLine
                          className="cursor-pointer"
                          size={"20"}
                        />
                        <input
                          id="edit-image-tweet"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    </>
                  )}
                </div>
              )}
              {isEditing && !imagePreview && !tweetImage && (
                <label
                  htmlFor="edit-image-tweet"
                  className="flex items-center justify-center h-[30px] w-[30px] rounded-full hover:bg-sky-400 hover:bg-opacity-15 cursor-pointer transition-colors duration-300"
                  onClick={(e) => e.stopPropagation()}
                >
                  <RiImageAddLine
                    className="text-sky-500 cursor-pointer"
                    size={"16"}
                  />
                  <input
                    id="edit-image-tweet"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="mt-2 hidden"
                  />
                </label>
              )}
              <div className="flex justify-between mt-3">
                <div
                  className={`flex items-center hover:text-sky-500 text-gray-400`}
                >
                  <div
                    className="p-2.5 hover:bg-sky-200 rounded-full cursor-pointer hover:bg-opacity-60 transition-colors duration-300 dark:hover:bg-sky-400 dark:hover:bg-opacity-15"
                    onClick={handleCommentClick}
                  >
                    <FaRegComment size={"16"} className="text-inherit" />
                  </div>
                  <span className="ml-0.25 text-inherit">
                    {comments ? comments.length : 0}
                  </span>
                </div>

                <div
                  className={`flex items-center hover:text-green-500 ${
                    isRetweeted ? "text-green-500" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`p-2 hover:bg-green-200 rounded-full cursor-pointer hover:bg-opacity-60 transition-colors duration-300 dark:hover:bg-green-400 dark:hover:bg-opacity-15`}
                    onClick={handleRetweet}
                  >
                    <HiArrowPathRoundedSquare
                      size={20}
                      className="text-inherit"
                    />
                  </div>
                  <span className="ml-0.25 text-inherit">
                    {retweets ? retweets.length : 0}
                  </span>
                </div>

                <div
                  className={`flex items-center hover:text-red-500 ${
                    isLiked ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  <div
                    className="p-2.5 hover:bg-red-200 rounded-full cursor-pointer hover:bg-opacity-60 transition-colors duration-300 dark:hover:bg-red-400 dark:hover:bg-opacity-15"
                    onClick={handleLike}
                  >
                    {isLiked ? (
                      <FaHeart size={"16"} className="text-inherit" />
                    ) : (
                      <FaRegHeart size={"16"} className="text-inherit" />
                    )}
                  </div>
                  <span className="ml-0.25 text-inherit">
                    {likes ? likes.length : 0}
                  </span>
                </div>

                <div
                  className={`flex items-center hover:text-sky-500 ${
                    isBookmarked ? "text-sky-500" : "text-gray-400"
                  }`}
                >
                  <div
                    className="p-2.5 hover:bg-sky-200 rounded-full cursor-pointer hover:bg-opacity-60 transition-colors duration-300 dark:hover:bg-sky-400 dark:hover:bg-opacity-15"
                    onClick={handleBookmark}
                  >
                    {isBookmarked ? (
                      <FaBookmark size={"16"} className="text-inherit" />
                    ) : (
                      <FaRegBookmark size={"16"} className="text-inherit" />
                    )}
                  </div>
                  <span className="ml-0.25 text-inherit">
                    {bookmarks ? bookmarks.length : 0}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tweet;
