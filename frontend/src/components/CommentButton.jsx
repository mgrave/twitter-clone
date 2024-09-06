/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaRegComment } from "react-icons/fa";

export const CommentButton = ({ onCommentClick }) => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

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

  return (
    <div
      className={`fixed bottom-[70px] right-4 z-[999999999999] xsm-pb hidden transition-opacity duration-300 ${
        isVisible
          ? "opacity-100 pointer-events-auto"
          : "opacity-20 pointer-events-none"
      }`}
    >
      <button
        className="flex items-center justify-center bg-sky-500 text-white w-[54px] font-bold text-xl h-[54px] rounded-full my-2 hover:bg-sky-600 transition-colors duration-300 relative"
        onClick={() => onCommentClick()}
      >
        <FaRegComment className="" size={24} />
      </button>
    </div>
  );
};
