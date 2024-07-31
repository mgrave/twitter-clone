/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { GoHome, GoHomeFill } from "react-icons/go";
import { SlOptions } from "react-icons/sl";
import { IoIosSearch } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import { RiSlashCommands2 } from "react-icons/ri";
import { HiOutlineUsers } from "react-icons/hi";
import { HiOutlineUser, HiUser } from "react-icons/hi";
import { MdOutlinePending } from "react-icons/md";
import { useAuth } from "../utils/AuthContext.jsx";
import { ProfileAvatar } from "./ProfileAvatar.jsx";

export const LeftSidebar = ({ onPostButtonClick, profile, post }) => {
  const { user, logout } = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();
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

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="h-screen flex justify-end sticky top-0 w-full">
      <div className="w-[275px] h-screen flex flex-col justify-between mr-2">
        <div>
          <Link
            to="/"
            className="w-[52px] h-[52px] flex items-center justify-center rounded-full mb-2 hover:bg-gray-900 hover:bg-opacity-10 transition-colors duration-300"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" width="32px">
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.9 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </Link>
          <nav>
            <Link to="/" className="flex h-[50px] w-full group">
              <div className="flex items-center rounded-full p-3 group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-colors duration-300">
                {profile ? (
                  <GoHome size={"30px"} />
                ) : post ? (
                  <GoHome size={"30px"} />
                ) : (
                  <GoHomeFill size={"30px"} />
                )}
                <span className="font-regular text-2xl ml-4 mr-5">Inicio</span>
              </div>
            </Link>
            <Link to="/" className="flex h-[50px] w-full group cursor-default">
              <div className="flex items-center rounded-full p-3 group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-colors duration-300">
                <IoIosSearch size={"30px"} />
                <span className="font-regular text-2xl ml-4 mr-5">
                  Explorar
                </span>
              </div>
            </Link>
            <Link to="/" className="flex h-[50px] w-full group cursor-default">
              <div className="flex items-center rounded-full p-3 group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-colors duration-300">
                <IoNotificationsOutline size={"30px"} />
                <span className="font-regular text-2xl ml-4 mr-5">
                  Notificaciones
                </span>
              </div>
            </Link>
            <Link to="/" className="flex h-[50px] w-full group cursor-default">
              <div className="flex items-center rounded-full p-3 group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-colors duration-300">
                <HiOutlineMail size={"30px"} />
                <span className="font-regular text-2xl ml-4 mr-5">
                  Mensajes
                </span>
              </div>
            </Link>
            <Link to="/" className="flex h-[50px] w-full group cursor-default">
              <div className="flex items-center rounded-full p-3 group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-colors duration-300">
                <RiSlashCommands2 size={"30px"} />
                <span className="font-regular text-2xl ml-4 mr-5">Grok</span>
              </div>
            </Link>
            <Link to="/" className="flex h-[50px] w-full group cursor-default">
              <div className="flex items-center rounded-full p-3 group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-colors duration-300">
                <HiOutlineUsers size={"30px"} />
                <span className="font-regular text-2xl ml-4 mr-5">
                  Comunidades
                </span>
              </div>
            </Link>
            <Link
              to={`/${user.username}`}
              className="flex h-[50px] w-full group"
            >
              <div className="flex items-center rounded-full p-3 group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-colors duration-300">
                {profile ? (
                  <HiUser size={"30px"} />
                ) : (
                  <HiOutlineUser size={"30px"} />
                )}
                <span className="font-regular text-2xl ml-4 mr-5">Perfil</span>
              </div>
            </Link>
            <Link to="/" className="flex h-[50px] w-full group">
              <div className="flex items-center rounded-full p-3 group-hover:bg-gray-900 group-hover:bg-opacity-10 transition-colors duration-300">
                <MdOutlinePending size={"30px"} />
                <span className="font-regular text-2xl ml-4 mr-5">
                  Más opciones
                </span>
              </div>
            </Link>
          </nav>
          <button
            className="flex items-center justify-center bg-sky-500 text-white w-[232px] font-bold text-xl h-[52px] rounded-full my-2 hover:bg-sky-600 transition-colors duration-300"
            onClick={onPostButtonClick}
          >
            Postear
          </button>
        </div>
        <div className="relative my-3 w-full" ref={optionsRef}>
          <button
            className="h-[64px] flex items-center justify-between w-full p-3 rounded-full hover:bg-gray-900 hover:bg-opacity-10 transition-colors duration-300"
            onClick={() => setShowOptions(!showOptions)}
          >
            <div className="flex items-center">
              <ProfileAvatar
                name={user.name}
                username={user.username}
                profileImage={user.profileImage}
              />
              <div className="flex flex-col items-start ml-3 h-[38px] justify-center">
                <span className="font-bold h-5 flex items-center">
                  {user.name}
                </span>
                <span className="text-slate-600 h-5 flex items-center">
                  @{user.username}
                </span>
              </div>
            </div>
            <SlOptions size={"25px"} />
          </button>
          {showOptions && (
            <div className="absolute bottom-16 right-0 bg-white rounded-2xl w-[275px] shadow-[0_2px_10px_2px_rgba(0,0,0,0.2)] overflow-hidden">
              <button
                className="w-full text-left p-4 hover:bg-gray-100 font-bold"
                onClick={handleLogout}
              >
                Cerrar la sesión de <br />@{user.username}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
