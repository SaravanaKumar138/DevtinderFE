import React, { useEffect, useState } from "react";
import { url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import axios from "axios";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const feedData = useSelector((store) => store.feed);

  const getFeed = async () => {
    try {
      const res = await axios.get(url + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res.data));
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  /* 🔄 LOADING STATE */
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]">
        <span className="loading loading-spinner w-20 h-20 text-indigo-400"></span>
      </div>
    );

  /* ❌ EMPTY FEED */
  if (!feedData || feedData.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
        <h1 className="text-3xl font-bold text-gray-300 animate-pulse">
          No more users found 🚀
        </h1>
      </div>
    );

  /* ✅ FEED UI */
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4">
      {/* Section title */}
      <h1 className="text-3xl md:text-4xl font-bold  mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400">
        Discover Developers
      </h1>

      {/* Card wrapper */}
      <div className="flex items-start justify-center w-full">
        <UserCard user={feedData[0]} />
      </div>
    </div>
  );
};

export default Feed;
