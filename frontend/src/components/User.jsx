/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { useAuth } from "../utils/AuthContext.jsx";
import instance from "../utils/axiosConfig.js";
import { useNavigate } from "react-router-dom";
import { ProfileAvatar } from "./ProfileAvatar.jsx";

const User = ({ user }) => {
  const { user: currentUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const text = isFollowing ? "Siguiendo" : "Seguir";
  const navigate = useNavigate();

  const handleProfileClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    navigate(`/${user.username}`);
  };

  useEffect(() => {
    if (currentUser && user) {
      setIsFollowing(currentUser.following.includes(user._id));
    }
  }, [currentUser, user]);

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
  };

  return (
    <article
      className="flex items-center justify-between py-3 px-3 cursor-pointer relative group-first:*"
      onClick={handleProfileClick}
    >
      <div className="w-full h-full absolute z-30 left-0 hover:bg-gray-100 hover:bg-opacity-70 cursor-pointer transition-colors duration-300 dark:hover:bg-gray-600 dark:hover:bg-opacity-15 peer-hover:bg-gray-600 peer-hover:bg-opacity-15 group"></div>
      <header className="flex items-center gap-[4px]">
        <ProfileAvatar
          name={user.name}
          username={user.username}
          profileImage={user.profileImage}
        />
        <div className="flex flex-col text-black dark:text-white">
          <strong>{user.name}</strong>
          <span className="text-sm">@{user.username}</span>
        </div>
      </header>

      <aside className="absolute right-0 h-full pr-3 pl-1 flex items-center justify-center bg-white dark:bg-black peer">
        <div
          className={`relative flex items-center justify-center ${
            isFollowing ? "w-[128px]" : "w-[80px]"
          }`}
        >
          <button
            className={`group ml-2 rounded-full py-1.5 font-semibold pointer transition-colors duration-300 absolute right-0 z-50 ${
              isFollowing
                ? "w-[128px] px-0 text-black bg-transparent border border-black hover:bg-red-600 hover:bg-opacity-15 hover:border-red-600 hover:text-red-600 hover:border dark:text-white dark:border-gray-600 dark:hover:border-red-600 dark:hover:text-red-600 dark:hover:bg-opacity-15"
                : "text-white bg-black hover:bg-gray-800 dark:text-black dark:bg-white dark:hover:bg-gray-200 px-4"
            }`}
            onClick={handleFollow}
          >
            <span className={`block ${isFollowing && "group-hover:hidden"}`}>
              {text}
            </span>
            <span className={`hidden ${isFollowing && "group-hover:block"}`}>
              Dejar de seguir
            </span>
          </button>
        </div>
      </aside>
    </article>
  );
};

export default User;
