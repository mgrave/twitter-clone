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
      className="flex items-center justify-between py-3 px-3 hover:bg-gray-100 hover:bg-opacity-70 cursor-pointer transition-colors duration-300"
      onClick={handleProfileClick}
    >
      <header className="flex items-center gap-[4px]">
        <ProfileAvatar
          name={user.name}
          username={user.username}
          profileImage={user.profileImage}
        />
        <div className="flex flex-col">
          <strong>{user.name}</strong>
          <span className="text-sm">@{user.username}</span>
        </div>
      </header>

      <aside>
        <button
          className={`group ml-2  rounded-full py-1.5 px-4 font-semibold pointer transition-colors duration-300 ${
            isFollowing
              ? "w-[145px] text-black bg-transparent border border-black hover:bg-red-600 hover:bg-opacity-15 hover:border-red-600 hover:text-red-600 hover:border"
              : "text-white bg-black hover:bg-gray-800"
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
      </aside>
    </article>
  );
};

export default User;
