/* eslint-disable react/prop-types */
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
export const ProfileHeader = ({ user }) => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-start fixed w-[598px] top-0 h-[57px] bg-white z-50 border-b pl-4 cursor-pointer">
      <button
        onClick={() => navigate("/")}
        className="h-[32px] w-[32px] rounded-full flex items-center justify-center hover:bg-gray-700 hover:bg-opacity-15 transition-colors duration-300"
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
