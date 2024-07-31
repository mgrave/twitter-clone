/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from "react";
import { GrImage } from "react-icons/gr";
import { IoClose } from "react-icons/io5";
import instance from "../utils/axiosConfig.js";
import { useAuth } from "../utils/AuthContext.jsx";
import "../styles/index.css";
import { ProfileAvatar } from "./ProfileAvatar.jsx";

export const CreateComment = ({ tweetId, onCommentCreated }) => {
  const [commentContent, setCommentContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const textareaRef = useRef(null);
  const containerRef = useRef(null);
  const [click, setClick] = useState(false);
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
      formData.append("content", commentContent);
      if (image) {
        formData.append("image", image);
      }
      await instance.post(`/api/tweets/${tweetId}/comment`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setCommentContent("");
      setImage(null);
      setImagePreview(null);

      if (onCommentCreated) {
        onCommentCreated();
      }
    } catch (err) {
      console.error("Error al crear el comentario:", err);
    }
  };

  const isPostDisabled = () => {
    return !commentContent.trim() && !image;
  };

  return (
    <div className="px-4 py-3 border-b border-gray-200 pb-6 relative">
      <div className="flex items-start ">
        <ProfileAvatar
          name={user.name}
          username={user.username}
          profileImage={user.profileImage}
        />
        <div
          ref={containerRef}
          className="w-full ml-2 form-container my-[6px] max-h-[280px] h-[28px]"
        >
          <textarea
            ref={textareaRef}
            className="w-full resize-none outline-none border-none text-xl form pr-2 max-h-full"
            placeholder="Postea tu respuesta"
            rows="1"
            maxLength={280}
            value={commentContent}
            onClick={() => {
              setClick(true);
            }}
            onChange={(e) => setCommentContent(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className={`${click && "ml-[2.55rem] my-2"}`}>
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
      </div>
      <div
        className={`ml-[2.55rem] flex justify-between items-center border-none pt-2 ${
          !click && "absolute right-4 top-2"
        }`}
      >
        {click && (
          <>
            <label
              htmlFor="image-upload"
              className="p-2 rounded-full hover:bg-sky-100 cursor-pointer transition-colors duration-300"
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
          </>
        )}
        <button
          className={`flex items-center justify-center bg-sky-500 text-white font-bold text-md rounded-full h-[36px] px-5 ${
            isPostDisabled()
              ? "opacity-50"
              : "hover:bg-sky-600 transition-colors duration-300"
          }`}
          onClick={handleSubmit}
          disabled={isPostDisabled()}
        >
          Responder
        </button>
      </div>
    </div>
  );
};
