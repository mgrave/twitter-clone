/* eslint-disable react/prop-types */
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { SlOptions } from "react-icons/sl";
import { useAuth } from "../utils/AuthContext.jsx";
import { ProfileAvatar } from "./ProfileAvatar.jsx";

const FeedHeader = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();
  const [showOptions, setShowOptions] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const navigate = useNavigate();
  const optionsRef = useRef(null);
  let lastScrollY = useRef(0);

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
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current) {
        if (currentScrollY >= 130) {
          setIsHeaderVisible(false);
        }
      } else {
        // Scrolling up
        if (!isHeaderVisible) {
          setIsHeaderVisible(true);
        }
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isHeaderVisible]);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    window.scrollTo(0, 0); // Restablecer el scroll a la parte superior
  };

  return (
    <div
      className={`${
        isHeaderVisible ? "xsm-fh-v" : "xsm-t-h"
      } flex flex-col items-center fixed w-[calc(100%-70px)] max-w-[598px] top-0 h-[57px] z-50 transition-all duration-300 xsm-fh`}
    >
      <div
        className={`w-full hidden items-center justify-between h-[57px] px-4 dark:bg-black bg-white z-40 xsm-fh-t`}
      >
        <Link
          to="/"
          className="flex items-center justify-center w-[52px] h-[52px] rounded-full hover:bg-gray-900 hover:bg-opacity-10 dark:hover:bg-gray-300 dark:hover:bg-opacity-15 transition-colors duration-300"
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
        <div className="relative flex justify-center" ref={optionsRef}>
          <button
            className="flex items-center justify-center h-[52px] w-[52px] xl:w-full p-3 rounded-full hover:bg-gray-900 hover:bg-opacity-10 dark:hover:bg-gray-300 dark:hover:bg-opacity-15 transition-colors duration-300"
            onClick={() => setShowOptions(!showOptions)}
          >
            <div className="flex items-center">
              <ProfileAvatar
                name={user.name}
                username={user.username}
                profileImage={user.profileImage}
              />
              <div className="hidden flex-col items-start ml-3 h-[38px] justify-center xl:flex">
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
              className="hidden text-black dark:text-white xl:block"
            />
          </button>
          {showOptions && (
            <div className="absolute right-0 z-50 w-[275px] bg-white dark:bg-gray-800 rounded-2xl top-16 shadow-[0_2px_10px_2px_rgba(0,0,0,0.2)] overflow-hidden">
              <button
                className="flex items-center justify-between w-full h-[56px] p-3 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-300"
                onClick={handleLogout}
              >
                <div className="flex items-center">
                  <ProfileAvatar
                    name={user.name}
                    username={user.username}
                    profileImage={user.profileImage}
                  />
                  <div className="flex flex-col items-start justify-center ml-3 h-[38px]">
                    <span className="font-bold h-5 flex items-center dark:text-white">
                      {user.name}
                    </span>
                    <span className="flex items-center h-5 text-slate-600 dark:text-slate-400">
                      @{user.username}
                    </span>
                  </div>
                </div>
              </button>
              <button
                className="w-full h-[56px] p-3 text-left hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors duration-300"
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
      <div
        className={`flex items-center justify-evenly w-full h-[57px] border-b border-gray-200 dark:border-gray-600 dark:bg-black bg-white`}
      >
        <div
          className={`cursor-pointer w-full px-4 h-full flex items-center justify-center relative ${
            activeTab === "ForYou"
              ? "font-bold text-lg dark:text-white"
              : "font-semibold text-gray-400 text-lg"
          }`}
          onClick={() => handleTabClick("ForYou")}
        >
          For you
          {activeTab === "ForYou" && (
            <div className="w-16 h-1 bg-sky-500 absolute bottom-0 rounded"></div>
          )}
        </div>
        <div
          className={`cursor-pointer w-full px-4 h-full flex items-center justify-center relative ${
            activeTab === "Following"
              ? "font-bold text-lg dark:text-white"
              : "font-semibold text-gray-400 text-lg"
          }`}
          onClick={() => handleTabClick("Following")}
        >
          Following
          {activeTab === "Following" && (
            <div className="w-16 h-1 bg-sky-500 absolute bottom-0 rounded"></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeedHeader;
