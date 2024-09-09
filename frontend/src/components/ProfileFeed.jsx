/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import instance from "../utils/axiosConfig.js";
import Tweet from "./Tweet.jsx";
import Loader from "./Loader.jsx";

export const ProfileFeed = ({
  username,
  activeTab,
  onTweetClick,
  onCommentClick,
  fetch,
}) => {
  const [posts, setPosts] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPosts([]);
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const profileResponse = await instance.get(
          `/api/user/profile/${username}`
        );

        if (profileResponse.status === 200) {
          let postIds = [];
          let tweetDetails = [];

          if (activeTab === "Posts") {
            tweetDetails = profileResponse.data.user.posts
              .filter(
                (post) => post.type === "tweet" || post.type === "retweet"
              )
              .map((post) => ({
                tweetId: post.tweet,
                addedAt: post.createdAt,
                type: post.type,
                rtUser: post.type === "retweet" ? post.username : null,
                Id: post._id,
              }));
          } else if (activeTab === "Comments") {
            tweetDetails = profileResponse.data.user.posts
              .filter(
                (post) => post.type === "comment" || post.type === "retweet"
              )
              .map((post) => ({
                tweetId: post.tweet,
                addedAt: post.createdAt,
                type: post.type,
                rtUser: post.type === "retweet" ? post.username : null,
                Id: post._id,
              }));
          } else if (activeTab === "Likes") {
            postIds = profileResponse.data.user.likedTweets;
          } else if (activeTab === "Saved") {
            postIds = profileResponse.data.user.bookmarks;
          }

          if (activeTab === "Posts" || activeTab === "Comments") {
            tweetDetails.sort(
              (a, b) => new Date(b.addedAt) - new Date(a.addedAt)
            );
            postIds = tweetDetails.map((post) => post.tweetId);
          }

          if (postIds.length > 0 || tweetDetails.length > 0) {
            const tweetPromises = postIds.map((id, index) =>
              instance.get(`/api/tweets/${id}`).then((response) => ({
                ...response.data.tweet,
                type: tweetDetails[index]?.type || null,
                rtUser: tweetDetails[index]?.rtUser || null,
                Id: tweetDetails[index]?.Id || null,
              }))
            );

            const tweets = await Promise.all(tweetPromises);

            if (activeTab === "Likes" || activeTab === "Saved") {
              tweets.sort(
                (a, b) => postIds.indexOf(b._id) - postIds.indexOf(a._id)
              );
            }

            setPosts(tweets);
          } else {
            setPosts([]);
          }
        }
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username, activeTab, fetch]);

  const handleTweetDelete = (tweetId) => {
    setTweets(tweets.filter((tweet) => tweet._id !== tweetId));
  };

  if (loading)
    return (
      <div className="w-full h-[400px] bg-white dark:bg-black">
        <Loader feed={true} />
      </div>
    );

  return (
    <div className="">
      {posts.length > 0 &&
        posts.map((tweet) => (
          <Tweet
            key={tweet.Id || tweet._id}
            tweet={tweet}
            type={tweet.type}
            rtUser={tweet.rtUser}
            onClick={onTweetClick}
            onTweetDelete={handleTweetDelete}
            onCommentClick={() => onCommentClick(tweet)}
          />
        ))}
    </div>
  );
};
