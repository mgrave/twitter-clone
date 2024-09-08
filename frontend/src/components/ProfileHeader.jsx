/* eslint-disable react/prop-types */
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
export const ProfileHeader = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-start sticky w-[100%] max-w-[598px] top-0 h-[57px] bg-white z-50 cursor-pointer dark:bg-black dark:text-white xsm-ph">
      <button
        onClick={() => navigate("/")}
        className="h-[32px] w-[32px] rounded-full flex items-center justify-center hover:bg-gray-700 hover:bg-opacity-15 transition-colors duration-300 dark:hover:bg-gray-300 dark:hover:bg-opacity-15 ml-4"
      >
        <MdKeyboardBackspace size={"24px"} />
      </button>
      <div className="ml-8">
        <h1 className="font-semibold text-xl">{user.name}</h1>
        <p className="text-sm text-gray-500">{user.posts.length} posts</p>
      </div>
    </div>
  );
};
