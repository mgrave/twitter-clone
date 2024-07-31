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

  const formattedDate = timeSince(createdAt);

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
  }, [_id, currentUser._id, user._id]);

  const handleLike = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const response = await instance.put(`/api/tweets/${_id}/like`);
      if (response.status === 200) {
        setIsLiked(!isLiked);
        setLikes(response.data.tweet.likes);
      }
    } catch (error) {
      console.error("Error al dar like al tweet:", error);
    }
  };

  const handleBookmark = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const response = await instance.put(`/api/tweets/${_id}/bookmark`);
      if (response.status === 200) {
        setIsBookmarked(!isBookmarked);
        setBookmarks(response.data.tweet.bookmarks);
      }
    } catch (error) {
      console.error("Error al guardar el tweet:", error);
    }
  };

  const handleRetweet = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      const response = await instance.post(`/api/tweets/${_id}/retweet`);
      if (response.status === 200) {
        setIsRetweeted(!isRetweeted);
        setRetweets(response.data.tweet.retweets);
      }
    } catch (error) {
      console.error("Error al retweetear:", error);
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
      className="border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:bg-opacity-70 transition-colors duration-300"
      onClick={handleClick}
    >
      <div className={`${type !== "retweet" ? "pt-4" : "pt-1"}`}>
        {type === "retweet" && (
          <div className="ml-10 flex items-center">
            <HiArrowPathRoundedSquare size={16} className="text-gray-600" />
            <span className="ml-2 text-gray-600 font-semibold text-sm">
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
            <div className="ml-2 w-full">
              <div className="flex items-center justify-between">
                <span className="flex">
                  <h1
                    className="font-bold hover:underline"
                    onClick={handleProfileClick}
                  >
                    {user.name}
                  </h1>
                  <p
                    className="text-gray-500 flex items-center ml-1"
                    onClick={handleProfileClick}
                  >
                    @{user.username} · {formattedDate}
                  </p>
                </span>
                <div className="relative text-gray-500" ref={optionsRef}>
                  {!isEditing ? (
                    <>
                      <div
                        className="p-2.5 hover:bg-sky-200 rounded-full cursor-pointer hover:bg-opacity-60 hover:text-sky-500 transition-colors duration-300"
                        onClick={handleOptionsClick}
                      >
                        <SlOptions size={"16"} className="text-inherit" />
                      </div>
                      {showOptions && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg z-50 overflow-hidden">
                          {user._id === currentUser._id ? (
                            <>
                              {!isEditing ? (
                                <button
                                  className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-900 hover:bg-opacity-5 transition-colors duration-300"
                                  onClick={handleEdit}
                                >
                                  Editar
                                </button>
                              ) : (
                                <></>
                              )}
                              <button
                                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-700 hover:bg-opacity-5 transition-colors duration-300"
                                onClick={handleDelete}
                              >
                                Eliminar
                              </button>
                            </>
                          ) : (
                            <button
                              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-700 hover:bg-opacity-5 transition-colors duration-300"
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
                        className="block w-full text-left px-2 py-1 text-black border border-gray-800 hover:bg-gray-900 hover:bg-opacity-5 transition-colors duration-300 rounded-lg"
                        onClick={handleCancelEdit}
                      >
                        Cancelar
                      </button>
                      <button
                        className="block w-full text-left px-2 py-1 text-white bg-black hover:bg-gray-800 rounded-lg transition-colors duration-300"
                        onClick={handleSaveEdit}
                      >
                        Guardar
                      </button>
                    </div>
                  )}
                </div>
              </div>
              {!isEditing ? (
                <p>{content}</p>
              ) : (
                <div>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    className="mt-2 p-1 border border-gray-300 rounded-lg w-full resize-none"
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
                    src={`http://localhost:8080/uploads/${tweetImage}`}
                    alt="tweet"
                    className="mt-2 rounded-lg"
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
                  className="flex items-center justify-center h-[30px] w-[30px] rounded-full hover:bg-sky-200 cursor-pointer transition-colors duration-300"
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
                    className="p-2.5 hover:bg-sky-200 rounded-full cursor-pointer hover:bg-opacity-60 transition-colors duration-300"
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
                    className={`p-2 hover:bg-green-200 rounded-full cursor-pointer hover:bg-opacity-60 transition-colors duration-300`}
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
                    className="p-2.5 hover:bg-red-200 rounded-full cursor-pointer hover:bg-opacity-60 transition-colors duration-300"
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
                    className="p-2.5 hover:bg-sky-200 rounded-full cursor-pointer hover:bg-opacity-60 transition-colors duration-300"
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
