/* eslint-disable react/prop-types */
const FeedHeader = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex items-center justify-evenly fixed w-[598px] top-0 h-[57px] bg-white z-50 border-b">
      <div
        className={`cursor-pointer w-full px-4 h-full flex items-center justify-center relative ${
          activeTab === "ForYou"
            ? "font-bold text-lg"
            : "font-semibold text-gray-400 text-lg"
        }`}
        onClick={() => setActiveTab("ForYou")}
      >
        For you
        {activeTab === "ForYou" && (
          <div className="w-16 h-1 bg-sky-500 absolute bottom-0 rounded"></div>
        )}
      </div>
      <div
        className={`cursor-pointer w-full px-4 h-full flex items-center justify-center relative ${
          activeTab === "Following"
            ? "font-bold text-lg"
            : "font-semibold text-gray-400 text-lg"
        }`}
        onClick={() => setActiveTab("Following")}
      >
        Following
        {activeTab === "Following" && (
          <div className="w-16 h-1 bg-sky-500 absolute bottom-0 rounded"></div>
        )}
      </div>
    </div>
  );
};

export default FeedHeader;
