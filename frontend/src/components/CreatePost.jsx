/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import { GrImage } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import instance from "../utils/axiosConfig.js";
import { useAuth } from "../utils/AuthContext.jsx";
import "../styles/index.css";
import { ProfileAvatar } from "./ProfileAvatar.jsx";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const CreatePost = ({ onCreated }) => {
  const [tweetContent, setTweetContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

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

      console.log([...formData]); // Añade esta línea para depurar el contenido de FormData

      await instance.post("/api/tweets", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setTweetContent("");
      setImage(null);
      setImagePreview(null);

      onCreated(); // Si se crea el tweet exitosamente
    } catch (err) {
      setTweetContent("");
      setImage(null);
      setImagePreview(null);

      // Verificar si el error es un 403
      if (err.response && err.response.status === 403) {
        toast.success("You have reached the limit of 5 created tweets");
      } else {
        console.error("Error al crear el tweet:", err);
        toast.error("There was an error creating the tweet. Please try again.");
      }
    }
  };

  const isPostDisabled = () => {
    return !tweetContent.trim() && !image;
  };

  const handleProfileClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/${user.username}`);
  };

  return (
    <div className="xsm-cp px-4 py-3 border-y border-gray-200 dark:border-gray-600 pb-2">
      <div className="flex items-start">
        <ProfileAvatar
          name={user.name}
          username={user.username}
          profileImage={user.profileImage}
          profileClick={handleProfileClick}
        />
        <div
          ref={containerRef}
          className="w-full ml-2 form-container my-[6px] max-h-[280px] h-[28px]"
        >
          <textarea
            ref={textareaRef}
            className="w-full resize-none outline-none border-none text-xl form pr-2 max-h-full bg-white dark:bg-black text-black dark:text-white"
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
              className="rounded-2xl max-h-[500px]"
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
      <div className="ml-[2.55rem] flex justify-between items-center border-t border-gray-200 dark:border-gray-600 pt-2">
        <label
          htmlFor="image-upload"
          className="p-2 rounded-full hover:bg-sky-100 dark:hover:bg-sky-400 dark:hover:bg-opacity-15 cursor-pointer transition-colors duration-300"
        >
          <GrImage className="text-sky-500 cursor-pointer" />
        </label>
        <input
          id="image-upload"
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
  );
};
