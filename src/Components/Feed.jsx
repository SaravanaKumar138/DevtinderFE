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
      const res = await axios.get(url + "/user/feed",  { withCredentials: true });
      setLoading(false);
      dispatch(addFeed(res.data));
      console.log(res.data);
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);
  if (loading) return (
    <div className="flex justify-center h-screen items-center">
      <span className="loading loading-spinner w-20 h-20 "></span>
    </div>
  ); 
  if (!feedData || feedData.length === 0) return <h1 className="text-center flex justify-center h-screen items-center font-bold text-3xl">No more users found</h1>;

  return <div className="flex justify-center m-10">
    <UserCard user={feedData[0]}/>
    
  </div>;
};

export default Feed;
