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
import { BsFeather } from "react-icons/bs";
import { TiPlus } from "react-icons/ti";
import { useAuth } from "../utils/AuthContext.jsx";
import { ProfileAvatar } from "./ProfileAvatar.jsx";
import { useTheme } from "../utils/ThemeContext.jsx";

export const LeftSidebar = ({ onPostButtonClick, profile, post }) => {
  const { toggleTheme, theme } = useTheme();
  const { user, logout } = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const navigate = useNavigate();
  const optionsRef = useRef(null);
  const moreOptionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setShowOptions(false);
      }
      if (
        moreOptionsRef.current &&
        !moreOptionsRef.current.contains(event.target)
      ) {
        setShowMoreOptions(false);
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
    <header className="h-screen flex justify-end sticky top-0 z-[99999999999]">
      <div className="xsm h-full flex flex-col justify-between mx-1 w-[60px] sm:w-[88px] xl:w-[275px] items-center">
        <div className="w-[60px] sm:w-[88px] xl:w-[275px] flex flex-col items-center xl:items-start">
          <Link
            to="/"
            className="w-[52px] h-[52px] flex items-center justify-center rounded-full mb-2 hover:bg-gray-900 hover:bg-opacity-10 dark:hover:bg-gray-300 dark:hover:bg-opacity-15 transition-colors duration-300"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              width="32px"
              fill="dark:#fff"
            >
              <g>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.9 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </g>
            </svg>
          </Link>
          <nav className="flex flex-col items-center">
            <Link to="/" className="flex w-full group">
              <div className="w-[50px] xl:w-auto xl:px-3 h-[50px] flex items-center xl:justify-normal justify-center rounded-full group-hover:bg-gray-900 group-hover:bg-opacity-10 dark:group-hover:bg-gray-300 dark:group-hover:bg-opacity-15 transition-colors duration-300">
                {profile ? (
                  <GoHome
                    size={"30px"}
                    className="text-black dark:text-white"
                  />
                ) : post ? (
                  <GoHome
                    size={"30px"}
                    className="text-black dark:text-white"
                  />
                ) : (
                  <GoHomeFill
                    size={"30px"}
                    className="text-black dark:text-white"
                  />
                )}
                <span className="font-regular text-2xl ml-4 mr-5 text-black dark:text-white hidden xl:block">
                  Inicio
                </span>
              </div>
            </Link>
            <Link to="/" className="flex w-full group cursor-default">
              <div className="w-[50px] xl:w-auto xl:px-3 h-[50px] flex items-center xl:justify-normal justify-center rounded-full group-hover:bg-gray-900 group-hover:bg-opacity-10 dark:group-hover:bg-gray-300 dark:group-hover:bg-opacity-15 transition-colors duration-300">
                <IoIosSearch
                  size={"30px"}
                  className="text-black dark:text-white"
                />
                <span className="font-regular text-2xl ml-4 mr-5 text-black dark:text-white hidden xl:block">
                  Explorar
                </span>
              </div>
            </Link>
            <Link to="/" className="flex w-full group cursor-default">
              <div className="w-[50px] xl:w-auto xl:px-3 h-[50px] flex items-center xl:justify-normal justify-center rounded-full group-hover:bg-gray-900 group-hover:bg-opacity-10 dark:group-hover:bg-gray-300 dark:group-hover:bg-opacity-15 transition-colors duration-300">
                <IoNotificationsOutline
                  size={"30px"}
                  className="text-black dark:text-white"
                />
                <span className="font-regular text-2xl ml-4 mr-5 dark:text-white hidden xl:block">
                  Notificaciones
                </span>
              </div>
            </Link>
            <Link to="/" className="flex w-full group cursor-default">
              <div className="w-[50px] xl:w-auto xl:px-3 h-[50px] flex items-center xl:justify-normal justify-center rounded-full group-hover:bg-gray-900 group-hover:bg-opacity-10 dark:group-hover:bg-gray-300 dark:group-hover:bg-opacity-15 transition-colors duration-300">
                <HiOutlineMail
                  size={"30px"}
                  className="text-black dark:text-white"
                />
                <span className="font-regular text-2xl ml-4 mr-5 dark:text-white hidden xl:block">
                  Mensajes
                </span>
              </div>
            </Link>
            <Link to="/" className="flex w-full group cursor-default">
              <div className="w-[50px] xl:w-auto xl:px-3 h-[50px] flex items-center xl:justify-normal justify-center rounded-full group-hover:bg-gray-900 group-hover:bg-opacity-10 dark:group-hover:bg-gray-300 dark:group-hover:bg-opacity-15 transition-colors duration-300">
                <RiSlashCommands2
                  size={"30px"}
                  className="text-black dark:text-white"
                />
                <span className="font-regular text-2xl ml-4 mr-5 dark:text-white hidden xl:block">
                  Grok
                </span>
              </div>
            </Link>
            <Link to="/" className="flex w-full group cursor-default">
              <div className="w-[50px] xl:w-auto xl:px-3 h-[50px] flex items-center xl:justify-normal justify-center rounded-full group-hover:bg-gray-900 group-hover:bg-opacity-10 dark:group-hover:bg-gray-300 dark:group-hover:bg-opacity-15 transition-colors duration-300">
                <HiOutlineUsers
                  size={"30px"}
                  className="text-black dark:text-white"
                />
                <span className="font-regular text-2xl ml-4 mr-5 dark:text-white hidden xl:block">
                  Comunidades
                </span>
              </div>
            </Link>
            <Link to={`/${user.username}`} className="flex w-full group">
              <div className="w-[50px] xl:w-auto xl:px-3 h-[50px] flex items-center xl:justify-normal justify-center rounded-full group-hover:bg-gray-900 group-hover:bg-opacity-10 dark:group-hover:bg-gray-300 dark:group-hover:bg-opacity-15 transition-colors duration-300">
                {profile ? (
                  <HiUser
                    size={"30px"}
                    className="text-black dark:text-white"
                  />
                ) : (
                  <HiOutlineUser
                    size={"30px"}
                    className="text-black dark:text-white"
                  />
                )}
                <span className="font-regular text-2xl ml-4 mr-5 dark:text-white hidden xl:block">
                  Perfil
                </span>
              </div>
            </Link>
            <div ref={moreOptionsRef} className="relative cursor-pointer">
              <button
                className="flex w-full group"
                onClick={() => setShowMoreOptions(!showMoreOptions)}
              >
                <div className="w-[50px] xl:w-auto xl:px-3 h-[50px] flex items-center xl:justify-normal justify-center rounded-full group-hover:bg-gray-900 group-hover:bg-opacity-10 dark:group-hover:bg-gray-300 dark:group-hover:bg-opacity-15 transition-colors duration-300">
                  <MdOutlinePending
                    size={"30px"}
                    className="text-black dark:text-white"
                  />
                  <span className="font-regular text-2xl ml-4 mr-5 dark:text-white hidden xl:block">
                    Más opciones
                  </span>
                </div>
              </button>
              {showMoreOptions && (
                <div className="absolute top-16 left-0 bg-white dark:bg-gray-800 rounded-2xl w-[160px] shadow-[0_2px_10px_2px_rgba(0,0,0,0.2)] overflow-hidden cursor-pointer z-[999999999999]">
                  <label className="w-full h-[56px] text-left p-3 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-300 cursor-pointer">
                    <span className="dark:text-white">Dark Mode</span>
                    <input
                      type="checkbox"
                      checked={theme}
                      onChange={toggleTheme}
                      className="toggle-checkbox hidden"
                      id="toggleTheme"
                    />
                    <label
                      htmlFor="toggleTheme"
                      className="toggle-label block w-10 h-6 rounded-full bg-gray-300 cursor-pointer relative "
                    >
                      <span
                        className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                          theme === "dark" ? "translate-x-4" : ""
                        }`}
                      ></span>
                    </label>
                  </label>
                </div>
              )}
            </div>
          </nav>
          <button
            className="flex items-center justify-center bg-sky-500 text-white w-[54px] xl:w-[233px] font-bold text-xl h-[54px] rounded-full my-2 hover:bg-sky-600 transition-colors duration-300 relative"
            onClick={onPostButtonClick}
          >
            <span className="hidden xl:inline">Postear</span>
            <BsFeather
              className="block xl:hidden absolute bottom-3 right-3"
              size={24}
            />
            <TiPlus
              className="block xl:hidden absolute top-[14px] left-[14px]"
              size={12}
            />
          </button>
        </div>
        <div
          className="relative my-3 w-full flex justify-center xsm-ldb"
          ref={optionsRef}
        >
          <button
            className="h-[64px] w-[64px] xl:w-full flex items-center justify-between p-3 rounded-full hover:bg-gray-900 hover:bg-opacity-10 dark:hover:bg-gray-300 dark:hover:bg-opacity-15 transition-colors duration-300"
            onClick={() => setShowOptions(!showOptions)}
          >
            <div className="flex items-center">
              <ProfileAvatar
                name={user.name}
                username={user.username}
                profileImage={user.profileImage}
              />
              <div className="flex-col items-start ml-3 h-[38px] justify-center hidden xl:flex">
                <span className="font-bold h-5 flex items-center dark:text-white">
                  {user.name}
                </span>
                <span className="text-slate-600 h-5 flex items-center dark:text-slate-400">
                  @{user.username}
                </span>
              </div>
            </div>
            <SlOptions
              size={"25px"}
              className="text-black dark:text-white hidden xl:block"
            />
          </button>
          {showOptions && (
            <div className="absolute bottom-16 left-0 bg-white dark:bg-gray-800 rounded-2xl w-[275px] shadow-[0_2px_10px_2px_rgba(0,0,0,0.2)] overflow-hidden">
              <button
                className="w-full h-[56px] flex justify-between items-center p-3 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-300"
                onClick={handleLogout}
              >
                <div className="flex items-center">
                  <ProfileAvatar
                    name={user.name}
                    username={user.username}
                    profileImage={user.profileImage}
                  />
                  <div className="flex flex-col items-start ml-3 h-[38px] justify-center">
                    <span className="font-bold h-5 flex items-center dark:text-white">
                      {user.name}
                    </span>
                    <span className="text-slate-600 h-5 flex items-center dark:text-slate-400">
                      @{user.username}
                    </span>
                  </div>
                </div>
              </button>
              <button
                className="w-full h-[56px] text-left p-3 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-300"
                onClick={handleLogout}
              >
                <span className="dark:text-white">
                  Cerrar sesión @{user.username}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
