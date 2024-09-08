/* eslint-disable react/prop-types */
import { MdKeyboardBackspace } from "react-icons/md";
export const PostHeader = ({ onBack }) => {
  return (
    <div className="flex items-center justify-start sticky max-w-[598px] top-0 h-[57px] bg-white z-50 border-b pl-4 dark:bg-black dark:border-gray-600 xsm-ph">
      <button
        onClick={onBack}
        className="h-[32px] w-[32px] rounded-full flex items-center justify-center hover:bg-gray-700 hover:bg-opacity-15 transition-colors duration-300 dark:text-white dark:hover:bg-gray-300 dark:hover:bg-opacity-15"
      >
        <MdKeyboardBackspace size={"24px"} />
      </button>
      <h1 className="ml-8 font-semibold text-2xl dark:text-white">Post</h1>
    </div>
  );
};
