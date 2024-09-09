import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { RxCalendar } from "react-icons/rx";
import { LeftSidebar } from "../components/LeftSidebar.jsx";
import { ProfileHeader } from "../components/ProfileHeader.jsx";
import { RightSidebar } from "../components/RightSidebar.jsx";
import { useNavigate, useParams } from "react-router-dom";
import instance from "../utils/axiosConfig.js";
import { useAuth } from "../utils/AuthContext.jsx";
import { EditProfileModal } from "../components/EditProfileModal.jsx";
import ProfileTabs from "../components/ProfileTabs.jsx";
import { ProfileFeed } from "../components/ProfileFeed.jsx";
import PostModal from "../components/PostModal.jsx";
import CommentModal from "../components/CommentModal.jsx";
import MobileNavbar from "../components/MobileNavbar.jsx";
import { PostButton } from "../components/PostButton.jsx";
import Loader from "../components/Loader.jsx";

const SERVER = import.meta.env.VITE_SERVER_URL;
export const Profile = () => {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Posts");
  const navigate = useNavigate();
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState(null);

  const text = isFollowing ? "Siguiendo" : "Seguir";

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await instance.get(`/api/user/profile/${username}`);
        if (response.status === 200) {
          setUser(response.data.user);
          setIsFollowing(
            response.data.user.followers.includes(currentUser._id)
          );
        }
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [username, currentUser._id]);

  const handleFollowToggle = async () => {
    try {
      const response = await instance.put(`/api/user/follow/${user._id}`);
      if (response.status === 200) {
        setIsFollowing(!isFollowing);
        if (isFollowing) {
          setUser((prevUser) => ({
            ...prevUser,
            followers: prevUser.followers.filter(
              (followerId) => followerId !== currentUser._id
            ),
          }));
        } else {
          setUser((prevUser) => ({
            ...prevUser,
            followers: [...prevUser.followers, currentUser._id],
          }));
        }
      }
    } catch (error) {
      console.error("Error al seguir/dejar de seguir al usuario:", error);
    }
  };

  const handleSaveProfile = async (formData) => {
    try {
      const response = await instance.put(
        "/api/user/profile/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
    }
  };

  const handleEditProfile = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
  };

  if (loading)
    return (
      <div className="w-full h-full bg-white dark:bg-black">
        <Loader />
      </div>
    );

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!user) {
    return <div>No user found</div>;
  }

  const isCurrentUser = currentUser.username === username;

  const handleTweetClick = (tweet) => {
    navigate(`/post/${tweet._id}`);
  };

  const handleCommentClick = (tweet) => {
    setSelectedTweet(tweet);
    setShowCommentModal(true);
  };

  const handleTweetCreated = () => {
    setShowPostModal(false);
    setFetching(!fetching);
  };

  const handleCommentCreated = () => {
    setShowCommentModal(false);
    setFetching(!fetching);
  };

  return (
    <div className="relative w-[100%] flex bg-white dark:bg-black justify-center">
      <LeftSidebar
        onPostButtonClick={() => setShowPostModal(true)}
        profile={true}
      />
      <div className="w-[100%] md:w-auto lg:w-[990px] flex gap-[35px] min-h-[1044px]">
        <div className="w-[100%] md:min-w-[600px] max-w-[600px] min-h-screen border-gray-200 dark:border-gray-600 border border-t-0 xsm-p relative">
          <ProfileHeader user={user} />
          <div>
            <div className="max-w-[600px] h-[200px] bg-slate-300 dark:bg-gray-600">
              {user.bannerImage && (
                <img
                  src={`${SERVER}/api/user/bannerImage/${user.bannerImage}`}
                  alt=""
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="relative">
              <div className="absolute -top-[67px] border-4 rounded-full border-white left-4 dark:border-black">
                <div className="w-[134px] h-[134px] rounded-full absolute bg-black opacity-0 hover:opacity-15 cursor-pointer transition-colors duration-300"></div>
                <Avatar
                  name={user.name}
                  src={`${SERVER}/api/user/profileImage/${user.profileImage}`}
                  size="134"
                  round={true}
                  className="min-w-[40px] object-cover"
                />
              </div>
            </div>
            <div className="flex w-full justify-end pt-3 pr-4">
              {isCurrentUser ? (
                <button
                  className="rounded-full py-1.5 px-4 font-semibold pointer transition-colors duration-300 border-slate-300 border hover:bg-gray-200 dark:text-white dark:hover:bg-gray-300 dark:hover:bg-opacity-15"
                  onClick={handleEditProfile}
                >
                  Editar perfil
                </button>
              ) : (
                <button
                  className={`group rounded-full py-1.5 px-4 font-semibold pointer transition-colors duration-300 border ${
                    isFollowing
                      ? "w-[145px] text-black bg-transparent  border-black hover:bg-red-600 hover:bg-opacity-15 hover:border-red-600 hover:text-red-600 dark:text-white dark:border-gray-600 dark:hover:border-red-600 dark:hover:text-red-600 dark:hover:bg-opacity-15"
                      : "text-white bg-black hover:bg-gray-800 dark:text-black dark:bg-white dark:hover:bg-gray-200 border-white"
                  }`}
                  onClick={handleFollowToggle}
                >
                  <span
                    className={`block ${isFollowing && "group-hover:hidden"}`}
                  >
                    {text}
                  </span>
                  <span
                    className={`hidden ${isFollowing && "group-hover:block"}`}
                  >
                    Dejar de seguir
                  </span>
                </button>
              )}
            </div>
            <div className="w-full max-w-[600px] mt-[40px] ml-4">
              <h1 className="font-bold text-2xl dark:text-white">
                {user.name}
              </h1>
              <p className="text-slate-500">@{user.username}</p>
              <div className="flex items-center gap-2 text-slate-500 mt-2">
                <RxCalendar className="text-slate-600" />
                <p>
                  Se unió en{" "}
                  {new Date(user.createdAt).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4 mt-2">
                <p>
                  <span className="text-slate-500">
                    {user.following.length} Siguiendo
                  </span>
                </p>
                <p>
                  <span className="text-slate-500">
                    {user.followers.length} Seguidores
                  </span>
                </p>
              </div>
            </div>
          </div>
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          <ProfileFeed
            username={username}
            activeTab={activeTab}
            onTweetClick={handleTweetClick}
            onCommentClick={handleCommentClick}
            fetch={fetching}
          />
        </div>
        <RightSidebar />
      </div>
      <EditProfileModal
        user={user}
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveProfile}
      />
      <PostModal
        isOpen={showPostModal}
        onClose={() => setShowPostModal(false)}
        onTweetCreated={handleTweetCreated}
      />
      <CommentModal
        isOpen={showCommentModal}
        onClose={() => setShowCommentModal(false)}
        tweet={selectedTweet}
        onCommentCreated={handleCommentCreated}
      />
      <MobileNavbar onPostButtonClick={() => setShowPostModal(true)} />
      <PostButton onPostButtonClick={() => setShowPostModal(true)} />
    </div>
  );
};
