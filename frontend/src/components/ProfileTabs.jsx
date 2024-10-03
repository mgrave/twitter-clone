/* eslint-disable react/prop-types */
const ProfileTabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex items-center justify-evenly border-b border-gray-200 mt-4 dark:border-gray-600">
      <div
        className={`relative cursor-pointer w-full px-4 py-2 text-center ${
          activeTab === "Posts"
            ? "font-bold text-black dark:text-white"
            : "font-semibold text-gray-400"
        }`}
        onClick={() => setActiveTab("Posts")}
      >
        Posts
        {activeTab === "Posts" && (
          <div className="w-16 h-1 bg-sky-500 absolute bottom-0 rounded left-[50%] -translate-x-[50%]"></div>
        )}
      </div>
      <div
        className={`relative cursor-pointer w-full px-4 py-2 text-center ${
          activeTab === "Comments"
            ? "font-bold text-black dark:text-white"
            : "font-semibold text-gray-400"
        }`}
        onClick={() => setActiveTab("Comments")}
      >
        Respuestas
        {activeTab === "Comments" && (
          <div className="w-24 h-1 bg-sky-500 absolute bottom-0 rounded left-[50%] -translate-x-[50%]"></div>
        )}
      </div>
      <div
        className={`relative cursor-pointer w-full px-4 py-2 text-center ${
          activeTab === "Likes"
            ? "font-bold text-black dark:text-white"
            : "font-semibold text-gray-400"
        }`}
        onClick={() => setActiveTab("Likes")}
      >
        Likes
        {activeTab === "Likes" && (
          <div className="w-16 h-1 bg-sky-500 absolute bottom-0 rounded left-[50%] -translate-x-[50%]"></div>
        )}
      </div>
      <div
        className={`relative cursor-pointer w-full px-4 py-2 text-center ${
          activeTab === "Saved"
            ? "font-bold text-black dark:text-white"
            : "font-semibold text-gray-400"
        }`}
        onClick={() => setActiveTab("Saved")}
      >
        Guardados
        {activeTab === "Saved" && (
          <div className="w-24 h-1 bg-sky-500 absolute bottom-0 rounded left-[50%] -translate-x-[50%]"></div>
        )}
      </div>
    </div>
  );
};

export default ProfileTabs;
