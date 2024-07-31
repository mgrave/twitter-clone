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
      setTweet(response.data);
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
      setTweet(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full flex">
      <LeftSidebar
        onPostButtonClick={() => setShowPostModal(true)}
        post={true}
      />
      <div className="w-[990px] flex mr-[40px] gap-[35px]">
        <div className="w-[600px] min-h-[1044px] border-gray-200 border pt-14 border-t-0 ">
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
    </div>
  );
};
