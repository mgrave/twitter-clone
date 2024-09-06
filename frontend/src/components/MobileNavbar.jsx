/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { GoHome, GoHomeFill } from "react-icons/go";
import { IoIosSearch } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import { HiOutlineMail } from "react-icons/hi";
import { HiOutlineUser, HiUser } from "react-icons/hi";
import { MdOutlinePending } from "react-icons/md";
import { useAuth } from "../utils/AuthContext.jsx";
import { useTheme } from "../utils/ThemeContext.jsx";

const MobileNavbar = ({ profile, post }) => {
  const { toggleTheme, theme } = useTheme();
  const { user } = useAuth();
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const moreOptionsRef = useRef(null);

  // Handle outside click for more options
  useEffect(() => {
    const handleClickOutside = (event) => {
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

  // Handle scroll direction to show/hide navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > scrollY) {
        setIsVisible(false); // Scrolling down, hide navbar
      } else {
        setIsVisible(true); // Scrolling up, show navbar
      }
      setScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [scrollY]);

  // Scroll to top when clicking "Home"
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header
      className={`xsm-mnv hidden w-[100vw] justify-end fixed bottom-0 z-[99999999999] border-t bg-white dark:bg-black dark:border-gray-600 transition-transform duration-500 ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="w-full flex justify-between h-[60px] items-center px-4">
        <div className="h-[60px] w-full flex items-center justify-between">
          <nav className="flex items-center w-full">
            <Link
              to="/"
              className="flex w-full group"
              onClick={handleHomeClick}
            >
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
            {/* Resto de los enlaces */}
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
                className="flex w-full group h-full"
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
                <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-2xl w-[160px] shadow-[0_2px_10px_2px_rgba(0,0,0,0.2)] overflow-hidden cursor-pointer z-[999999999999]">
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
        </div>
      </div>
    </header>
  );
};

export default MobileNavbar;
