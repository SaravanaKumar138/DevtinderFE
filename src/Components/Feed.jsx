// import React, { useEffect, useState } from "react";
// import { url } from "../utils/constants";
// import { useDispatch, useSelector } from "react-redux";
// import { addFeed } from "../utils/feedSlice";
// import axios from "axios";
// import UserCard from "./UserCard";
// import Loading from "./Loading";

// const Feed = () => {
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);
//   const feedData = useSelector((store) => store.feed);

//   const getFeed = async () => {
//     try {
//       const res = await axios.get(url + "/user/feed", {
//         withCredentials: true,
//       });
//       dispatch(addFeed(res.data));
//     } catch (err) {
//       console.log(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getFeed();
//   }, []);

//   /* 🔄 LOADING STATE */
//   if (loading)
//     return (
//      <Loading />
//     );

//   /* ❌ EMPTY FEED */
//   if (!feedData || feedData.length === 0)
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white">
//         <h1 className="text-3xl font-bold text-gray-300 animate-pulse">
//           No more users found 🚀
//         </h1>
//       </div>
//     );

//   /* ✅ FEED UI */
//   return (
//     <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-4">
//       {/* Section title */}
//       <h1 className="text-3xl md:text-4xl font-bold  mb-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-400">
//         Discover Developers
//       </h1>

//       {/* Card wrapper */}
//       <div className="flex items-start justify-center w-full">
//         <UserCard user={feedData[0]} />
//       </div>
//     </div>
//   );
// };

// export default Feed;


import React, { useEffect, useState } from "react";
import { url } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import axios from "axios";
import UserCard from "./UserCard";
import Loading from "./Loading";

const Feed = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Track current page
  const [hasMore, setHasMore] = useState(true); // Track if there's more data to fetch
  const feedData = useSelector((store) => store.feed);

  const limit = 10; // Set your limit per request

  const getFeed = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${url}/user/feed?page=${page}&limit=${limit}`,
        {
          withCredentials: true,
        }
      );

      // If the API returns fewer users than the limit, we've reached the end
      if (res.data.length < limit) {
        setHasMore(false);
      }

      dispatch(addFeed(res.data));
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and fetch when page changes
  useEffect(() => {
    if (hasMore) {
      getFeed();
    }
  }, [page]);

  // When the user swipes through all cards (feedData becomes empty),
  // increment the page to fetch the next batch.
  useEffect(() => {
    if (feedData && feedData.length === 0 && !loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [feedData, loading, hasMore]);

  /* 🔄 LOADING STATE */
  // Only show loading screen on the very first load or when switching pages
  if (loading && (!feedData || feedData.length === 0)) {
    return <Loading />;
  }

  /* ❌ EMPTY FEED (TRULY NO MORE USERS) */
  if ((!feedData || feedData.length === 0) && !hasMore) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1d1b31] text-white">
        <h1 className="text-3xl font-bold text-[#d8b4fe] animate-pulse">
          No more users found 🚀
        </h1>
      </div>
    );
  }

  /* ✅ FEED UI */
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#1d1b31] text-white px-4 pt-10">
      {/* Section title matching your UI theme */}
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#d8b4fe] text-center mb-10 tracking-tight">
        Discover Developers
      </h1>

      {/* Card wrapper */}
      <div className="flex items-start justify-center w-full">
        {feedData && feedData.length > 0 && <UserCard user={feedData[0]} />}
      </div>
    </div>
  );
};

export default Feed;