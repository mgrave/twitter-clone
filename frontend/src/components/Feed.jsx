/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import instance from "../utils/axiosConfig.js";
import { CreatePost } from "./CreatePost.jsx";
import Tweet from "./Tweet.jsx";
import FeedHeader from "./FeedHeader.jsx";
import Loader from "./Loader.jsx";

export const Feed = ({ onClick, fetch, onCommentClick, onCreated }) => {
  const [tweets, setTweets] = useState([]);
  const [activeTab, setActiveTab] = useState("ForYou");
  const [loading, setLoading] = useState(true);

  const fetchTweets = useCallback(async () => {
    setLoading(true);
    try {
      let user = JSON.parse(localStorage.getItem("user"));
      const response = await instance.get(
        `/api/tweets/${activeTab === "ForYou" ? "" : `following/${user._id}`}`
      );
      if (activeTab === "Following") {
        const followingTweets = response.data.tweets.map((post) => ({
          ...post.tweet,
          type: post.type,
          rtUser: post.username,
        }));

        setTweets(followingTweets);
      } else {
        setTweets(response.data.tweets);
      }
    } catch (error) {
      console.error("Error fetching tweets:", error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchTweets();
  }, [fetchTweets, activeTab, fetch]);

  const handleTweetDelete = (tweetId) => {
    setTweets(tweets.filter((tweet) => tweet._id !== tweetId));
  };

  return (
    <div className="w-full md:min-w-[600px] max-w-[600px] min-h-screen border pt-14 border-t-0 border-gray-200 dark:border-gray-600 bg-white dark:bg-black xsm-f">
      <FeedHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <CreatePost onCreated={onCreated} />
      {tweets.length <= 0 && loading === false && (
        <div className="max-w-[600px] flex h-20 justify-center items-center w-full">
          <h1 className="text-white font-bold text-2xl">Not Found</h1>
        </div>
      )}
      {loading && (
        <div className="max-w-[600px] justify-center items-center w-full h-full">
          <Loader feed={true} />
        </div>
      )}
      {tweets.length > 0 &&
        loading === false &&
        tweets.map((tweet) => (
          <Tweet
            key={tweet._id}
            tweet={tweet}
            type={tweet.type}
            rtUser={tweet.rtUser}
            onClick={onClick}
            onTweetDelete={handleTweetDelete}
            onCommentClick={() => onCommentClick(tweet)}
          />
        ))}
    </div>
  );
};
