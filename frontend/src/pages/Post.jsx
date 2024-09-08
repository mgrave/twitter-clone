import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import instance from "../utils/axiosConfig.js";
import { LeftSidebar } from "../components/LeftSidebar.jsx";
import { RightSidebar } from "../components/RightSidebar.jsx";
import { PostHeader } from "../components/PostHeader.jsx";
import { CreateComment } from "../components/CreateComment.jsx";
import { CommentList } from "../components/CommentsLIst.jsx";
import { PostTweet } from "../components/PostTweet.jsx";
import PostModal from "../components/PostModal.jsx";
import CommentModal from "../components/CommentModal.jsx";
import MobileNavbar from "../components/MobileNavbar.jsx";
import { CommentButton } from "../components/CommentButton.jsx";

export const Post = () => {
  const { tweetId } = useParams();
  const [tweet, setTweet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedTweet, setSelectedTweet] = useState(null);

  const fetchTweet = useCallback(async () => {
    setLoading(true);
    try {
      const response = await instance.get(`/api/tweets/${tweetId}`);
      setTweet(response.data.tweet);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [tweetId]);

  useEffect(() => {
    fetchTweet();
  }, [fetchTweet, tweetId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const handleTweetClick = (tweet) => {
    navigate(`/post/${tweet._id}`);
  };

  const handleCommentClick = (tweet) => {
    setSelectedTweet(tweet);
    setShowCommentModal(true);
  };

  const handleTweetCreated = () => {
    setShowPostModal(false);
  };

  const handleCommentCreated = async () => {
    setShowCommentModal(false);
    try {
      const response = await instance.get(`/api/tweets/${tweetId}`);
      setTweet(response.data.tweet);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full flex bg-white dark:bg-black justify-center min-h-[1044px]">
      <LeftSidebar
        onPostButtonClick={() => setShowPostModal(true)}
        post={true}
      />
      <div className="w-full md:w-auto lg:w-[990px] flex gap-[35px] bg-white dark:bg-black">
        <div className="w-full md:min-w-[600px] max-w-[600px] min-h-screen border border-t-0 border-gray-200 dark:border-gray-600 bg-white dark:bg-black xsm-p">
          <PostHeader onBack={() => window.history.back()} />
          <PostTweet
            tweet={tweet}
            onClick={handleTweetClick}
            onCommentClick={handleCommentClick}
          />
          <CreateComment
            tweetId={tweet._id}
            onCommentCreated={handleCommentCreated}
          />
          <CommentList
            comments={tweet.comments}
            onClick={handleTweetClick}
            onCommentClick={handleCommentClick}
          />
        </div>
        <RightSidebar />
      </div>
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
      <CommentButton onCommentClick={() => handleCommentClick(tweet)} />
    </div>
  );
};
