/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
import { useAuth } from "../utils/AuthContext.jsx";
import { GrImage } from "react-icons/gr";
import instance from "../utils/axiosConfig.js";
import { ProfileAvatar } from "./ProfileAvatar.jsx";

const PostModal = ({ isOpen, onClose, onTweetCreated }) => {
  const [tweetContent, setTweetContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const textarea = textareaRef.current;
    const container = containerRef.current;
    const handleInput = () => {
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
      container.style.height = textarea.scrollHeight + "px";
    };

    if (textarea) {
      textarea.addEventListener("input", handleInput);
    }

    return () => {
      if (textarea) {
        textarea.removeEventListener("input", handleInput);
      }
    };
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("content", tweetContent);
      if (image) {
        formData.append("image", image);
      }
      await instance.post("/api/tweets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setTweetContent("");
      setImage(null);
      setImagePreview(null);
      onTweetCreated();
    } catch (err) {
      console.error("Error al crear el tweet:", err);
    }
  };

  const isPostDisabled = () => {
    return !tweetContent.trim() && !image;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl w-[600px] absolute top-4 p-4 pt-20">
        <button
          className="absolute top-3 left-3 hover:bg-gray-700 hover:bg-opacity-15 rounded-full h-[36px] w-[36px] flex items-center justify-center transition-colors duration-300"
          onClick={() => {
            onClose();
            setTweetContent("");
            setImage(null);
            setImagePreview(null);
          }}
        >
          <IoClose size={24} />
        </button>
        <div className="flex items-start">
          <ProfileAvatar
            name={user.name}
            username={user.username}
            profileImage={user.profileImage}
          />
          <div
            ref={containerRef}
            className="w-full ml-2 form-container my-[4px] max-h-[280px] h-[96px]"
          >
            <textarea
              ref={textareaRef}
              className="w-full resize-none outline-none border-none text-2xl form pr-2 h-full"
              placeholder="¿Qué está pasando?"
              rows="1"
              maxLength={280}
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="ml-[2.55rem] my-2">
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
            </div>
          )}
          {!imagePreview && <div className="mb-6"></div>}
        </div>
        <div className=" flex justify-between items-center border-t border-gray-200 pt-2 mt-6">
          <label
            htmlFor="image-uploade"
            className="p-2 rounded-full hover:bg-sky-200 hover:bg-opacity-60 cursor-pointer transition-colors duration-300"
          >
            <GrImage className="text-sky-500 cursor-pointer" />
          </label>
          <input
            id="image-uploade"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          <button
            className={`flex items-center justify-center bg-sky-500 text-white font-bold text-md rounded-full h-[36px] px-5 ${
              isPostDisabled()
                ? "opacity-50"
                : "hover:bg-sky-600 transition-colors duration-300"
            }`}
            onClick={handleSubmit}
            disabled={isPostDisabled()}
          >
            Postear
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostModal;
