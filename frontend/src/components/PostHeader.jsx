/* eslint-disable react/prop-types */
import { MdKeyboardBackspace } from "react-icons/md";
export const PostHeader = ({ onBack }) => {
  return (
    <div className="flex items-center justify-start fixed w-[598px] top-0 h-[57px] bg-white z-50 border-b pl-4">
      <button
        onClick={onBack}
        className="h-[32px] w-[32px] rounded-full flex items-center justify-center hover:bg-gray-700 hover:bg-opacity-15 transition-colors duration-300"
      >
        <MdKeyboardBackspace size={"24px"} />
      </button>
      <h1 className="ml-8 font-semibold text-2xl">Post</h1>
    </div>
  );
};
