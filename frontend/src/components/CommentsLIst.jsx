/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import instance from "../utils/axiosConfig.js";
import Tweet from "./Tweet.jsx";

export const CommentList = ({ comments, onClick, onCommentClick }) => {
  const [commentDetails, setCommentDetails] = useState([]);

  useEffect(() => {
    const fetchCommentDetails = async () => {
      try {
        const commentsData = await Promise.all(
          comments.map(async (commentId) => {
            const { data } = await instance.get(`/api/tweets/${commentId}`);
            return data;
          })
        );
        setCommentDetails(commentsData);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchCommentDetails();
  }, [comments]);

  const handleTweetDelete = async (tweetId) => {
    setCommentDetails(commentDetails.filter((com) => com._id !== tweetId));
    comments.filter((com) => com !== tweetId);
  };

  return (
    <div>
      {commentDetails.map((comment) => (
        <Tweet
          key={comment._id}
          tweet={comment}
          type={comment.type}
          rtUser={comment.rtUser}
          onTweetDelete={handleTweetDelete}
          onClick={onClick}
          onCommentClick={() => onCommentClick(comment)}
        />
      ))}
    </div>
  );
};
